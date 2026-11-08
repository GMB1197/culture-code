<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { DNS_ITEMS } from '../lib/content'
import { shuffle } from '../lib/daily'
import { addXp, unlock } from '../lib/store'

const ROUND = 10
const TIME = 6000
const choices = [
  { k: 'ip', label: 'Indirizzo IP', sub: 'il numero' },
  { k: 'dom', label: 'Dominio', sub: 'il nome' },
  { k: 'dns', label: 'DNS', sub: 'chi li collega' }
]

const phase = ref('intro')
const cards = ref([])
const i = ref(0)
const score = ref(0)
const left = ref(TIME)
const feedback = ref(null) // { ok, correct }
let timer = null

const card = computed(() => cards.value[i.value])

function start() {
  const pick = (t, n) => shuffle(DNS_ITEMS.filter((x) => x.t === t)).slice(0, n)
  cards.value = shuffle([...pick('ip', 3), ...pick('dom', 3), ...pick('dns', 4)])
  i.value = 0
  score.value = 0
  phase.value = 'play'
  runTimer()
}
function runTimer() {
  clearInterval(timer)
  left.value = TIME
  feedback.value = null
  const t0 = Date.now()
  timer = setInterval(() => {
    left.value = Math.max(0, TIME - (Date.now() - t0))
    if (left.value <= 0) answer(null)
  }, 50)
}
function answer(k) {
  if (feedback.value) return
  clearInterval(timer)
  const ok = k === card.value.t
  if (ok) score.value++
  feedback.value = { ok, correct: card.value.t, timeout: k === null }
  setTimeout(next, ok ? 600 : 1300)
}
function next() {
  if (i.value + 1 < cards.value.length) {
    i.value++
    runTimer()
  } else {
    phase.value = 'end'
    addXp(score.value * 3 + (score.value >= 9 ? 10 : 0), 'IP o DNS?')
    if (score.value >= 9) unlock('dns')
  }
}
onBeforeUnmount(() => clearInterval(timer))
const label = (k) => choices.find((c) => c.k === k).label
</script>

<template>
  <RouterLink to="/" class="back">← Home</RouterLink>
  <h1>IP o DNS?</h1>

  <div v-if="phase === 'intro'" class="card">
    <p>Su Internet ogni sito ha un <strong>indirizzo IP</strong> (un numero), un <strong>nome di dominio</strong> (quello che scrivi) e il <strong>DNS</strong> fa da rubrica tra i due.</p>
    <p class="muted">Ti mostro 10 carte: hai 6 secondi per decidere a quale categoria appartiene ciascuna.</p>
    <button class="btn block" @click="start">Via</button>
  </div>

  <div v-else-if="phase === 'play'" class="card">
    <div class="row between note"><span>{{ i + 1 }} / {{ cards.length }}</span><span>Punti: {{ score }}</span></div>
    <div class="bar" style="margin:.6rem 0 1rem"><i :style="{ width: (left / TIME) * 100 + '%', transition: 'none' }"></i></div>
    <div class="out center" style="font-size:1.3rem;padding:1.6rem 1rem;min-height:5.5rem">{{ card.s }}</div>
    <div class="grid" style="margin-top:.8rem">
      <button v-for="c in choices" :key="c.k" class="opt"
        :class="{ right: feedback && feedback.correct === c.k, wrong: feedback && !feedback.ok && !feedback.timeout && false }"
        :disabled="!!feedback" @click="answer(c.k)">
        <strong>{{ c.label }}</strong> <span class="note">· {{ c.sub }}</span>
      </button>
    </div>
    <p v-if="feedback && !feedback.ok" class="note center">{{ feedback.timeout ? 'Tempo scaduto.' : 'Non esatto.' }} Era: {{ label(feedback.correct) }}.</p>
  </div>

  <div v-else class="card center">
    <div class="big">{{ score >= 9 ? '🌐' : '📡' }}</div>
    <h2 style="margin-top:.6rem">{{ score }} su {{ cards.length }}</h2>
    <p class="muted">{{ score >= 9 ? 'Sei il re del DNS!' : 'Con un po\' di pratica la rubrica di Internet non ha segreti.' }}</p>
    <button class="btn" @click="start">Rigioca</button>
  </div>
</template>
