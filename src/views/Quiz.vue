<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { QUESTIONS, CAT_LABEL, CAT_ICON } from '../lib/content'
import { shuffle } from '../lib/daily'
import { addXp, unlock } from '../lib/store'

const cat = ref('all')
const ROUND = 8
const questions = ref([])
const i = ref(0)
const picked = ref(null)
const score = ref(0)
const finished = ref(false)
const started = ref(false)

function start() {
  const pool = cat.value === 'all' ? QUESTIONS : QUESTIONS.filter((q) => q.cat === cat.value)
  questions.value = shuffle(pool).slice(0, ROUND).map((q) => {
    // mescola le risposte mantenendo traccia di quella giusta
    const opts = q.o.map((text, idx) => ({ text, ok: idx === q.a }))
    return { ...q, opts: shuffle(opts) }
  })
  i.value = 0
  score.value = 0
  picked.value = null
  finished.value = false
  started.value = true
}

const q = computed(() => questions.value[i.value])

function pick(idx) {
  if (picked.value !== null) return
  picked.value = idx
  if (q.value.opts[idx].ok) score.value++
}

function next() {
  if (i.value + 1 < questions.value.length) {
    i.value++
    picked.value = null
  } else {
    finished.value = true
    const total = questions.value.length
    const xp = score.value * 5 + (score.value === total ? 10 : 0)
    addXp(xp, 'Indovina il codice')
    if (score.value === total && total >= 5) unlock('quiz')
  }
}
</script>

<template>
  <RouterLink to="/giochi" class="back"><Ic n="arrowLeft" /> Giochi</RouterLink>
  <h1>Indovina il codice</h1>

  <div v-if="!started" class="card">
    <p class="muted">8 domande tra informatica, Napoli e storia del codice. Scegli un tema.</p>
    <div class="row" style="margin-bottom:1rem">
      <button v-for="(label, key) in { all: 'Tutte', ...CAT_LABEL }" :key="key" class="btn" :class="{ ghost: cat !== key }" @click="cat = key">{{ label }}</button>
    </div>
    <button class="btn block" @click="start">Inizia</button>
  </div>

  <div v-else-if="!finished" class="card">
    <div class="row between note">
      <span class="pill">{{ CAT_LABEL[q.cat] }}</span>
      <span>{{ i + 1 }} / {{ questions.length }}</span>
    </div>
    <div class="bar" style="margin:.7rem 0"><i :style="{ width: (i / questions.length) * 100 + '%' }"></i></div>
    <div class="big"><Ic :n="CAT_ICON[q.cat]" /></div>
    <h2 style="margin-top:.6rem">{{ q.q }}</h2>
    <button
      v-for="(o, idx) in q.opts"
      :key="idx"
      class="opt"
      :class="{ right: picked !== null && o.ok, wrong: picked === idx && !o.ok }"
      :disabled="picked !== null"
      @click="pick(idx)"
    >{{ o.text }}</button>
    <template v-if="picked !== null">
      <div class="result" :class="q.opts[picked].ok ? 'good' : 'bad'">
        <strong>{{ q.opts[picked].ok ? 'Esatto!' : 'Non proprio.' }}</strong> {{ q.why }}
      </div>
      <button class="btn block" @click="next">{{ i + 1 < questions.length ? 'Avanti' : 'Vedi il risultato' }}</button>
    </template>
  </div>

  <div v-else class="card center">
    <div class="big"><Ic :n="score === questions.length ? 'trophy' : 'bullseye'" /></div>
    <h2 style="margin-top:.6rem">{{ score }} su {{ questions.length }}</h2>
    <p class="muted">{{ score === questions.length ? 'Punteggio pieno. Mente curiosa!' : 'Ogni errore è una curiosità in più. Riprova!' }}</p>
    <div class="row" style="justify-content:center">
      <button class="btn" @click="start">Rigioca</button>
      <button class="btn ghost" @click="started = false">Cambia tema</button>
    </div>
  </div>
</template>
