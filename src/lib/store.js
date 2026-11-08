import { reactive, watch, computed } from 'vue'

const KEY = 'cltrcode:v1'

export const LEVELS = [
  { name: 'Apprendista', min: 0 },
  { name: 'Sviluppatore', min: 150 },
  { name: 'Hacker culturale', min: 400 }
]

export const BADGES = {
  first: { icon: 'wand', name: 'Prima scintilla', desc: 'Hai completato il tuo primo gioco' },
  daily: { icon: 'calendarCheck', name: 'Sfida accettata', desc: 'Hai completato una sfida del giorno' },
  streak3: { icon: 'fire', name: 'In striscia', desc: '3 giorni di fila' },
  streak7: { icon: 'bolt', name: 'Settimana di fuoco', desc: '7 giorni di fila' },
  crypto: { icon: 'unlock', name: 'Decifratore', desc: 'Hai risolto tutti i livelli di crittografia' },
  strongpw: { icon: 'shield', name: 'Password blindata', desc: 'Una password che resiste per secoli' },
  quiz: { icon: 'brain', name: 'Mente curiosa', desc: 'Punteggio pieno a Indovina il codice' },
  dns: { icon: 'globe', name: 'Re del DNS', desc: 'Hai chiuso IP o DNS? con almeno 9 su 10' },
  vision: { icon: 'eye', name: 'Occhio artificiale', desc: 'Hai fatto leggere un\'immagine al computer' },
  museum: { icon: 'landmark', name: 'Visitatore', desc: 'Hai ascoltato tutte le tappe del museo' },
  map: { icon: 'map', name: 'Esploratore di Napoli', desc: 'Hai superato tutte le sfide sulla mappa' },
  binary: { icon: 'chip', name: 'Nome in binario', desc: 'Hai tradotto il tuo nome' }
}

export function dayKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function daysBetween(a, b) {
  const da = new Date(a + 'T12:00:00')
  const db = new Date(b + 'T12:00:00')
  return Math.round((db - da) / 86400000)
}

const blank = () => ({
  xp: 0,
  streak: 0,
  lastDay: null,
  bestStreak: 0,
  badges: [],
  daily: {}, // { 'YYYY-MM-DD': { score, grid } }
  progress: {} // per gioco
})

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...blank(), ...JSON.parse(raw) }
  } catch (e) {
    /* storage non disponibile */
  }
  return blank()
}

export const state = reactive(load())

watch(
  state,
  () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch (e) {
      /* ignora */
    }
  },
  { deep: true }
)

export const toasts = reactive([])
function toast(text) {
  const t = { id: Math.random(), text }
  toasts.push(t)
  setTimeout(() => {
    const i = toasts.findIndex((x) => x.id === t.id)
    if (i >= 0) toasts.splice(i, 1)
  }, 3200)
}

export const level = computed(() => {
  let idx = 0
  LEVELS.forEach((l, i) => {
    if (state.xp >= l.min) idx = i
  })
  const cur = LEVELS[idx]
  const next = LEVELS[idx + 1]
  return {
    index: idx,
    name: cur.name,
    next: next ? next.name : null,
    pct: next ? Math.round(((state.xp - cur.min) / (next.min - cur.min)) * 100) : 100,
    toNext: next ? next.min - state.xp : 0
  }
})

export function unlock(id) {
  if (!BADGES[id] || state.badges.includes(id)) return
  state.badges.push(id)
  toast(`${BADGES[id].icon} Badge sbloccato: ${BADGES[id].name}`)
}

// Segna attività del giorno e aggiorna la striscia
export function touchStreak() {
  const today = dayKey()
  if (state.lastDay === today) return
  if (state.lastDay && daysBetween(state.lastDay, today) === 1) state.streak += 1
  else state.streak = 1
  state.lastDay = today
  state.bestStreak = Math.max(state.bestStreak, state.streak)
  if (state.streak >= 3) unlock('streak3')
  if (state.streak >= 7) unlock('streak7')
}

export function addXp(n, label) {
  const before = level.value.index
  touchStreak()
  state.xp += n
  toast(`+${n} XP${label ? ' · ' + label : ''}`)
  if (level.value.index > before) toast(`🎉 Nuovo livello: ${level.value.name}`)
  unlock('first')
}

// Streak "viva": se l'ultimo giorno attivo è ieri o oggi
export const streakAlive = computed(() => {
  if (!state.lastDay) return false
  return daysBetween(state.lastDay, dayKey()) <= 1
})

export function resetAll() {
  Object.assign(state, blank())
}
