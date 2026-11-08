<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { QUESTIONS } from '../lib/content'
import { seededRng, shuffle } from '../lib/daily'
import { caesar, normalizeAnswer } from '../lib/ciphers'
import { state, dayKey, addXp, unlock, level } from '../lib/store'
import { shareCard } from '../lib/share'

const today = dayKey()
const rng = seededRng('cltrcode:' + today)

const WORDS = ['ALGORITMO', 'BINARIO', 'PIXEL', 'CODICE', 'NAPOLI', 'MUSEO', 'DATABASE', 'ALFABETO', 'SERVER', 'LINGUAGGIO', 'TELAIO', 'VESUVIO', 'PROGRAMMA', 'SCHERMO', 'MEMORIA', 'RETE', 'CIFRARIO', 'ARCHIVIO', 'PASSWORD', 'ARTE']

// 2 domande (una tecnica, una di cultura/Napoli) + 1 cifrario
const picks = shuffle(QUESTIONS.filter((q) => q.cat === 'info'), rng)[0]
const picks2 = shuffle(QUESTIONS.filter((q) => q.cat !== 'info'), rng)[0]
const steps = [picks, picks2].map((q) => ({ type: 'q', q, opts: shuffle(q.o.map((t, idx) => ({ text: t, ok: idx === q.a })), rng) }))
const word = WORDS[Math.floor(rng() * WORDS.length)]
const shift = 1 + Math.floor(rng() * 25)
steps.push({ type: 'c', word, shift, enc: caesar(word, shift) })

const done = ref(state.daily[today] || null)
const step = ref(0)
const picked = ref(null)
const answer = ref('')
const correct = ref(null)
const grid = ref([])

const cur = computed(() => steps[step.value])

function pickOpt(idx) {
  if (picked.value !== null) return
  picked.value = idx
  correct.value = cur.value.opts[idx].ok
}
function submit() {
  correct.value = normalizeAnswer(answer.value) === cur.value.word
  picked.value = 1
}
function next() {
  grid.value.push(correct.value ? '🟩' : '🟥')
  picked.value = null
  correct.value = null
  answer.value = ''
  if (step.value + 1 < steps.length) step.value++
  else finish()
}
function finish() {
  const score = grid.value.filter((g) => g === '🟩').length
  state.daily[today] = { score, grid: grid.value.join('') }
  done.value = state.daily[today]
  addXp(10 + score * 10, 'Sfida del giorno')
  unlock('daily')
}

const sharing = ref('')
async function share() {
  const d = done.value
  const r = await shareCard(
    { title: 'Sfida del giorno', big: `${d.score}/3`, lines: [d.grid, `🔥 Striscia: ${state.streak}`, level.value.name] },
    `Sfida del giorno su Culture Code ${d.grid} ${d.score}/3`
  )
  sharing.value = r === 'download' ? 'Immagine salvata: caricala nelle tue storie!' : ''
}
</script>

<template>
  <RouterLink to="/giochi" class="back">← Giochi</RouterLink>
  <h1>Sfida del giorno</h1>
  <p class="muted">{{ new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }) }} · stessa sfida per tutti</p>

  <div v-if="done" class="card center">
    <div class="big">{{ done.score === 3 ? '🏆' : '📅' }}</div>
    <h2 style="margin-top:.6rem">{{ done.score }} su 3</h2>
    <p style="font-size:2rem;margin:.2rem 0 1rem">{{ done.grid }}</p>
    <p class="muted">🔥 Striscia: {{ state.streak }} giorni · Torna domani per una nuova sfida.</p>
    <button class="btn block" @click="share">Condividi nelle storie</button>
    <p v-if="sharing" class="note" style="margin-top:.6rem">{{ sharing }}</p>
  </div>

  <div v-else class="card">
    <div class="row between note"><span class="pill">Prova {{ step + 1 }} / 3</span></div>
    <div class="bar" style="margin:.7rem 0"><i :style="{ width: (step / 3) * 100 + '%' }"></i></div>

    <template v-if="cur.type === 'q'">
      <div class="big">{{ cur.q.icon }}</div>
      <h2 style="margin-top:.6rem">{{ cur.q.q }}</h2>
      <button v-for="(o, idx) in cur.opts" :key="idx" class="opt"
        :class="{ right: picked !== null && o.ok, wrong: picked === idx && !o.ok }"
        :disabled="picked !== null" @click="pickOpt(idx)">{{ o.text }}</button>
      <div v-if="picked !== null" class="result" :class="correct ? 'good' : 'bad'">
        <strong>{{ correct ? 'Esatto!' : 'Non proprio.' }}</strong> {{ cur.q.why }}
      </div>
    </template>

    <template v-else>
      <div class="big">🔐</div>
      <h2 style="margin-top:.6rem">Decifra la parola</h2>
      <p class="muted">Ogni lettera è spostata in avanti di <strong>{{ cur.shift }}</strong> posti nell'alfabeto. Torna indietro per leggerla.</p>
      <div class="out mono" style="font-size:1.4rem;letter-spacing:.15em">{{ cur.enc }}</div>
      <form v-if="picked === null" @submit.prevent="submit">
        <input v-model="answer" type="text" placeholder="La parola in chiaro" autocomplete="off" autocapitalize="characters" />
        <button class="btn block" style="margin-top:.6rem" :disabled="!answer.trim()">Verifica</button>
      </form>
      <div v-else class="result" :class="correct ? 'good' : 'bad'">
        <strong>{{ correct ? 'Decifrato!' : 'Non è questa.' }}</strong> La parola era <strong>{{ cur.word }}</strong>.
      </div>
    </template>

    <button v-if="picked !== null" class="btn block" @click="next">{{ step + 1 < steps.length ? 'Avanti' : 'Concludi' }}</button>
  </div>
</template>
