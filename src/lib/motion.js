import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }

const mq = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches
export const fine = mq('(hover: hover) and (pointer: fine)')
export const reduced = () => mq('(prefers-reduced-motion: reduce)')

const GLYPHS = '01<>/{}[]#$%&*+=?'

// Le lettere "si decifrano": caratteri casuali che si fermano uno alla volta
export function scrambleChars(spans, ms = 800) {
  if (!spans.length) return
  const finals = spans.map((s) => s.dataset.c ?? s.textContent)
  spans.forEach((s, i) => (s.dataset.c = finals[i]))
  const p = { t: 0 }
  gsap.killTweensOf(p)
  gsap.to(p, {
    t: 1,
    duration: ms / 1000,
    ease: 'none',
    onUpdate() {
      spans.forEach((s, i) => {
        s.textContent = p.t > (i + 1) / spans.length ? finals[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      })
    },
    onComplete() {
      spans.forEach((s, i) => (s.textContent = finals[i]))
    }
  })
}

// v-magnetic: l'elemento segue il puntatore quando gli passi vicino
export const magnetic = {
  mounted(el, { value = 0.35 }) {
    if (!fine || reduced()) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.45)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.45)' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * value)
      yTo((e.clientY - (r.top + r.height / 2)) * value)
    }
    const leave = () => { xTo(0); yTo(0) }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    el._mg = { move, leave }
  },
  unmounted(el) {
    if (el._mg) {
      el.removeEventListener('pointermove', el._mg.move)
      el.removeEventListener('pointerleave', el._mg.leave)
    }
  }
}

// v-tilt: inclinazione 3D che segue il puntatore
export const tilt = {
  mounted(el, { value = 9 }) {
    if (!fine || reduced()) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      gsap.to(el, { rotateY: px * value * 2, rotateX: -py * value * 2, transformPerspective: 700, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
    }
    const leave = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' })
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    el._tl = { move, leave }
  },
  unmounted(el) {
    if (el._tl) {
      el.removeEventListener('pointermove', el._tl.move)
      el.removeEventListener('pointerleave', el._tl.leave)
    }
  }
}
