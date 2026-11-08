<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { addXp, unlock } from '../lib/store'

const cv = ref(null)
const hasImg = ref(false)
const tab = ref('orig')
const palette = ref([])
const stats = ref(null)
const nums = ref([])
let src = null // ImageData
let W = 0
let H = 0
let rewarded = false

const tabs = [
  ['orig', 'Originale'], ['mosaic', 'Pixel'], ['edges', 'Contorni'], ['nums', 'Numeri'], ['pal', 'Colori']
]

function onFile(e) {
  const f = e.target.files && e.target.files[0]
  if (!f) return
  const url = URL.createObjectURL(f)
  const im = new Image()
  im.onload = () => {
    setSource(im, im.naturalWidth, im.naturalHeight)
    URL.revokeObjectURL(url)
  }
  im.src = url
}

function sample() {
  const c = document.createElement('canvas')
  c.width = 480
  c.height = 320
  const g = c.getContext('2d')
  const sky = g.createLinearGradient(0, 0, 0, 320)
  sky.addColorStop(0, '#1b2a5a')
  sky.addColorStop(0.6, '#e9895c')
  sky.addColorStop(1, '#f2c27a')
  g.fillStyle = sky
  g.fillRect(0, 0, 480, 320)
  g.fillStyle = '#fbe3a3'
  g.beginPath()
  g.arc(340, 150, 42, 0, Math.PI * 2)
  g.fill()
  g.fillStyle = '#2b2236'
  g.beginPath()
  g.moveTo(0, 260)
  g.lineTo(140, 190)
  g.lineTo(215, 255)
  g.lineTo(480, 210)
  g.lineTo(480, 320)
  g.lineTo(0, 320)
  g.fill()
  g.fillStyle = '#12101a'
  g.fillRect(60, 235, 60, 85)
  g.fillRect(130, 250, 40, 70)
  g.fillStyle = '#f2b45a'
  for (let y = 245; y < 310; y += 16) for (let x = 68; x < 118; x += 16) g.fillRect(x, y, 6, 8)
  setSource(c, 480, 320)
}

function setSource(drawable, w, h) {
  const scale = Math.min(1, 480 / w)
  W = Math.max(1, Math.round(w * scale))
  H = Math.max(1, Math.round(h * scale))
  const off = document.createElement('canvas')
  off.width = W
  off.height = H
  const g = off.getContext('2d', { willReadFrequently: true })
  g.drawImage(drawable, 0, 0, W, H)
  src = g.getImageData(0, 0, W, H)
  hasImg.value = true
  analyze()
  tab.value = 'orig'
  render()
  if (!rewarded) {
    rewarded = true
    addXp(10, 'Occhio artificiale')
    unlock('vision')
  }
}

function gray(d, i) {
  return 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
}

function analyze() {
  const d = src.data
  const n = W * H
  let sum = 0, sumSq = 0, r = 0, b = 0
  for (let i = 0; i < d.length; i += 4) {
    const v = gray(d, i)
    sum += v
    sumSq += v * v
    r += d[i]
    b += d[i + 2]
  }
  const mean = sum / n
  const sd = Math.sqrt(Math.max(0, sumSq / n - mean * mean))
  stats.value = {
    size: `${W}×${H} pixel · ${(n / 1000).toFixed(0)} mila punti`,
    bright: Math.round((mean / 255) * 100),
    contrast: Math.round((sd / 128) * 100),
    tone: r > b * 1.08 ? 'calda' : b > r * 1.08 ? 'fredda' : 'neutra'
  }
  palette.value = kmeans(5)
  // griglia di numeri 12x8
  const cols = 12, rows = 8
  const out = []
  for (let y = 0; y < rows; y++) {
    const row = []
    for (let x = 0; x < cols; x++) {
      const px = Math.floor(((x + 0.5) / cols) * W)
      const py = Math.floor(((y + 0.5) / rows) * H)
      row.push(Math.round(gray(d, (py * W + px) * 4)))
    }
    out.push(row)
  }
  nums.value = out
}

function kmeans(k) {
  const d = src.data
  const pts = []
  const step = Math.max(1, Math.floor((W * H) / 2500))
  for (let p = 0; p < W * H; p += step) pts.push([d[p * 4], d[p * 4 + 1], d[p * 4 + 2]])
  let cs = Array.from({ length: k }, (_, i) => pts[Math.floor((i + 0.5) * (pts.length / k))].slice())
  let counts = new Array(k).fill(0)
  for (let it = 0; it < 8; it++) {
    const sums = Array.from({ length: k }, () => [0, 0, 0])
    counts = new Array(k).fill(0)
    for (const p of pts) {
      let best = 0, bd = Infinity
      for (let c = 0; c < k; c++) {
        const dd = (p[0] - cs[c][0]) ** 2 + (p[1] - cs[c][1]) ** 2 + (p[2] - cs[c][2]) ** 2
        if (dd < bd) { bd = dd; best = c }
      }
      sums[best][0] += p[0]; sums[best][1] += p[1]; sums[best][2] += p[2]; counts[best]++
    }
    cs = cs.map((c, i) => (counts[i] ? sums[i].map((v) => v / counts[i]) : c))
  }
  const total = counts.reduce((a, b) => a + b, 0) || 1
  return cs
    .map((c, i) => ({
      hex: '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join(''),
      pct: Math.round((counts[i] / total) * 100)
    }))
    .filter((c) => c.pct > 0)
    .sort((a, b) => b.pct - a.pct)
}

function render() {
  const c = cv.value
  if (!c || !src) return
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  g.imageSmoothingEnabled = false
  if (tab.value === 'mosaic') {
    const cols = 28
    const rows = Math.max(1, Math.round(cols * (H / W)))
    const t = document.createElement('canvas')
    t.width = cols
    t.height = rows
    const tg = t.getContext('2d')
    const orig = document.createElement('canvas')
    orig.width = W
    orig.height = H
    orig.getContext('2d').putImageData(src, 0, 0)
    tg.imageSmoothingEnabled = true
    tg.drawImage(orig, 0, 0, cols, rows)
    g.drawImage(t, 0, 0, W, H)
  } else if (tab.value === 'edges') {
    const d = src.data
    const out = g.createImageData(W, H)
    const gr = new Float32Array(W * H)
    for (let i = 0; i < W * H; i++) gr[i] = gray(d, i * 4)
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x
        const gx = -gr[i - W - 1] - 2 * gr[i - 1] - gr[i + W - 1] + gr[i - W + 1] + 2 * gr[i + 1] + gr[i + W + 1]
        const gy = -gr[i - W - 1] - 2 * gr[i - W] - gr[i - W + 1] + gr[i + W - 1] + 2 * gr[i + W] + gr[i + W + 1]
        const m = Math.min(255, Math.sqrt(gx * gx + gy * gy))
        const o = i * 4
        out.data[o] = m * 0.95
        out.data[o + 1] = m * 0.7
        out.data[o + 2] = m * 0.35
        out.data[o + 3] = 255
      }
    }
    g.putImageData(out, 0, 0)
  } else {
    g.putImageData(src, 0, 0)
  }
}

function setTab(t) {
  tab.value = t
  render()
}

const explain = computed(
  () =>
    ({
      orig: 'Per te è un quadro. Per il computer è una tabella di numeri.',
      mosaic: 'Se riduciamo i dettagli, restano le forme grandi: è il primo passo di molte analisi.',
      edges: 'Gli algoritmi cercano i bordi, dove la luminosità cambia di colpo: è così che si "vedono" le forme.',
      nums: 'Ogni punto è un valore da 0 (nero) a 255 (bianco). Una rete neurale lavora su milioni di numeri come questi.',
      pal: 'Raggruppando i pixel simili (k-means) si ricava la palette dominante: utile per catalogare opere e stili.'
    })[tab.value]
)
</script>

<template>
  <RouterLink to="/giochi" class="back">← Giochi</RouterLink>
  <h1>Il computer vede l'arte</h1>
  <p class="muted">Carica una foto (un quadro, un monumento, uno scorcio) e scopri come la "legge" un algoritmo. L'immagine non lascia mai il tuo dispositivo.</p>

  <div class="row" style="margin-bottom:1rem">
    <label class="btn">Scegli una foto<input type="file" accept="image/*" hidden @change="onFile" /></label>
    <button class="btn ghost" @click="sample">Usa un esempio</button>
  </div>

  <div v-show="hasImg" class="card">
    <div class="row" style="margin-bottom:.8rem">
      <button v-for="[k, l] in tabs" :key="k" class="btn" :class="{ ghost: tab !== k }" style="padding:.35rem .8rem;font-size:.9rem" @click="setTab(k)">{{ l }}</button>
    </div>

    <canvas v-show="tab !== 'nums' && tab !== 'pal'" ref="cv" style="width:100%;border-radius:12px;background:#000;image-rendering:pixelated"></canvas>

    <div v-if="tab === 'nums'" style="overflow-x:auto">
      <table class="mono" style="border-collapse:collapse;font-size:.8rem;margin:0 auto">
        <tr v-for="(row, y) in nums" :key="y">
          <td v-for="(v, x) in row" :key="x" :style="{ background: `rgb(${v},${v},${v})`, color: v > 128 ? '#000' : '#fff', padding: '.35rem .4rem', textAlign: 'center', minWidth: '2.4rem' }">{{ v }}</td>
        </tr>
      </table>
    </div>

    <div v-if="tab === 'pal'">
      <div v-for="c in palette" :key="c.hex" class="row" style="margin-bottom:.4rem">
        <div :style="{ background: c.hex, width: '3rem', height: '2rem', borderRadius: '8px' }"></div>
        <span class="mono">{{ c.hex }}</span><span class="note">{{ c.pct }}%</span>
      </div>
    </div>

    <p class="note" style="margin-top:.8rem">{{ explain }}</p>
    <div v-if="stats" class="grid two note">
      <div class="out"><small>Dimensione</small>{{ stats.size }}</div>
      <div class="out"><small>Luminosità</small>{{ stats.bright }}%</div>
      <div class="out"><small>Contrasto</small>{{ stats.contrast }}%</div>
      <div class="out"><small>Tonalità</small>{{ stats.tone }}</div>
    </div>
    <p class="note">Un vero riconoscimento usa reti neurali addestrate su milioni di immagini. Qui vedi i primi passi dell'elaborazione.</p>
  </div>
</template>
