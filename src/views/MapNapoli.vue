<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import L from 'leaflet'
import { NAPOLI } from '../lib/content'
import { I, iconSvg } from '../lib/icons'
import { state, addXp, unlock } from '../lib/store'

const el = ref(null)
const sel = ref(null)
const done = ref(state.progress.map ? [...state.progress.map] : [])
const answered = ref(null)
let map = null
const markers = {}

const point = computed(() => NAPOLI.find((p) => p.id === sel.value))

function icon(p) {
  const ok = done.value.includes(p.id)
  return L.divIcon({
    className: '',
    html: `<div class="pin${ok ? ' ok' : ''}">${iconSvg(ok ? I.check : I[p.ic])}</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  })
}

function select(id) {
  sel.value = id
  answered.value = null
  const p = NAPOLI.find((x) => x.id === id)
  if (map) map.flyTo([p.lat, p.lng], 15, { duration: 0.6 })
}

function answer(idx) {
  if (answered.value !== null) return
  answered.value = idx
  const p = point.value
  if (idx === p.a && !done.value.includes(p.id)) {
    done.value.push(p.id)
    state.progress.map = [...done.value]
    markers[p.id].setIcon(icon(p))
    addXp(10, p.name)
    if (done.value.length === NAPOLI.length) {
      addXp(20, 'Mappa completata')
      unlock('map')
    }
  }
}

onMounted(() => {
  map = L.map(el.value, { zoomControl: true }).setView([40.8447, 14.2528], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map)
  NAPOLI.forEach((p) => {
    markers[p.id] = L.marker([p.lat, p.lng], { icon: icon(p), title: p.name }).addTo(map).on('click', () => select(p.id))
  })
})
onBeforeUnmount(() => map && map.remove())
</script>

<template>
  <RouterLink to="/giochi" class="back"><Ic n="arrowLeft" /> Giochi</RouterLink>
  <h1>Mappa culturale di Napoli</h1>
  <p class="muted">Tocca un luogo: leggi la storia, scopri l'idea digitale e supera la sfida. {{ done.length }} / {{ NAPOLI.length }} completati.</p>

  <div ref="el" class="map"></div>

  <div v-if="point" class="card" style="margin-top:1rem">
    <div class="big"><Ic :n="point.ic" /></div>
    <h2 style="margin-top:.5rem">{{ point.name }}</h2>
    <p>{{ point.story }}</p>
    <div class="result"><strong><Ic n="lightbulb" /> Idea digitale</strong><br />{{ point.idea }}</div>
    <h3 style="margin-top:1rem">Sfida: {{ point.q }}</h3>
    <button v-for="(o, idx) in point.o" :key="idx" class="opt"
      :class="{ right: answered !== null && idx === point.a, wrong: answered === idx && idx !== point.a }"
      :disabled="answered !== null" @click="answer(idx)">{{ o }}</button>
    <p v-if="answered !== null" class="note">{{ answered === point.a ? 'Esatto! Luogo completato.' : 'Non è questa: rileggi la storia e riprova da un altro luogo, poi torna qui.' }}</p>
  </div>

  <div v-else class="card note">Scegli un luogo sulla mappa oppure dall'elenco:
    <div class="row" style="margin-top:.6rem">
      <button v-for="p in NAPOLI" :key="p.id" class="btn ghost" style="padding:.3rem .7rem;font-size:.85rem" @click="select(p.id)"><Ic :n="done.includes(p.id) ? 'check' : p.ic" /> {{ p.name }}</button>
    </div>
  </div>
</template>

<style>
.map { height: 340px; border-radius: 16px; border: 1px solid var(--line); overflow: hidden; z-index: 1; }
.leaflet-container { background: #14141b; }
.pin { width: 38px; height: 38px; display: grid; place-items: center; font-size: 1.3rem; background: #0b0b0f; border: 2px solid #f2b45a; border-radius: 50%; box-shadow: 0 4px 14px rgba(0, 0, 0, .5); }
.pin.ok { border-color: #6fcf97; color: #6fcf97; font-weight: 700; }
</style>
