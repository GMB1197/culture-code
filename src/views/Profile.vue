<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { state, level, BADGES, LEVELS, resetAll } from '../lib/store'
import { INSTAGRAM } from '../lib/config'

const canInstall = ref(!!window.__bip)
async function install() {
  const e = window.__bip
  if (!e) return
  e.prompt()
  await e.userChoice
  window.__bip = null
  canInstall.value = false
}
function reset() {
  if (confirm('Vuoi azzerare XP, striscia e badge?')) resetAll()
}
const days = Object.entries(state.daily).sort().reverse().slice(0, 7)
</script>

<template>
  <RouterLink to="/giochi" class="back">← Giochi</RouterLink>
  <h1>Il tuo profilo</h1>

  <div class="card">
    <div class="row between">
      <div><span class="pill">Livello</span><h2 style="margin:.4rem 0 0">{{ level.name }}</h2></div>
      <div class="center"><div class="big">🔥</div><strong>{{ state.streak }}</strong> <span class="note">giorni</span></div>
    </div>
    <div class="bar" style="margin:.8rem 0 .4rem"><i :style="{ width: level.pct + '%' }"></i></div>
    <p class="note">{{ state.xp }} XP{{ level.next ? ` · ${level.toNext} XP al livello ${level.next}` : ' · livello massimo' }} · record striscia: {{ state.bestStreak }}</p>
    <p class="note" style="margin:0">Livelli: {{ LEVELS.map((l) => `${l.name} (${l.min})`).join(' → ') }}</p>
  </div>

  <h2>Badge</h2>
  <div class="grid two">
    <div v-for="(b, id) in BADGES" :key="id" class="tile" :style="{ opacity: state.badges.includes(id) ? 1 : 0.4 }">
      <span class="ico">{{ state.badges.includes(id) ? b.icon : '🔒' }}</span>
      <strong>{{ b.name }}</strong><small>{{ b.desc }}</small>
    </div>
  </div>

  <div v-if="days.length" class="card" style="margin-top:1rem">
    <h2>Ultime sfide</h2>
    <div v-for="[d, v] in days" :key="d" class="row between"><span class="note">{{ d }}</span><span>{{ v.grid }}</span></div>
  </div>

  <div class="card" style="margin-top:1rem">
    <div class="row">
      <button v-if="canInstall" class="btn" @click="install">Installa l'app</button>
      <a class="btn ghost" :href="INSTAGRAM" target="_blank" rel="noopener">Instagram @cltrcode</a>
      <RouterLink class="btn ghost" to="/qr">QR e reel</RouterLink>
    </div>
    <p class="note" style="margin:.8rem 0 0">I progressi sono salvati solo su questo dispositivo.</p>
    <button class="btn ghost" style="margin-top:.6rem" @click="reset">Azzera progressi</button>
  </div>
</template>
