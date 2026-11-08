<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { MUSEUM } from '../lib/content'
import { state, addXp, unlock } from '../lib/store'

const route = useRoute()
const heard = ref(state.progress.museum ? [...state.progress.museum] : [])
const cur = ref(Math.max(0, MUSEUM.findIndex((m) => m.id === route.query.tappa)))
const speaking = ref(false)
const cam = ref(false)
const camError = ref('')
const video = ref(null)
let stream = null

const stop = computed(() => MUSEUM[cur.value])
const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

function mark() {
  if (heard.value.includes(stop.value.id)) return
  heard.value.push(stop.value.id)
  state.progress.museum = [...heard.value]
  addXp(5, 'Tappa')
  if (heard.value.length === MUSEUM.length) {
    addXp(15, 'Tour completo')
    unlock('museum')
  }
}

function speak() {
  if (!canSpeak) return
  window.speechSynthesis.cancel()
  if (speaking.value) { speaking.value = false; return }
  const u = new SpeechSynthesisUtterance(`${stop.value.title}. ${stop.value.text}`)
  u.lang = 'it-IT'
  u.rate = 0.95
  u.onend = () => { speaking.value = false; mark() }
  u.onerror = () => { speaking.value = false }
  speaking.value = true
  window.speechSynthesis.speak(u)
}

function select(i) {
  if (canSpeak) window.speechSynthesis.cancel()
  speaking.value = false
  cur.value = i
}

async function openCam() {
  camError.value = ''
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
    cam.value = true
    await new Promise((r) => setTimeout(r, 50))
    if (video.value) video.value.srcObject = stream
  } catch (e) {
    camError.value = 'Non riesco ad aprire la fotocamera. Controlla i permessi del browser.'
  }
}
function closeCam() {
  if (stream) stream.getTracks().forEach((t) => t.stop())
  stream = null
  cam.value = false
}
onBeforeUnmount(() => {
  closeCam()
  if (canSpeak) window.speechSynthesis.cancel()
})
</script>

<template>
  <RouterLink to="/giochi" class="back"><Ic n="arrowLeft" /> Giochi</RouterLink>
  <h1>Museo in tasca</h1>
  <p class="muted">Cinque oggetti che hanno cambiato il modo di scrivere, calcolare e raccontare. Ascolta l'audioguida oppure inquadra con la fotocamera.</p>

  <div class="row" style="margin-bottom:1rem">
    <button v-for="(m, i) in MUSEUM" :key="m.id" class="btn" :class="{ ghost: i !== cur }" style="padding:.4rem .8rem" @click="select(i)">
      <Ic :n="heard.includes(m.id) ? 'check' : m.ic" />
    </button>
  </div>

  <div class="card">
    <div class="big"><Ic :n="stop.ic" /></div>
    <p class="note" style="margin:.5rem 0 0">{{ stop.era }}</p>
    <h2>{{ stop.title }}</h2>
    <p>{{ stop.text }}</p>
    <div class="row">
      <button v-if="canSpeak" class="btn" @click="speak"><template v-if="speaking"><Ic n="stop" /> Ferma</template><template v-else><Ic n="headphones" /> Ascolta</template></button>
      <button class="btn ghost" @click="mark">{{ heard.includes(stop.id) ? 'Visitata ✓' : 'Segna come visitata' }}</button>
      <button class="btn ghost" @click="openCam"><Ic n="camera" /> Realtà aumentata</button>
    </div>
    <p v-if="camError" class="note" style="margin-top:.6rem">{{ camError }}</p>
    <p class="note" style="margin-top:.8rem">Tappe visitate: {{ heard.length }} / {{ MUSEUM.length }}</p>
  </div>

  <div v-if="cam" class="ar">
    <video ref="video" autoplay playsinline muted></video>
    <div class="ar-card">
      <div class="ar-emoji"><Ic :n="stop.ic" /></div>
      <strong>{{ stop.title }}</strong>
      <small>{{ stop.era }}</small>
      <p>{{ stop.text.split('. ')[0] }}.</p>
    </div>
    <div class="ar-nav">
      <button class="btn ghost" @click="select((cur + MUSEUM.length - 1) % MUSEUM.length)">‹</button>
      <button class="btn" @click="closeCam">Chiudi</button>
      <button class="btn ghost" @click="select((cur + 1) % MUSEUM.length)">›</button>
    </div>
  </div>
</template>

<style scoped>
.ar { position: fixed; inset: 0; z-index: 100; background: #000; }
.ar video { width: 100%; height: 100%; object-fit: cover; }
.ar-card {
  position: absolute; left: 1rem; right: 1rem; top: 18%;
  background: rgba(11, 11, 15, .72); backdrop-filter: blur(8px);
  border: 1px solid rgba(242, 180, 90, .5); border-radius: 18px; padding: 1rem;
  animation: float 3.2s ease-in-out infinite;
}
.ar-card p { margin: .4rem 0 0; font-size: .95rem; }
.ar-card small { color: var(--muted); display: block; }
.ar-emoji { font-size: 2.4rem; }
.ar-nav { position: absolute; bottom: calc(env(safe-area-inset-bottom) + 1.5rem); left: 0; right: 0; display: flex; justify-content: center; gap: .8rem; }
.ar-nav .ghost { background: rgba(11, 11, 15, .7); }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
</style>
