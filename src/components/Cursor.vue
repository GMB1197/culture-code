<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap, fine } from '../lib/motion'

const ring = ref(null)
const dot = ref(null)
let on = false
let off = []

onMounted(() => {
  if (!fine) return
  on = true
  const rx = gsap.quickTo(ring.value, 'x', { duration: 0.45, ease: 'power3' })
  const ry = gsap.quickTo(ring.value, 'y', { duration: 0.45, ease: 'power3' })
  const dx = gsap.quickTo(dot.value, 'x', { duration: 0.08 })
  const dy = gsap.quickTo(dot.value, 'y', { duration: 0.08 })
  let shown = false
  const move = (e) => {
    if (!shown) { shown = true; gsap.to([ring.value, dot.value], { opacity: 1, duration: 0.3 }) }
    rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY)
  }
  const over = (e) => {
    const hot = !!e.target.closest('a, button, input, label, textarea, .tile, [role="button"]')
    gsap.to(ring.value, { scale: hot ? 1.9 : 1, backgroundColor: hot ? 'rgba(242,180,90,.16)' : 'rgba(242,180,90,0)', duration: 0.3, overwrite: 'auto' })
  }
  const down = () => gsap.to(ring.value, { scale: 0.7, duration: 0.15 })
  const up = () => gsap.to(ring.value, { scale: 1, duration: 0.3, ease: 'back.out(3)' })
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerover', over)
  window.addEventListener('pointerdown', down)
  window.addEventListener('pointerup', up)
  off = [['pointermove', move], ['pointerover', over], ['pointerdown', down], ['pointerup', up]]
})
onBeforeUnmount(() => off.forEach(([n, f]) => window.removeEventListener(n, f)))
</script>

<template>
  <div ref="ring" class="cur-ring" aria-hidden="true"></div>
  <div ref="dot" class="cur-dot" aria-hidden="true"></div>
</template>

<style>
.cur-ring, .cur-dot { position: fixed; left: 0; top: 0; pointer-events: none; z-index: 300; opacity: 0; border-radius: 50%; display: none; }
@media (hover: hover) and (pointer: fine) {
  .cur-ring, .cur-dot { display: block; }
  .cur-ring { width: 38px; height: 38px; margin: -19px 0 0 -19px; border: 1.5px solid #f2b45a; }
  .cur-dot { width: 6px; height: 6px; margin: -3px 0 0 -3px; background: #f2b45a; }
}
@media (prefers-reduced-motion: reduce) { .cur-ring { display: none; } }
</style>
