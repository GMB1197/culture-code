<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { toBinary, toMorse, toAscii, toHex, clean } from '../lib/ciphers'
import { addXp, unlock, state } from '../lib/store'
import { shareCard } from '../lib/share'

const name = ref('Napoli')
const text = computed(() => name.value.trim().slice(0, 16))
const bin = computed(() => toBinary(text.value))
const bytes = computed(() => bin.value.split(' ').filter(Boolean))
const msg = ref('')

async function share() {
  if (!text.value) return
  const first = bytes.value.slice(0, 4).join(' ')
  const r = await shareCard(
    { title: `Il mio nome in binario`, big: text.value.slice(0, 10), lines: [first + (bytes.value.length > 4 ? ' …' : ''), toMorse(clean(text.value)).slice(0, 40)] },
    `Il mio nome in binario: ${bin.value}`
  )
  msg.value = r === 'download' ? 'Immagine salvata: caricala nelle tue storie!' : ''
  if (!state.badges.includes('binary')) {
    addXp(10, 'Nome in binario')
    unlock('binary')
  }
}
</script>

<template>
  <RouterLink to="/giochi" class="back">← Giochi</RouterLink>
  <h1>Binario o alfabeto?</h1>
  <p class="muted">Scrivi il tuo nome (massimo 16 caratteri) e guarda come lo vede un computer.</p>

  <input v-model="name" type="text" maxlength="16" placeholder="Il tuo nome" style="margin-bottom:1rem" />

  <div class="card" v-if="text">
    <p class="note">Ogni lettera è un byte: 8 lampadine accese (1) o spente (0).</p>
    <div v-for="(b, i) in bytes" :key="i" class="row" style="margin-bottom:.4rem;flex-wrap:nowrap">
      <strong class="mono" style="width:1.6rem;text-align:center">{{ text[i] }}</strong>
      <span v-for="(bit, j) in b" :key="j" class="bulb" :class="{ on: bit === '1' }"></span>
    </div>
  </div>

  <template v-if="text">
    <div class="out"><small>Binario</small>{{ bin }}</div>
    <div class="out"><small>Codice ASCII / Unicode (decimale)</small>{{ toAscii(text) }}</div>
    <div class="out"><small>Esadecimale</small>{{ toHex(text) }}</div>
    <div class="out"><small>Morse</small>{{ toMorse(clean(text)) }}</div>
    <button class="btn block" style="margin-top:.8rem" @click="share">Crea la card da condividere</button>
    <p v-if="msg" class="note">{{ msg }}</p>
  </template>
</template>

<style scoped>
.bulb { width: 22px; height: 22px; border-radius: 50%; background: var(--bg3); border: 1px solid var(--line); flex: none; transition: background .2s, box-shadow .2s; }
.bulb.on { background: var(--accent); box-shadow: 0 0 10px rgba(242, 180, 90, .7); border-color: var(--accent); }
</style>
