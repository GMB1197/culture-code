<script setup>
import { computed, nextTick, onMounted } from 'vue'
import Cursor from './components/Cursor.vue'
import { gsap, reduced } from './lib/motion'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { toasts, state, dayKey } from './lib/store'
const route = useRoute()

const GAMES = ['/giochi', '/indovina', '/decifra', '/password', '/ip-dns', '/arte', '/binario', '/museo']
const tabs = [
  { to: '/', ic: 'home', label: 'Home', match: ['/'] },
  { to: '/giochi', ic: 'gamepad', label: 'Giochi', match: GAMES },
  { to: '/sfida', ic: 'fire', label: 'Sfida del giorno', match: ['/sfida'], center: true },
  { to: '/mappa', ic: 'map', label: 'Mappa di Napoli', match: ['/mappa'] },
  { to: '/profilo', ic: 'user', label: 'Profilo', match: ['/profilo', '/qr'] }
]
const active = computed(() => tabs.findIndex((t) => t.match.includes(route.path)))
const dailyPending = computed(() => !state.daily[dayKey()])

// ingresso delle pagine: i blocchi salgono a cascata (la landing si anima da sola)
function onEnter() {
  if (reduced()) return
  nextTick(() => {
    const page = document.querySelector('.page')
    if (!page) return
    let kids = [...page.children].filter((n) => !n.classList.contains('landing'))
    if (kids.length === 1 && kids[0].tagName === 'SECTION') kids = [...kids[0].children]
    if (!kids.length) return
    gsap.fromTo(kids, { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.07, ease: 'expo.out', overwrite: 'auto', clearProps: 'transform,opacity' })
  })
}

onMounted(() => {
  if (reduced()) return
  gsap.from('.dock', { yPercent: 160, opacity: 0, duration: 1.1, delay: 0.9, ease: 'elastic.out(1, 0.55)' })
  gsap.from('.top', { yPercent: -100, duration: 0.8, ease: 'expo.out' })
})
</script>

<template>
  <header class="top">
    <RouterLink to="/" class="brand"><span class="mark">&lt;/&gt;</span> culture code</RouterLink>
    <RouterLink to="/profilo" class="chip" aria-label="Il tuo profilo">
      <span v-if="state.streak"><Ic n="fire" /> {{ state.streak }}</span>
      <span>{{ state.xp }} XP</span>
    </RouterLink>
  </header>

  <main class="page" :class="{ wide: route.path === '/' }">
    <RouterView v-slot="{ Component }">
      <Suspense @resolve="onEnter">
        <component :is="Component" :key="route.path" />
        <template #fallback><p class="muted center">Caricamento…</p></template>
      </Suspense>
    </RouterView>
  </main>

  <nav class="dock" aria-label="Navigazione principale">
    
      <span v-if="active >= 0" class="bubble" :style="{ '--i': active }" aria-hidden="true"></span>
      <RouterLink v-for="(t, i) in tabs" :key="t.to" :to="t.to" class="dock-item" :class="{ on: i === active }" :aria-label="t.label" :title="t.label">
        <Ic :n="t.ic" class="dk-ic" />
        <i v-if="t.center && dailyPending" class="dot" aria-hidden="true"></i>
        <span v-if="t.center && state.streak" class="streak">{{ state.streak }}</span>
      </RouterLink>
  </nav>

  <Cursor />

  <div class="toasts" aria-live="polite">
    <div v-for="t in toasts" :key="t.id" class="toast">{{ t.text }}</div>
  </div>
</template>
