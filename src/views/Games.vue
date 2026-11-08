<script setup>
import { RouterLink } from 'vue-router'
import { state, level, dayKey, BADGES } from '../lib/store'

const today = dayKey()
const doneToday = !!state.daily[today]

const games = [
  { to: '/indovina', ico: 'brain', t: 'Indovina il codice', d: 'Quiz tra informatica, Napoli e cultura' },
  { to: '/decifra', ico: 'key', t: 'Decifra il messaggio', d: '6 livelli di crittografia' },
  { to: '/password', ico: 'shield', t: 'Password Cracker', d: 'Quanto resiste la tua password?' },
  { to: '/ip-dns', ico: 'globe', t: 'IP o DNS?', d: 'Gioco rapido a tempo' },
  { to: '/arte', ico: 'eye', t: "Il computer vede l'arte", d: 'Carica una foto e guarda come la legge' }
]
const exp = [
  { to: '/museo', ico: 'landmark', t: 'Museo in tasca', d: 'Audioguida e realtà aumentata leggera' },
  { to: '/mappa', ico: 'map', t: 'Mappa di Napoli', d: '7 luoghi, 7 storie, 7 sfide' },
  { to: '/binario', ico: 'chip', t: 'Binario o alfabeto?', d: 'Il tuo nome in binario, Morse, ASCII' }
]
</script>

<template>
  <section>
    <p class="pill">sezione giochi</p>
    <h1>Gioca. Decifra. Scopri.</h1>
    <p class="muted">Mini giochi ed esperienze dal profilo <strong>@cltrcode</strong>: informatica spiegata bene, con la cultura al centro.</p>

    <RouterLink to="/sfida" v-tilt class="card tile" :class="{ done: doneToday }">
      <span class="ico"><Ic n="calendarDay" /></span>
      <strong>Sfida del giorno</strong>
      <small v-if="!doneToday">3 prove nuove ogni giorno. Mantieni la striscia{{ state.streak ? ' (' + state.streak + ' giorni)' : '' }}.</small>
      <small v-else>Completata oggi con {{ state.daily[today].score }}/3. Torna domani!</small>
    </RouterLink>

    <div class="card">
      <div class="row between">
        <strong>{{ level.name }}</strong>
        <span class="note">{{ state.xp }} XP{{ level.next ? ' · mancano ' + level.toNext + ' per ' + level.next : '' }}</span>
      </div>
      <div class="bar" style="margin-top:.5rem"><i :style="{ width: level.pct + '%' }"></i></div>
    </div>

    <h2>Giochi e quiz</h2>
    <div class="grid two">
      <RouterLink v-for="g in games" :key="g.to" :to="g.to" v-tilt class="tile">
        <span class="ico"><Ic :n="g.ico" /></span><strong>{{ g.t }}</strong><small>{{ g.d }}</small>
      </RouterLink>
    </div>

    <h2 style="margin-top:1.4rem">Esperienze</h2>
    <div class="grid two">
      <RouterLink v-for="g in exp" :key="g.to" :to="g.to" v-tilt class="tile">
        <span class="ico"><Ic :n="g.ico" /></span><strong>{{ g.t }}</strong><small>{{ g.d }}</small>
      </RouterLink>
    </div>

    <p class="note center" style="margin-top:1.6rem">
      {{ state.badges.length }}/{{ Object.keys(BADGES).length }} badge sbloccati ·
      <RouterLink to="/profilo">vedi profilo</RouterLink> · <RouterLink to="/qr">QR e reel</RouterLink>
    </p>
  </section>
</template>
