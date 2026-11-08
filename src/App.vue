<script setup>
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { toasts, state, level } from './lib/store'
const route = useRoute()
</script>

<template>
  <header class="top">
    <RouterLink to="/" class="brand"><span class="mark">&lt;/&gt;</span> culture code</RouterLink>
    <RouterLink to="/profilo" class="chip" aria-label="Il tuo profilo">
      <span v-if="state.streak">🔥 {{ state.streak }}</span>
      <span>{{ state.xp }} XP</span>
    </RouterLink>
  </header>

  <main class="page">
    <RouterView v-slot="{ Component }">
      <Suspense>
        <component :is="Component" :key="route.path" />
        <template #fallback><p class="muted center">Caricamento…</p></template>
      </Suspense>
    </RouterView>
  </main>

  <nav class="tabbar" aria-label="Navigazione">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/sfida">Sfida</RouterLink>
    <RouterLink to="/mappa">Mappa</RouterLink>
    <RouterLink to="/profilo">{{ level.name.split(' ')[0] }}</RouterLink>
  </nav>

  <div class="toasts" aria-live="polite">
    <div v-for="t in toasts" :key="t.id" class="toast">{{ t.text }}</div>
  </div>
</template>
