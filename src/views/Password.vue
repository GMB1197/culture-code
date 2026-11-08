<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { analyze, humanTime, GUESSES_PER_SEC } from '../lib/password'
import { addXp, unlock, state } from '../lib/store'

const pw = ref('')
const show = ref(false)
const res = computed(() => analyze(pw.value))
const colors = ['#eb5757', '#e9895c', '#f2b45a', '#9ccf6f', '#6fcf97']
const rewarded = ref(false)

function reward() {
  if (rewarded.value || res.value.empty) return
  rewarded.value = true
  addXp(10, 'Password Cracker')
  if (res.value.score >= 4) unlock('strongpw')
}
function onBlur() {
  if (pw.value.length >= 4) reward()
}
function tryPhrase() {
  pw.value = 'cavallo-lampada-mare-vulcano'
}

const tips = [
  'La lunghezza conta più dei simboli: 4 parole casuali battono "P@ssw0rd!".',
  'Una password diversa per ogni servizio: se ne cade una, le altre restano al sicuro.',
  'Un gestore di password le ricorda per te. Tu ne ricordi solo una.',
  'Dove puoi, attiva anche l\'autenticazione a due fattori.'
]
</script>

<template>
  <RouterLink to="/" class="back">← Home</RouterLink>
  <h1>Password Cracker</h1>
  <p class="muted">Scrivi una password e guarda quanto ci metterebbe un attaccante a indovinarla. Tutto resta nel tuo telefono: non viene inviata a nessuno.</p>

  <div class="card">
    <input v-model="pw" :type="show ? 'text' : 'password'" placeholder="Scrivi una password di prova" autocomplete="off" @blur="onBlur" />
    <div class="row between" style="margin-top:.6rem">
      <label class="note"><input v-model="show" type="checkbox" /> Mostra</label>
      <button class="btn ghost" style="padding:.3rem .8rem;font-size:.85rem" @click="tryPhrase">Prova una frase lunga</button>
    </div>

    <template v-if="!res.empty">
      <div class="bar" style="margin:1rem 0 .5rem">
        <i :style="{ width: (res.score + 1) * 20 + '%', background: colors[res.score] }"></i>
      </div>
      <div class="row between">
        <strong :style="{ color: colors[res.score] }">{{ res.label }}</strong>
        <span class="note">entropia ≈ {{ res.entropy }} bit</span>
      </div>
      <div class="result">
        ⏱️ Tempo medio per scoprirla:<br />
        <strong style="font-size:1.4rem">{{ humanTime(res.seconds) }}</strong>
      </div>
      <ul v-if="res.flags.length" class="note" style="padding-left:1.1rem">
        <li v-for="f in res.flags" :key="f">{{ f }}</li>
      </ul>
    </template>
  </div>

  <div class="card">
    <h2>Come lo calcoliamo</h2>
    <p class="note">Stimiamo quante combinazioni esistono in base alla lunghezza e ai tipi di caratteri, penalizziamo parole comuni, sequenze e anni, e supponiamo un attaccante che prova {{ (GUESSES_PER_SEC / 1e9).toLocaleString('it-IT') }} miliardi di tentativi al secondo su un database rubato. È una stima didattica, non una garanzia.</p>
    <h2>Consigli</h2>
    <ul class="note" style="padding-left:1.1rem;margin:0">
      <li v-for="t in tips" :key="t">{{ t }}</li>
    </ul>
  </div>
</template>
