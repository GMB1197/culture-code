<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import QRCode from 'qrcode'
import { REELS, siteUrl } from '../lib/config'
import { MUSEUM } from '../lib/content'

const items = ref([])

const GAMES = [
  ['/', 'Home'], ['/giochi', 'Giochi'], ['/sfida', 'Sfida del giorno'], ['/indovina', 'Indovina il codice'], ['/decifra', 'Decifra il messaggio'],
  ['/password', 'Password Cracker'], ['/ip-dns', 'IP o DNS?'], ['/arte', "Il computer vede l'arte"],
  ['/museo', 'Museo in tasca'], ['/mappa', 'Mappa di Napoli'], ['/binario', 'Binario o alfabeto?']
]

onMounted(async () => {
  const base = siteUrl()
  const list = [
    ...GAMES.map(([p, t]) => ({ title: t, url: base + p })),
    ...MUSEUM.map((m) => ({ title: 'Museo · ' + m.title, url: `${base}/museo?tappa=${m.id}` }))
  ]
  for (const it of list) {
    it.img = await QRCode.toDataURL(it.url, { margin: 1, width: 360, color: { dark: '#0b0b0f', light: '#ffffff' } })
  }
  items.value = list
})
const reelsWithLink = REELS
</script>

<template>
  <RouterLink to="/giochi" class="back">← Giochi</RouterLink>
  <h1>QR e reel</h1>
  <p class="muted">QR code pronti da mettere nei video, nelle storie o nei cartelli. Scaricali con il tasto. Se il sito è su un dominio tuo, imposta <span class="mono">VITE_SITE_URL</span> prima della build.</p>

  <div class="card">
    <h2>Reel → gioco</h2>
    <div v-for="r in reelsWithLink" :key="r.title" class="row between" style="margin-bottom:.5rem">
      <span>{{ r.title }}</span>
      <RouterLink :to="r.game" class="note">apri gioco →</RouterLink>
    </div>
    <p class="note">Per collegare i reel veri, modifica <span class="mono">src/lib/config.js</span>.</p>
  </div>

  <div class="grid two">
    <div v-for="it in items" :key="it.url" class="card center" style="margin:0">
      <img :src="it.img" :alt="'QR ' + it.title" style="width:100%;max-width:200px;border-radius:8px" />
      <strong style="display:block;margin:.5rem 0 .2rem;font-size:.9rem">{{ it.title }}</strong>
      <a class="note" :href="it.img" :download="'qr-' + it.title.replace(/\W+/g, '-').toLowerCase() + '.png'">Scarica PNG</a>
    </div>
  </div>
</template>
