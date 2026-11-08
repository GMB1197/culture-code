<script setup>
import { computed } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { toasts, state, dayKey } from './lib/store'
const route = useRoute()

const GAMES = ['/giochi', '/indovina', '/decifra', '/password', '/ip-dns', '/arte', '/binario', '/museo']
const tabs = [
  { to: '/', label: 'Home', match: ['/'] },
  { to: '/giochi', label: 'Giochi', match: GAMES },
  { to: '/sfida', label: 'Sfida del giorno', match: ['/sfida'], center: true },
  { to: '/mappa', label: 'Mappa di Napoli', match: ['/mappa'] },
  { to: '/profilo', label: 'Profilo', match: ['/profilo', '/qr'] }
]
const active = computed(() => tabs.findIndex((t) => t.match.includes(route.path)))
const dailyPending = computed(() => !state.daily[dayKey()])
</script>

<template>
  <header class="top">
    <RouterLink to="/" class="brand"><span class="mark">&lt;/&gt;</span> culture code</RouterLink>
    <RouterLink to="/profilo" class="chip" aria-label="Il tuo profilo">
      <span v-if="state.streak">🔥 {{ state.streak }}</span>
      <span>{{ state.xp }} XP</span>
    </RouterLink>
  </header>

  <main class="page" :class="{ wide: route.path === '/' }">
    <RouterView v-slot="{ Component }">
      <Suspense>
        <component :is="Component" :key="route.path" />
        <template #fallback><p class="muted center">Caricamento…</p></template>
      </Suspense>
    </RouterView>
  </main>

  <nav class="dock" aria-label="Navigazione principale">
    
      <span v-if="active >= 0" class="bubble" :style="{ '--i': active }" aria-hidden="true"></span>
      <RouterLink v-for="(t, i) in tabs" :key="t.to" :to="t.to" class="dock-item" :class="{ on: i === active }" :aria-label="t.label" :title="t.label">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <template v-if="i === 0"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" /></template>
          <template v-else-if="i === 1"><rect x="3.5" y="3.5" width="7" height="7" rx="2" /><rect x="13.5" y="3.5" width="7" height="7" rx="2" /><rect x="3.5" y="13.5" width="7" height="7" rx="2" /><rect x="13.5" y="13.5" width="7" height="7" rx="2" /></template>
          <template v-else-if="i === 2"><path d="M12 3c1 3.5 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .3 1.2 1 2 2 2-.5-3 0-5 1-8z" /></template>
          <template v-else-if="i === 3"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></template>
          <template v-else><circle cx="12" cy="8.5" r="4" /><path d="M4.5 21c.8-4 3.8-6 7.5-6s6.7 2 7.5 6" /></template>
        </svg>
        <i v-if="t.center && dailyPending" class="dot" aria-hidden="true"></i>
        <span v-if="t.center && state.streak" class="streak">🔥{{ state.streak }}</span>
      </RouterLink>
  </nav>

  <div class="toasts" aria-live="polite">
    <div v-for="t in toasts" :key="t.id" class="toast">{{ t.text }}</div>
  </div>
</template>
