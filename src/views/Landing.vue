<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { INSTAGRAM } from '../lib/config'

const GITHUB = 'https://github.com/GMB1197/culture-code'

/* ---------- sfondo: pioggia di bit che reagisce al puntatore ---------- */
const cv = ref(null)
let raf = 0
let ro = null
const pointer = { x: -999, y: -999 }

function startRain() {
  const c = cv.value
  if (!c) return
  const g = c.getContext('2d')
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let w = 0, h = 0, cols = 0, drops = []
  const size = 18
  const resize = () => {
    const r = c.getBoundingClientRect()
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    w = r.width; h = r.height
    c.width = w * dpr; c.height = h * dpr
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    cols = Math.floor(w / size)
    drops = Array.from({ length: cols }, () => Math.random() * -40)
    g.fillStyle = '#0b0b0f'
    g.fillRect(0, 0, w, h)
  }
  resize()
  ro = new ResizeObserver(resize)
  ro.observe(c)
  g.font = `${size - 4}px ui-monospace, Menlo, monospace`
  const frame = () => {
    g.fillStyle = 'rgba(11,11,15,.14)'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < cols; i++) {
      const x = i * size
      const y = drops[i] * size
      const d = Math.hypot(x - pointer.x, y - pointer.y)
      const near = Math.max(0, 1 - d / 160)
      g.fillStyle = `rgba(242,180,90,${0.28 + near * 0.7})`
      g.fillText(Math.random() > 0.5 ? '1' : '0', x, y)
      if (y > h && Math.random() > 0.975) drops[i] = 0
      drops[i] += 0.35 + near * 0.9
    }
    if (!still) raf = requestAnimationFrame(frame)
  }
  frame()
}
function onMove(e) {
  const r = cv.value.getBoundingClientRect()
  const t = e.touches ? e.touches[0] : e
  pointer.x = t.clientX - r.left
  pointer.y = t.clientY - r.top
}

/* ---------- testo che si scrive da solo ---------- */
const lines = ['informatica spiegata bene', 'cultura che si può toccare', 'codice che è di tutti']
const typed = ref('')
let typeTimer = null
function typeLoop() {
  let li = 0, ci = 0, del = false
  const tick = () => {
    const full = lines[li]
    if (!del) {
      ci++
      typed.value = full.slice(0, ci)
      if (ci === full.length) { del = true; typeTimer = setTimeout(tick, 1600); return }
    } else {
      ci--
      typed.value = full.slice(0, ci)
      if (ci === 0) { del = false; li = (li + 1) % lines.length }
    }
    typeTimer = setTimeout(tick, del ? 30 : 70)
  }
  tick()
}

/* ---------- rivelazione allo scroll + parallasse ---------- */
let io = null
const heroY = ref(0)
let sy = 0
function onScroll() {
  if (sy) return
  sy = requestAnimationFrame(() => {
    heroY.value = Math.min(window.scrollY, 700)
    sy = 0
  })
}

/* ---------- demo: interruttori → lettera ---------- */
const bits = ref([0, 1, 0, 0, 0, 0, 1, 1])
const value = computed(() => parseInt(bits.value.join(''), 2))
const letter = computed(() => (value.value >= 33 && value.value < 127 ? String.fromCharCode(value.value) : value.value === 32 ? '␣' : '·'))
function setLetter(ch) {
  bits.value = ch.charCodeAt(0).toString(2).padStart(8, '0').split('').map(Number)
}
const weights = [128, 64, 32, 16, 8, 4, 2, 1]

onMounted(() => {
  startRain()
  typeLoop()
  io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
    { threshold: 0.15 }
  )
  document.querySelectorAll('.rv').forEach((el) => io.observe(el))
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  cancelAnimationFrame(sy)
  clearTimeout(typeTimer)
  io && io.disconnect()
  ro && ro.disconnect()
  window.removeEventListener('scroll', onScroll)
})

const topics = ['IP', 'DNS', 'password', 'database', 'cloud', 'intelligenza artificiale', 'binario', 'crittografia', 'realtà aumentata', 'audioguide', 'Napoli', 'arte']
const principles = [
  ['Leggi', 'Il codice è visibile: puoi aprirlo e capire come funziona ogni gioco.'],
  ['Copia', 'Prendilo, usalo per un tuo progetto, a scuola, in un museo.'],
  ['Modifica', 'Cambia domande, colori, lingua. Il tuo fork è il benvenuto.'],
  ['Condividi', "Ridistribuiscilo. Basta mantenere l'avviso di copyright."]
]
const local = [
  ['Nessun account', 'Entri e giochi. Niente registrazione, niente email.'],
  ['Nessun tracker', 'Non ci sono pubblicità né analytics nel codice.'],
  ['Dati sul tuo dispositivo', 'XP, striscia e badge restano nel tuo browser.'],
  ['Funziona anche offline', "Installala come app: dopo il primo caricamento gira da sola."]
]
</script>

<template>
  <div class="landing">
    <!-- HERO -->
    <section class="hero" @mousemove="onMove" @touchmove.passive="onMove">
      <canvas ref="cv" class="rain" aria-hidden="true"></canvas>
      <div class="hero-in" :style="{ transform: `translateY(${heroY * 0.25}px)`, opacity: Math.max(0, 1 - heroY / 600) }">
        <p class="pill">profilo social · open source · @cltrcode</p>
        <h1 class="mega">Il codice<br />è <em>cultura</em>.</h1>
        <p class="type mono"><span>&gt; </span>{{ typed }}<i class="caret"></i></p>
        <div class="row" style="margin-top:1.4rem">
          <RouterLink to="/giochi" class="btn">Entra nei giochi</RouterLink>
          <a href="#profilo" class="btn ghost">Cos'è Culture Code</a>
        </div>
      </div>
      <a href="#profilo" class="scroll" aria-label="Scorri">↓</a>
    </section>

    <!-- MARQUEE -->
    <div class="marquee" aria-hidden="true">
      <div class="track">
        <span v-for="n in 2" :key="n"><b v-for="t in topics" :key="t + n">{{ t }}</b></span>
      </div>
    </div>

    <!-- PROFILO SOCIAL -->
    <section id="profilo" class="sec two-col">
      <div class="rv">
        <p class="pill">01 · il profilo</p>
        <h2 class="h2">Un profilo social che spiega l'informatica.</h2>
        <p class="lead">Culture Code vive su Instagram e YouTube con video brevi di circa 40 secondi: stile minimale e cinematografico, voce calda, ritmo dinamico. Ogni video prende un concetto — un IP, una password, un database — e lo racconta senza gergo.</p>
        <p class="lead">Il taglio distintivo è la cultura: audioguide digitali, realtà aumentata nei musei, computer che "leggono" un quadro, la storia del codice, Napoli.</p>
        <div class="row">
          <a class="btn" :href="INSTAGRAM" target="_blank" rel="noopener">Instagram</a>
          <RouterLink class="btn ghost" to="/qr">QR dei reel</RouterLink>
        </div>
      </div>
      <div class="rv d2 phone-wrap">
        <div class="phone">
          <div class="reel-bar"><i></i></div>
          <div class="reel-body">
            <span class="mono tiny">reel · 0:40</span>
            <div class="reel-title">Cos'è<br />un <em>DNS</em>?</div>
            <div class="reel-flow mono">
              <span>google.com</span><span class="arr">→</span><span class="ip">142.250.180.14</span>
            </div>
          </div>
          <div class="reel-foot mono tiny">@cltrcode</div>
        </div>
      </div>
    </section>

    <!-- BIT INTERATTIVI -->
    <section class="sec">
      <div class="rv center">
        <p class="pill">02 · tocca</p>
        <h2 class="h2">Ogni lettera è una fila di interruttori.</h2>
        <p class="lead mx">Accendi e spegni i bit: il computer somma i valori e trova la lettera. Prova con una delle scorciatoie.</p>
      </div>
      <div class="rv d2 bits-card">
        <div class="bit-row">
          <button
            v-for="(b, i) in bits" :key="i" class="bit" :class="{ on: b }"
            :aria-label="`bit ${weights[i]}: ${b ? 'acceso' : 'spento'}`"
            @click="bits[i] = b ? 0 : 1"
          >
            <span class="w mono">{{ weights[i] }}</span>
            <span class="v mono">{{ b }}</span>
          </button>
        </div>
        <div class="bit-out">
          <div><span class="tiny mono muted">valore</span><div class="mono num">{{ value }}</div></div>
          <div class="eq">=</div>
          <div><span class="tiny mono muted">carattere</span><div class="mono num letter">{{ letter }}</div></div>
        </div>
        <div class="row" style="justify-content:center;margin-top:1rem">
          <button v-for="c in ['C', 'U', 'L', 'T', '?']" :key="c" class="btn ghost" style="padding:.35rem .9rem" @click="setLetter(c)">{{ c }}</button>
        </div>
      </div>
    </section>

    <!-- OPEN SOURCE MIT -->
    <section class="sec two-col">
      <div class="rv">
        <p class="pill">03 · open source</p>
        <h2 class="h2">La conoscenza è come il codice: si apre.</h2>
        <p class="lead">Culture Code è rilasciato con <strong>licenza MIT</strong>, una delle più semplici e permissive. Non spieghiamo solo come funziona l'informatica: ti lasciamo smontare il progetto e riusarlo.</p>
        <ul class="principles">
          <li v-for="([t, d], i) in principles" :key="t" class="rv" :class="'d' + (i + 1)"><b>{{ t }}</b><span>{{ d }}</span></li>
        </ul>
        <a class="btn" :href="GITHUB" target="_blank" rel="noopener">Vedi il codice su GitHub</a>
      </div>
      <div class="rv d2 term" role="img" aria-label="Terminale che mostra i comandi per clonare il progetto e leggere la licenza">
        <div class="term-bar"><i></i><i></i><i></i><span class="mono tiny">~/cltrcode</span></div>
        <pre class="mono"><span class="l l1"><u>$</u> git clone github.com/GMB1197/culture-code</span>
<span class="l l2"><u>$</u> cd culture-code &amp;&amp; npm install</span>
<span class="l l3"><u>$</u> cat LICENSE | head -n 1</span>
<span class="l l4 ok">MIT License</span>
<span class="l l5"><u>$</u> npm run dev</span>
<span class="l l6 ok">➜ Local: http://localhost:5173/</span><span class="l l7"><u>$</u> <i class="caret"></i></span></pre>
      </div>
    </section>

    <!-- ON-PREMISE -->
    <section class="sec">
      <div class="rv center">
        <p class="pill">04 · stile on-premise</p>
        <h2 class="h2">Tutto in casa tua, non nel cloud di altri.</h2>
        <p class="lead mx">Come un software on-premise, l'esperienza gira sul tuo dispositivo. Il sito ti consegna l'app, poi il lavoro lo fa il tuo browser.</p>
      </div>

      <div class="rv d2 diagram" aria-hidden="true">
        <div class="node">🌍<small>sito</small></div>
        <div class="wire"><i></i></div>
        <div class="node big-node">📱<small>il tuo dispositivo<br />giochi · progressi · foto</small></div>
        <div class="wire off"><i></i><em>✕ nessun invio</em></div>
        <div class="node dim">☁️<small>server dati</small></div>
      </div>

      <div class="grid two" style="margin-top:1.4rem">
        <div v-for="([t, d], i) in local" :key="t" class="card rv" :class="'d' + (i + 1)">
          <strong>{{ t }}</strong>
          <p class="muted" style="margin:.3rem 0 0">{{ d }}</p>
        </div>
      </div>
      <p class="note center">La mappa di Napoli scarica le tessere cartografiche da OpenStreetMap: è l'unica richiesta esterna.</p>
    </section>

    <!-- CTA -->
    <section class="sec cta rv">
      <h2 class="h2">Pronto a giocare con il codice?</h2>
      <p class="lead mx">Cinque giochi, tre esperienze e una sfida nuova ogni giorno.</p>
      <RouterLink to="/giochi" class="btn" style="font-size:1.1rem;padding:.9rem 1.8rem">Apri la sezione giochi →</RouterLink>
    </section>

    <footer class="foot">
      <span class="mono">&lt;/&gt; culture code</span>
      <span>
        <a :href="INSTAGRAM" target="_blank" rel="noopener">Instagram</a> ·
        <a :href="GITHUB" target="_blank" rel="noopener">GitHub</a> ·
        Licenza MIT
      </span>
    </footer>
  </div>
</template>

<style scoped>
.landing { overflow-x: hidden; }
.mono { font-family: var(--mono); }
.tiny { font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; }

/* rivelazione */
.rv { opacity: 0; transform: translateY(28px); transition: opacity .8s ease, transform .8s cubic-bezier(.2, .7, .2, 1); }
.rv.in { opacity: 1; transform: none; }
.d1 { transition-delay: .05s } .d2 { transition-delay: .18s } .d3 { transition-delay: .3s } .d4 { transition-delay: .42s }

/* hero */
.hero { position: relative; min-height: calc(100svh - 3.2rem); display: grid; align-items: center; padding: 2rem 1.2rem 5rem; overflow: hidden; }
.rain { position: absolute; inset: 0; width: 100%; height: 100%; }
.hero::after { content: ''; position: absolute; inset: 0; background: radial-gradient(70% 60% at 30% 45%, rgba(11, 11, 15, .8) 0%, rgba(11, 11, 15, 0) 100%); pointer-events: none; }
.hero-in { position: relative; z-index: 2; max-width: 980px; margin: 0 auto; width: 100%; will-change: transform; }
.mega { font-size: clamp(3.2rem, 14vw, 8rem); line-height: .95; letter-spacing: -.04em; margin: 1rem 0 1.2rem; }
.mega em { font-style: normal; color: var(--accent); text-shadow: 0 0 40px rgba(242, 180, 90, .45); }
.type { font-size: clamp(1rem, 3.6vw, 1.4rem); color: var(--text); min-height: 2rem; margin: 0; }
.type span { color: var(--accent); }
.caret { display: inline-block; width: .6ch; height: 1.1em; background: var(--accent); vertical-align: text-bottom; margin-left: 2px; animation: blink 1s steps(2) infinite; }
@keyframes blink { 50% { opacity: 0 } }
.scroll { position: absolute; bottom: 1.6rem; left: 50%; transform: translateX(-50%); z-index: 2; color: var(--muted); font-size: 1.6rem; animation: bob 1.8s ease-in-out infinite; }
@keyframes bob { 50% { transform: translate(-50%, 8px) } }

/* marquee */
.marquee { border-block: 1px solid var(--line); overflow: hidden; background: var(--bg2); }
.track { display: flex; width: max-content; animation: scrollx 38s linear infinite; }
.track span { display: flex; }
.track b { font-weight: 600; font-size: clamp(1.1rem, 4vw, 1.6rem); padding: .9rem 1.4rem; color: var(--muted); white-space: nowrap; }
.track b::after { content: '✦'; color: var(--accent); margin-left: 2.8rem; }
@keyframes scrollx { to { transform: translateX(-50%) } }

/* sezioni */
.sec { max-width: 980px; margin: 0 auto; padding: 5rem 1.2rem; }
.sec.two-col { display: grid; gap: 2.4rem; align-items: center; }
@media (min-width: 820px) { .sec.two-col { grid-template-columns: 1.1fr .9fr; } }
.h2 { font-size: clamp(1.9rem, 6vw, 3.2rem); line-height: 1.05; letter-spacing: -.03em; margin: .8rem 0 1rem; }
.lead { font-size: 1.08rem; color: #cfcbd8; max-width: 56ch; }
.lead.mx { margin-inline: auto; }

/* telefono */
.phone-wrap { display: grid; place-items: center; }
.phone { width: 230px; aspect-ratio: 9/16; border-radius: 28px; border: 2px solid var(--line); background: linear-gradient(180deg, #1a1626, #0b0b0f); padding: 14px; display: flex; flex-direction: column; box-shadow: 0 30px 80px rgba(0, 0, 0, .6), 0 0 60px rgba(242, 180, 90, .08); animation: tilt 7s ease-in-out infinite; }
@keyframes tilt { 50% { transform: rotate(2.2deg) translateY(-8px) } }
.reel-bar { height: 3px; background: var(--line); border-radius: 9px; overflow: hidden; }
.reel-bar i { display: block; height: 100%; width: 0; background: var(--accent); animation: prog 6s linear infinite; }
@keyframes prog { to { width: 100% } }
.reel-body { flex: 1; display: grid; align-content: center; gap: .9rem; }
.reel-title { font-size: 2rem; font-weight: 800; line-height: 1; letter-spacing: -.03em; }
.reel-title em { font-style: normal; color: var(--accent); }
.reel-flow { display: grid; gap: .2rem; font-size: .78rem; }
.reel-flow .arr { color: var(--accent); animation: bob2 1.4s ease-in-out infinite; }
.reel-flow .ip { color: var(--accent); }
@keyframes bob2 { 50% { transform: translateX(8px) } }
.reel-foot { color: var(--muted); }

/* bit */
.bits-card { margin: 2rem auto 0; max-width: 640px; background: var(--bg2); border: 1px solid var(--line); border-radius: 22px; padding: 1.4rem 1rem; }
.bit-row { display: grid; grid-template-columns: repeat(8, 1fr); gap: .4rem; }
.bit { cursor: pointer; border: 1px solid var(--line); background: var(--bg3); color: var(--muted); border-radius: 14px; padding: .7rem 0; display: grid; gap: .5rem; justify-items: center; font: inherit; transition: all .2s; }
.bit .w { font-size: .68rem; }
.bit .v { font-size: 1.5rem; font-weight: 700; }
.bit.on { background: var(--accent); color: #1a1205; border-color: var(--accent); box-shadow: 0 0 24px rgba(242, 180, 90, .55); transform: translateY(-4px); }
.bit-out { display: flex; justify-content: center; align-items: center; gap: 1.6rem; margin-top: 1.4rem; text-align: center; }
.bit-out .num { font-size: 2.6rem; font-weight: 800; }
.bit-out .letter { color: var(--accent); }
.eq { font-size: 2rem; color: var(--muted); }

/* principi + terminale */
.principles { list-style: none; padding: 0; margin: 1.2rem 0 1.5rem; display: grid; gap: .6rem; }
.principles li { display: grid; grid-template-columns: 6.2rem 1fr; gap: .8rem; padding: .7rem 0; border-top: 1px solid var(--line); }
.principles b { color: var(--accent); }
.principles span { color: #cfcbd8; font-size: .95rem; }
.term { background: #08080c; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; box-shadow: 0 24px 70px rgba(0, 0, 0, .5); }
.term-bar { display: flex; align-items: center; gap: .4rem; padding: .6rem .9rem; border-bottom: 1px solid var(--line); background: var(--bg2); }
.term-bar i { width: 10px; height: 10px; border-radius: 50%; background: #3a3a4a; }
.term-bar i:nth-child(1) { background: #e9695c } .term-bar i:nth-child(2) { background: #f2b45a } .term-bar i:nth-child(3) { background: #6fcf97 }
.term-bar span { margin-left: auto; color: var(--muted); }
.term pre { margin: 0; padding: 1rem; font-size: .8rem; line-height: 1.8; overflow-x: auto; color: #cfcbd8; }
.term u { text-decoration: none; color: var(--accent); }
.term .ok { color: var(--good); }
.term .l { display: block; opacity: 0; }
.term.in .l { animation: line .4s forwards; }
.term.in .l1 { animation-delay: .3s } .term.in .l2 { animation-delay: 1s } .term.in .l3 { animation-delay: 1.7s }
.term.in .l4 { animation-delay: 2.2s } .term.in .l5 { animation-delay: 2.8s } .term.in .l6 { animation-delay: 3.4s } .term.in .l7 { animation-delay: 3.9s }
@keyframes line { to { opacity: 1 } }

/* diagramma on-premise */
.diagram { display: grid; grid-template-columns: auto 1fr auto 1fr auto; align-items: center; gap: .4rem; margin: 2.2rem auto 0; max-width: 720px; }
.node { display: grid; justify-items: center; gap: .3rem; font-size: 2rem; text-align: center; }
.node small { font-size: .7rem; color: var(--muted); line-height: 1.2; }
.big-node { padding: 1rem; border: 2px solid var(--accent); border-radius: 20px; font-size: 2.6rem; box-shadow: 0 0 40px rgba(242, 180, 90, .2); background: rgba(242, 180, 90, .05); }
.node.dim { opacity: .35; }
.wire { position: relative; height: 2px; background: var(--line); }
.wire i { position: absolute; top: -3px; left: 0; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); animation: travel 2s linear infinite; }
.wire.off { background: repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 12px); }
.wire.off i { display: none; }
.wire em { position: absolute; top: -1.6rem; left: 50%; transform: translateX(-50%); font-style: normal; font-size: .68rem; color: var(--bad); white-space: nowrap; }
@keyframes travel { to { left: calc(100% - 8px) } }

/* cta + footer */
.cta { text-align: center; }
.foot { display: flex; justify-content: space-between; flex-wrap: wrap; gap: .6rem; max-width: 980px; margin: 0 auto; padding: 1.4rem 1.2rem; border-top: 1px solid var(--line); color: var(--muted); font-size: .88rem; }

@media (prefers-reduced-motion: reduce) {
  .rv { opacity: 1; transform: none; transition: none; }
  .track, .phone, .reel-bar i, .scroll, .caret, .wire i, .reel-flow .arr { animation: none; }
  .term .l { opacity: 1; }
  .term.in .l { animation: none; }
}
</style>
