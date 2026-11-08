<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { CIPHER_LEVELS, vigenere } from '../lib/content'
import { caesar, atbash, toBinary, toMorse, normalizeAnswer } from '../lib/ciphers'
import { state, addXp, unlock } from '../lib/store'

const solved = ref(state.progress.cipher ? [...state.progress.cipher] : [])
const idx = ref(Math.min(solved.value.length, CIPHER_LEVELS.length - 1))
const answer = ref('')
const status = ref(null) // null | 'ok' | 'ko'
const showHint = ref(false)
const tryShift = ref(0)

const lvl = computed(() => CIPHER_LEVELS[idx.value])
const encoded = computed(() => {
  const l = lvl.value
  switch (l.kind) {
    case 'caesar': return caesar(l.plain, l.shift)
    case 'atbash': return atbash(l.plain)
    case 'binary': return toBinary(l.plain)
    case 'morse': return toMorse(l.plain)
    case 'vigenere': return vigenere(l.plain, l.key)
    default: return ''
  }
})
const tried = computed(() => caesar(encoded.value, -tryShift.value))
const allDone = computed(() => solved.value.length === CIPHER_LEVELS.length)

function check() {
  if (normalizeAnswer(answer.value) === lvl.value.plain) {
    status.value = 'ok'
    if (!solved.value.includes(lvl.value.id)) {
      solved.value.push(lvl.value.id)
      state.progress.cipher = [...solved.value]
      addXp(15, 'Livello ' + lvl.value.id)
      if (solved.value.length === CIPHER_LEVELS.length) unlock('crypto')
    }
  } else status.value = 'ko'
}
function go(i) {
  idx.value = i
  answer.value = ''
  status.value = null
  showHint.value = false
  tryShift.value = 0
}
function next() {
  if (idx.value + 1 < CIPHER_LEVELS.length) go(idx.value + 1)
}
function reset() {
  solved.value = []
  state.progress.cipher = []
  go(0)
}
</script>

<template>
  <RouterLink to="/" class="back">← Home</RouterLink>
  <h1>Decifra il messaggio</h1>
  <div class="row" style="margin-bottom:1rem">
    <button v-for="(l, i) in CIPHER_LEVELS" :key="l.id" class="btn" :class="{ ghost: i !== idx }"
      :style="{ padding: '.4rem .8rem' }" :disabled="i > solved.length" @click="go(i)">
      {{ solved.includes(l.id) ? '✓' : l.id }}
    </button>
  </div>

  <div class="card">
    <span class="pill">Livello {{ lvl.id }}</span>
    <h2 style="margin-top:.5rem">{{ lvl.title }}</h2>
    <p class="muted">{{ lvl.story }}</p>
    <div class="out"><small>Messaggio cifrato</small>{{ encoded }}</div>

    <div v-if="lvl.brute" style="margin:.8rem 0">
      <p class="note">Prova uno spostamento: {{ tryShift }}</p>
      <input v-model.number="tryShift" type="range" min="0" max="25" />
      <div class="out"><small>Con spostamento {{ tryShift }}</small>{{ tried }}</div>
    </div>

    <form @submit.prevent="check">
      <input v-model="answer" type="text" placeholder="Scrivi il messaggio in chiaro" autocomplete="off" autocapitalize="characters" />
      <div class="row" style="margin-top:.6rem">
        <button class="btn" :disabled="!answer.trim()">Verifica</button>
        <button type="button" class="btn ghost" @click="showHint = !showHint">Aiuto</button>
      </div>
    </form>
    <p v-if="showHint" class="note" style="margin-top:.7rem">💡 {{ lvl.hint }}</p>

    <div v-if="status === 'ko'" class="result bad">Non è ancora questo. Controlla le lettere e riprova.</div>
    <div v-if="status === 'ok'" class="result good">
      <strong>Decifrato!</strong> «{{ lvl.plain }}»<br />
      <span class="note">{{ lvl.lesson }}</span>
      <div style="margin-top:.8rem">
        <button v-if="idx + 1 < CIPHER_LEVELS.length" class="btn" @click="next">Livello successivo</button>
        <span v-else>🏆 Hai chiuso tutti i livelli!</span>
      </div>
    </div>
  </div>

  <button v-if="allDone" class="btn ghost" @click="reset">Ricomincia da capo</button>
</template>
