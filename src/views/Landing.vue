<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { INSTAGRAM } from '../lib/config'
import { gsap, ScrollTrigger, scrambleChars } from '../lib/motion'

const root = ref(null)
const cv = ref(null)
let mm = null
let rain = null

/* ---------- sfondo: pioggia di bit che reagisce al puntatore ---------- */
const pointer = { x: -999, y: -999 }

function makeRain(c) {
  const g = c.getContext('2d')
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let w = 0, h = 0, cols = 0, drops = []
  let raf = 0
  let playing = false
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
    g.font = `${size - 4}px ui-monospace, Menlo, monospace`
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(c)
  const draw = () => {
    g.fillStyle = 'rgba(11,11,15,.14)'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < cols; i++) {
      const x = i * size
      const y = drops[i] * size
      const d = Math.hypot(x - pointer.x, y - pointer.y)
      const near = Math.max(0, 1 - d / 170)
      g.fillStyle = `rgba(242,180,90,${0.26 + near * 0.74})`
      g.fillText(Math.random() > 0.5 ? '1' : '0', x, y)
      if (y > h && Math.random() > 0.975) drops[i] = 0
      drops[i] += 0.35 + near * 1.1
    }
  }
  const loop = () => { draw(); if (playing) raf = requestAnimationFrame(loop) }
  return {
    play() { if (playing || still) return; playing = true; loop() },
    pause() { playing = false; cancelAnimationFrame(raf) },
    still() { draw() },
    destroy() { playing = false; cancelAnimationFrame(raf); ro.disconnect() }
  }
}
function onMove(e) {
  if (!cv.value) return
  const r = cv.value.getBoundingClientRect()
  const t = e.touches ? e.touches[0] : e
  pointer.x = t.clientX - r.left
  pointer.y = t.clientY - r.top
}

/* ---------- testo che si scrive da solo ---------- */
const lines = ['informatica spiegata bene', 'cultura che si può toccare', 'sapere aperto a tutti']
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

/* ---------- demo: interruttori → lettera ---------- */
const bits = ref([0, 1, 0, 0, 0, 0, 1, 1])
const value = computed(() => parseInt(bits.value.join(''), 2))
const letter = computed(() => (value.value >= 33 && value.value < 127 ? String.fromCharCode(value.value) : value.value === 32 ? '␣' : '·'))
const weights = [128, 64, 32, 16, 8, 4, 2, 1]
function toggle(i, e) {
  bits.value[i] = bits.value[i] ? 0 : 1
  gsap.fromTo(e.currentTarget, { scale: 0.78 }, { scale: 1, duration: 0.6, ease: 'back.out(4)' })
}
function setLetter(ch) {
  bits.value = ch.charCodeAt(0).toString(2).padStart(8, '0').split('').map(Number)
  gsap.fromTo(root.value.querySelectorAll('.bit'), { y: -14 }, { y: 0, duration: 0.6, stagger: 0.04, ease: 'back.out(3)' })
}
watch(letter, async () => {
  await nextTick()
  const el = root.value && root.value.querySelector('.letter')
  if (el) gsap.fromTo(el, { scale: 1.6, rotate: -12, opacity: 0.2 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.5, ease: 'back.out(3)' })
})

/* ---------- contenuti ---------- */
const split = (s) => Array.from(s)
const topics = ['IP', 'DNS', 'password', 'database', 'cloud', 'intelligenza artificiale', 'binario', 'crittografia', 'realtà aumentata', 'audioguide', 'Napoli', 'arte']
const manifesto = [
  { text: 'Il codice è cultura.', hot: ['codice', 'cultura.'] },
  { text: 'Il sapere è aperto a tutti.', hot: ['aperto'] },
  { text: 'E resta a casa tua.', hot: ['casa'] }
]
const principles = [
  ['heart', 'Gratis', 'Nessun pagamento, nessun abbonamento, nessun account.'],
  ['unlock', 'Aperto', 'Non servono basi: si parte da zero, con calma.'],
  ['lightbulb', 'Curioso', "L'unico requisito è la voglia di imparare."],
  ['share', 'Condiviso', 'Se ti piace, passa la voce: il sapere cresce quando circola.']
]
const local = [
  ['key', 'Nessun account', 'Entri e giochi. Niente registrazione, niente email.'],
  ['shield', 'Nessun tracker', 'Non ci sono pubblicità né analytics nel codice.'],
  ['mobile', 'Dati sul tuo dispositivo', 'XP, striscia e badge restano nel tuo browser.'],
  ['wifi', 'Funziona anche offline', 'Installala come app: dopo il primo caricamento gira da sola.']
]

/* ---------- GSAP ---------- */
function animate() {
  const q = (s) => root.value.querySelectorAll(s)
  const one = (s) => root.value.querySelector(s)

  // intro: titolo a lettere, pill, riga digitata, bottoni
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } })
  intro
    .from(one('.hero .pill'), { y: -24, opacity: 0, duration: 0.8 })
    .from(q('.mega .ch'), { yPercent: 125, rotate: 12, opacity: 0, duration: 1.1, stagger: { each: 0.03, from: 'start' } }, '-=0.5')
    .from(one('.type'), { opacity: 0, x: -30, duration: 0.8 }, '-=0.6')
    .from(one('.hero .row'), { y: 40, opacity: 0, duration: 0.9 }, '-=0.6')
    .from(one('.scroll'), { opacity: 0, y: -20, duration: 0.8 }, '-=0.4')
  gsap.to(one('.scroll svg'), { y: 10, repeat: -1, yoyo: true, duration: 0.9, ease: 'sine.inOut' })

  // "cultura" si decifra quando ci passi sopra
  const cul = one('.cul')
  const culChars = Array.from(q('.cul .ch'))
  cul.addEventListener('pointerenter', () => scrambleChars(culChars, 700))
  intro.add(() => scrambleChars(culChars, 900), 0.9)

  // parallasse col puntatore
  const mx = gsap.quickTo(one('.hero-in'), 'x', { duration: 0.9, ease: 'power3' })
  const my = gsap.quickTo(one('.hero-in'), 'y', { duration: 0.9, ease: 'power3' })
  const heroMove = (e) => {
    mx((e.clientX / window.innerWidth - 0.5) * -26)
    my((e.clientY / window.innerHeight - 0.5) * -16)
  }
  window.addEventListener('pointermove', heroMove)

  // uscita dell'hero allo scroll
  gsap.to(one('.hero-in'), {
    scale: 0.88, opacity: 0, filter: 'blur(12px)',
    ease: 'none',
    scrollTrigger: { trigger: one('.hero'), start: 'top top', end: 'bottom top', scrub: 0.6 }
  })
  gsap.to(one('.rain'), { yPercent: 18, ease: 'none', scrollTrigger: { trigger: one('.hero'), start: 'top top', end: 'bottom top', scrub: true } })

  // la pioggia lavora solo quando l'hero è visibile
  ScrollTrigger.create({ trigger: one('.hero'), start: 'top bottom', end: 'bottom top', onToggle: (s) => (s.isActive ? rain.play() : rain.pause()) })

  // marquee: scorre in due versi e accelera con lo scroll
  const t1 = gsap.to(one('.t1'), { xPercent: -50, duration: 32, ease: 'none', repeat: -1 })
  const t2 = gsap.fromTo(one('.t2'), { xPercent: -50 }, { xPercent: 0, duration: 38, ease: 'none', repeat: -1 })
  const sp = { s: 1 }
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate(self) {
      const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 140, 12)
      if (boost > sp.s) { sp.s = boost; t1.timeScale(boost); t2.timeScale(boost) }
      gsap.to(sp, { s: 1, duration: 1.6, ease: 'power3.out', overwrite: true, onUpdate: () => { t1.timeScale(sp.s); t2.timeScale(sp.s) } })
    }
  })

  // manifesto: le parole si accendono mentre scorri, sezione "pinned"
  const words = q('.mf .w')
  gsap.set(words, { opacity: 0.12 })
  const mf = gsap.timeline({ defaults: { ease: 'none' } })
  mf.to(words, { opacity: 1, stagger: 0.25, duration: 1 })
  ScrollTrigger.create({ trigger: one('.manifesto'), start: 'top top', end: '+=140%', pin: true, scrub: 0.6, animation: mf })
  gsap.fromTo(q('.mf .hot'), { color: '#f1ede6' }, { color: '#f2b45a', stagger: 0.25, ease: 'none', scrollTrigger: { trigger: one('.manifesto'), start: 'top top', end: '+=140%', scrub: 0.6 } })

  // rivelazioni generiche
  gsap.utils.toArray('[data-rv]').forEach((el) => {
    const clip = el.dataset.rv === 'clip'
    gsap.fromTo(
      el,
      clip ? { clipPath: 'inset(0 0 105% 0)', y: 50 } : { y: 60, opacity: 0 },
      { clipPath: clip ? 'inset(0 0 -20% 0)' : undefined, y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    )
  })
  gsap.utils.toArray('[data-stagger]').forEach((el) => {
    gsap.from(el.children, { y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
  })

  // telefono: ruota e sale mentre scorri
  gsap.fromTo(one('.phone'), { rotate: -12, yPercent: 14 }, { rotate: 9, yPercent: -14, ease: 'none', scrollTrigger: { trigger: one('#profilo'), start: 'top bottom', end: 'bottom top', scrub: 0.8 } })

  // interruttori: entrano a cascata
  gsap.from(q('.bit'), { y: 70, opacity: 0, rotate: () => gsap.utils.random(-14, 14), duration: 0.8, stagger: 0.07, ease: 'back.out(2.4)', scrollTrigger: { trigger: one('.bit-row'), start: 'top 88%', once: true } })

  // terminale: parte quando entra
  ScrollTrigger.create({ trigger: one('.term'), start: 'top 85%', once: true, onEnter: () => one('.term').classList.add('in') })

  // diagramma on-premise
  const dg = gsap.timeline({ scrollTrigger: { trigger: one('.diagram'), start: 'top 82%', once: true } })
  dg.from(q('.diagram .node'), { scale: 0, rotate: -20, opacity: 0, duration: 0.8, stagger: 0.25, ease: 'back.out(2.4)' })
    .from(q('.diagram .wire'), { scaleX: 0, transformOrigin: 'left center', duration: 0.6, stagger: 0.25, ease: 'power3.out' }, 0.3)

  // CTA gigante
  gsap.from(one('.cta .h2'), { scale: 0.82, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: one('.cta'), start: 'top 80%', once: true } })

  return () => window.removeEventListener('pointermove', heroMove)
}

onMounted(() => {
  rain = makeRain(cv.value)
  rain.still()
  typeLoop()
  mm = gsap.matchMedia(root.value)
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    rain.play()
    const off = animate()
    requestAnimationFrame(() => ScrollTrigger.refresh())
    return off
  })
  mm.add('(prefers-reduced-motion: reduce)', () => {
    root.value.querySelector('.term').classList.add('in')
  })
})
onBeforeUnmount(() => {
  clearTimeout(typeTimer)
  mm && mm.revert()
  rain && rain.destroy()
})
</script>

<template>
  <div ref="root" class="landing">
    <!-- HERO -->
    <section class="hero" @pointermove="onMove" @touchmove.passive="onMove">
      <canvas ref="cv" class="rain" aria-hidden="true"></canvas>
      <div class="hero-in">
        <p class="pill">profilo social · sapere aperto · @cltrcode</p>
        <h1 class="mega" aria-label="Il codice è cultura.">
          <span class="ln" aria-hidden="true"><span v-for="(c, i) in split('Il codice')" :key="i" class="ch">{{ c === ' ' ? ' ' : c }}</span></span>
          <span class="ln" aria-hidden="true">
            <span class="ch">è</span><span class="ch">&nbsp;</span><em class="cul"><span v-for="(c, i) in split('cultura')" :key="i" class="ch">{{ c }}</span></em><span class="ch">.</span>
          </span>
        </h1>
        <p class="type mono"><span>&gt; </span>{{ typed }}<i class="caret"></i></p>
        <div class="row" style="margin-top:1.6rem">
          <RouterLink v-magnetic to="/giochi" class="btn big-btn">Entra nei giochi <Ic n="arrowRight" /></RouterLink>
          <a v-magnetic href="#profilo" class="btn ghost big-btn">Cos'è Culture Code</a>
        </div>
      </div>
      <a href="#profilo" class="scroll" aria-label="Scorri"><Ic n="chevronDown" /></a>
    </section>

    <!-- MARQUEE -->
    <div class="marquee" aria-hidden="true">
      <div class="track t1"><span v-for="n in 2" :key="n"><b v-for="t in topics" :key="t + n">{{ t }}</b></span></div>
      <div class="track t2 fill"><span v-for="n in 2" :key="n"><b v-for="t in topics" :key="t + n">{{ t }}</b></span></div>
    </div>

    <!-- MANIFESTO (pinned) -->
    <section class="manifesto">
      <div class="mf-in">
        <p class="pill">manifesto</p>
        <p v-for="(l, li) in manifesto" :key="li" class="mf">
          <span v-for="(w, wi) in l.text.split(' ')" :key="wi" class="w" :class="{ hot: l.hot.includes(w) }">{{ w }}&nbsp;</span>
        </p>
      </div>
    </section>

    <!-- PROFILO SOCIAL -->
    <section id="profilo" class="sec two-col">
      <div>
        <p class="pill" data-rv>01 · il profilo</p>
        <h2 class="h2" data-rv="clip">Un profilo social che spiega l'informatica.</h2>
        <p class="lead" data-rv>Culture Code vive su Instagram e YouTube con video brevi di circa 40 secondi: stile minimale e cinematografico, voce calda, ritmo dinamico. Ogni video prende un concetto — un IP, una password, un database — e lo racconta senza gergo.</p>
        <p class="lead" data-rv>Il taglio distintivo è la cultura: audioguide digitali, realtà aumentata nei musei, computer che "leggono" un quadro, la storia del codice, Napoli.</p>
        <div class="row" data-rv>
          <a v-magnetic class="btn" :href="INSTAGRAM" target="_blank" rel="noopener"><Ic n="instagram" /> Instagram</a>
          <RouterLink v-magnetic class="btn ghost" to="/qr"><Ic n="qrcode" /> QR dei reel</RouterLink>
        </div>
      </div>
      <div class="phone-wrap">
        <div class="phone">
          <div class="reel-bar"><i></i></div>
          <div class="reel-body">
            <span class="mono tiny">reel · 0:40</span>
            <div class="reel-title">Cos'è<br />un <em>DNS</em>?</div>
            <div class="reel-flow mono">
              <span>google.com</span><span class="arr"><Ic n="arrowRight" /></span><span class="ip">142.250.180.14</span>
            </div>
          </div>
          <div class="reel-foot mono tiny">@cltrcode</div>
        </div>
      </div>
    </section>

    <!-- BIT INTERATTIVI -->
    <section class="sec">
      <div class="center">
        <p class="pill" data-rv>02 · tocca</p>
        <h2 class="h2" data-rv="clip">Ogni lettera è una fila di interruttori.</h2>
        <p class="lead mx" data-rv>Accendi e spegni i bit: il computer somma i valori e trova la lettera. Prova con una delle scorciatoie.</p>
      </div>
      <div class="bits-card">
        <div class="bit-row">
          <button
            v-for="(b, i) in bits" :key="i" class="bit" :class="{ on: b }"
            :aria-label="`bit ${weights[i]}: ${b ? 'acceso' : 'spento'}`"
            @click="toggle(i, $event)"
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
          <button v-for="c in ['C', 'U', 'L', 'T', '?']" :key="c" v-magnetic class="btn ghost" style="padding:.35rem .9rem" @click="setLetter(c)">{{ c }}</button>
        </div>
      </div>
    </section>

    <!-- OPEN SOURCE -->
    <section class="sec two-col">
      <div>
        <p class="pill" data-rv>03 · open source</p>
        <h2 class="h2" data-rv="clip">Open source, ma del sapere.</h2>
        <p class="lead" data-rv>Per noi "open source" non vuol dire scaricare un codice: vuol dire che la conoscenza è <strong>aperta a tutti</strong>. Come in una licenza open source, ma scritta da noi: la <strong>licenza cltrcode</strong>. Puoi usare, capire e condividere quello che impari, senza pagare.</p>
        <ul class="principles" data-stagger>
          <li v-for="([ic, t, d]) in principles" :key="t"><Ic :n="ic" class="pi" /><b>{{ t }}</b><span>{{ d }}</span></li>
        </ul>
        <div data-rv><RouterLink v-magnetic class="btn" to="/giochi">Inizia a imparare <Ic n="arrowRight" /></RouterLink></div>
      </div>
      <div class="term" role="img" aria-label="Terminale che mostra la licenza Culture Code: gratis per chiunque abbia voglia di imparare">
        <div class="term-bar"><i></i><i></i><i></i><span class="mono tiny">~/cultura</span></div>
        <pre class="mono"><span class="l l1"><u>$</u> cat LICENZA</span>
<span class="l l2 ok">Licenza cltrcode · scritta da noi</span>
<span class="l l3">Permesso concesso, gratis, a chiunque:</span>
<span class="l l4">usare, capire, giocare e condividere.</span>
<span class="l l5">Condizione unica: la voglia di imparare.</span>
<span class="l l6">Nessuna garanzia, tranne che ti divertirai.</span><span class="l l7"><u>$</u> <i class="caret"></i></span></pre>
      </div>
    </section>

    <!-- ON-PREMISE -->
    <section class="sec">
      <div class="center">
        <p class="pill" data-rv>04 · stile on-premise</p>
        <h2 class="h2" data-rv="clip">Il sapere resta a casa tua, non in affitto.</h2>
        <p class="lead mx" data-rv>Come un software on-premise, l'esperienza gira a casa tua, cioè sul tuo dispositivo: nessun account, nessun abbonamento, nessun cloud di altri. Il sito ti consegna l'app, poi il lavoro lo fa il tuo browser.</p>
      </div>

      <div class="diagram" aria-hidden="true">
        <div class="node"><Ic n="earth" /><small>sito</small></div>
        <div class="wire"><i></i></div>
        <div class="node big-node"><Ic n="mobile" /><small>il tuo dispositivo<br />giochi · progressi · foto</small></div>
        <div class="wire off"><i></i><em><Ic n="ban" /> nessun invio</em></div>
        <div class="node dim"><Ic n="cloud" /><small>server dati</small></div>
      </div>

      <div class="grid two" style="margin-top:1.4rem" data-stagger>
        <div v-for="([ic, t, d]) in local" :key="t" v-tilt class="card">
          <Ic :n="ic" class="pi" />
          <strong>{{ t }}</strong>
          <p class="muted" style="margin:.3rem 0 0">{{ d }}</p>
        </div>
      </div>
      <p class="note center">La mappa di Napoli scarica le tessere cartografiche da OpenStreetMap: è l'unica richiesta esterna.</p>
    </section>

    <!-- CTA -->
    <section class="sec cta">
      <h2 class="h2 huge">Pronto a giocare<br />con il codice?</h2>
      <p class="lead mx" data-rv>Cinque giochi, tre esperienze e una sfida nuova ogni giorno.</p>
      <div data-rv><RouterLink v-magnetic to="/giochi" class="btn big-btn">Apri la sezione giochi <Ic n="arrowRight" /></RouterLink></div>
    </section>

    <footer class="foot">
      <span class="mono">&lt;/&gt; culture code</span>
      <span>
        <a :href="INSTAGRAM" target="_blank" rel="noopener"><Ic n="instagram" /> Instagram</a> ·
        Licenza cltrcode
      </span>
    </footer>
  </div>
</template>

<style scoped>
.landing { overflow-x: clip; }
.mono { font-family: var(--mono); }
.tiny { font-size: .72rem; letter-spacing: .08em; text-transform: uppercase; }

/* hero */
.hero { position: relative; min-height: calc(100svh - 3.2rem); display: grid; align-items: center; padding: 2rem 1.2rem 5rem; overflow: hidden; }
.rain { position: absolute; inset: -10% 0; width: 100%; height: 120%; }
.hero::after { content: ''; position: absolute; inset: 0; background: radial-gradient(70% 60% at 30% 45%, rgba(11, 11, 15, .8) 0%, rgba(11, 11, 15, 0) 100%); pointer-events: none; }
.hero-in { position: relative; z-index: 2; max-width: 1040px; margin: 0 auto; width: 100%; will-change: transform; }
.mega { font-size: clamp(3.6rem, 17vw, 10.5rem); line-height: .92; letter-spacing: -.055em; font-weight: 900; margin: 1rem 0 1.2rem; }
.ln { display: block; overflow: hidden; padding: .04em .02em .1em; }
.ch { display: inline-block; will-change: transform; }
.mega em { font-style: normal; color: var(--accent); text-shadow: 0 0 50px rgba(242, 180, 90, .5); cursor: default; }
.type { font-size: clamp(1rem, 3.6vw, 1.4rem); color: var(--text); min-height: 2rem; margin: 0; }
.type span { color: var(--accent); }
.caret { display: inline-block; width: .6ch; height: 1.1em; background: var(--accent); vertical-align: text-bottom; margin-left: 2px; animation: blink 1s steps(2) infinite; }
@keyframes blink { 50% { opacity: 0 } }
.big-btn { font-size: 1.05rem; padding: .95rem 1.6rem; }
.scroll { position: absolute; bottom: 1.6rem; left: 50%; margin-left: -.6rem; z-index: 2; font-size: 1.6rem; }

/* marquee a due righe */
.marquee { border-block: 1px solid var(--line); overflow: hidden; background: var(--bg2); padding: .4rem 0; }
.track { display: flex; width: max-content; will-change: transform; }
.track span { display: flex; }
.track b { font-weight: 900; font-size: clamp(2.2rem, 9vw, 5rem); line-height: 1.15; padding: 0 1.4rem; color: transparent; -webkit-text-stroke: 1.4px rgba(242, 180, 90, .85); text-transform: uppercase; white-space: nowrap; letter-spacing: -.02em; }
.track b::after { content: '✦'; -webkit-text-stroke: 0; color: var(--accent); font-size: .5em; margin-left: 2.8rem; vertical-align: middle; }
.track.fill b { color: rgba(241, 237, 230, .1); -webkit-text-stroke: 0; }

/* manifesto */
.manifesto { min-height: 100svh; display: grid; align-items: center; padding: 2rem 1.2rem; background: #08080c; }
.mf-in { max-width: 1040px; margin: 0 auto; }
.mf { font-size: clamp(2.4rem, 9.5vw, 6.2rem); font-weight: 900; line-height: 1; letter-spacing: -.045em; margin: .4rem 0; }
.mf .w { display: inline-block; }

/* sezioni */
.sec { max-width: 980px; margin: 0 auto; padding: 5rem 1.2rem; }
.sec.two-col { display: grid; gap: 2.4rem; align-items: center; }
@media (min-width: 820px) { .sec.two-col { grid-template-columns: 1.1fr .9fr; } }
.h2 { font-size: clamp(2rem, 7vw, 3.6rem); line-height: 1.02; letter-spacing: -.04em; font-weight: 900; margin: .8rem 0 1rem; }
.h2.huge { font-size: clamp(2.6rem, 11vw, 6.5rem); }
.lead { font-size: 1.08rem; color: #cfcbd8; max-width: 56ch; }
.lead.mx { margin-inline: auto; }
.pi { color: var(--accent); font-size: 1.1rem; }

/* telefono */
.phone-wrap { display: grid; place-items: center; }
.phone { width: 230px; aspect-ratio: 9/16; border-radius: 28px; border: 2px solid var(--line); background: linear-gradient(180deg, #1a1626, #0b0b0f); padding: 14px; display: flex; flex-direction: column; box-shadow: 0 30px 80px rgba(0, 0, 0, .6), 0 0 60px rgba(242, 180, 90, .1); will-change: transform; }
.reel-bar { height: 3px; background: var(--line); border-radius: 9px; overflow: hidden; }
.reel-bar i { display: block; height: 100%; width: 0; background: var(--accent); animation: prog 6s linear infinite; }
@keyframes prog { to { width: 100% } }
.reel-body { flex: 1; display: grid; align-content: center; gap: .9rem; }
.reel-title { font-size: 2rem; font-weight: 900; line-height: 1; letter-spacing: -.04em; }
.reel-title em { font-style: normal; color: var(--accent); }
.reel-flow { display: grid; gap: .2rem; font-size: .78rem; }
.reel-flow .arr { animation: bob2 1.4s ease-in-out infinite; }
.reel-flow .ip { color: var(--accent); }
@keyframes bob2 { 50% { transform: translateX(8px) } }
.reel-foot { color: var(--muted); }

/* bit */
.bits-card { margin: 2rem auto 0; max-width: 640px; background: var(--bg2); border: 1px solid var(--line); border-radius: 22px; padding: 1.4rem 1rem; }
.bit-row { display: grid; grid-template-columns: repeat(8, 1fr); gap: .4rem; }
.bit { cursor: pointer; border: 1px solid var(--line); background: var(--bg3); color: var(--muted); border-radius: 14px; padding: .7rem 0; display: grid; gap: .5rem; justify-items: center; font: inherit; transition: background .2s, box-shadow .2s, color .2s; }
.bit .w { font-size: .68rem; }
.bit .v { font-size: 1.5rem; font-weight: 700; }
.bit.on { background: var(--accent); color: #1a1205; border-color: var(--accent); box-shadow: 0 0 24px rgba(242, 180, 90, .55); }
.bit-out { display: flex; justify-content: center; align-items: center; gap: 1.6rem; margin-top: 1.4rem; text-align: center; }
.bit-out .num { font-size: 2.6rem; font-weight: 800; }
.bit-out .letter { color: var(--accent); display: inline-block; }
.eq { font-size: 2rem; color: var(--muted); }

/* principi + terminale */
.principles { list-style: none; padding: 0; margin: 1.2rem 0 1.5rem; display: grid; gap: .2rem; }
.principles li { display: grid; grid-template-columns: 1.6rem 6.2rem 1fr; gap: .6rem; align-items: baseline; padding: .7rem 0; border-top: 1px solid var(--line); }
.principles b { color: var(--text); }
.principles span { color: #cfcbd8; font-size: .95rem; }
.term { background: #08080c; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; box-shadow: 0 24px 70px rgba(0, 0, 0, .5); }
.term-bar { display: flex; align-items: center; gap: .4rem; padding: .6rem .9rem; border-bottom: 1px solid var(--line); background: var(--bg2); }
.term-bar i { width: 10px; height: 10px; border-radius: 50%; background: #3a3a4a; }
.term-bar i:nth-child(1) { background: #e9695c } .term-bar i:nth-child(2) { background: #f2b45a } .term-bar i:nth-child(3) { background: #6fcf97 }
.term-bar span { margin-left: auto; color: var(--muted); }
.term pre { margin: 0; padding: 1rem; font-size: .8rem; line-height: 1.8; overflow-x: auto; color: #cfcbd8; white-space: normal; }
.term u { text-decoration: none; color: var(--accent); }
.term .ok { color: var(--good); }
.term .l { display: block; opacity: 0; }
.term.in .l { animation: line .4s forwards; }
.term.in .l1 { animation-delay: .2s } .term.in .l2 { animation-delay: .8s } .term.in .l3 { animation-delay: 1.4s }
.term.in .l4 { animation-delay: 1.9s } .term.in .l5 { animation-delay: 2.4s } .term.in .l6 { animation-delay: 3s } .term.in .l7 { animation-delay: 3.5s }
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
.cta { text-align: center; padding-block: 7rem; }
.foot { display: flex; justify-content: space-between; flex-wrap: wrap; gap: .6rem; max-width: 980px; margin: 0 auto; padding: 1.4rem 1.2rem; border-top: 1px solid var(--line); color: var(--muted); font-size: .88rem; }

@media (prefers-reduced-motion: reduce) {
  .caret, .wire i, .reel-flow .arr, .reel-bar i { animation: none; }
  .term .l { opacity: 1; }
  .term.in .l { animation: none; }
}
</style>
