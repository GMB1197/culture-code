const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function caesar(text, shift) {
  const s = ((shift % 26) + 26) % 26
  return text
    .toUpperCase()
    .split('')
    .map((c) => {
      const i = A.indexOf(c)
      return i < 0 ? c : A[(i + s) % 26]
    })
    .join('')
}

export function atbash(text) {
  return text
    .toUpperCase()
    .split('')
    .map((c) => {
      const i = A.indexOf(c)
      return i < 0 ? c : A[25 - i]
    })
    .join('')
}

// Normalizza accenti e simboli: restano lettere, numeri e spazi
export function clean(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
}

export function toBinary(text) {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(2).padStart(8, '0'))
    .join(' ')
}

export function fromBinary(bin) {
  const bytes = bin
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((b) => parseInt(b, 2))
  if (bytes.some((n) => Number.isNaN(n))) return ''
  return new TextDecoder().decode(new Uint8Array(bytes))
}

export function toHex(text) {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
    .join(' ')
}

export function toAscii(text) {
  return Array.from(new TextEncoder().encode(text)).join(' ')
}

const MORSE = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
  K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
  U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.'
}
const MORSE_REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]))

export function toMorse(text) {
  return text
    .toUpperCase()
    .split(' ')
    .map((w) =>
      w
        .split('')
        .map((c) => MORSE[c] || '')
        .filter(Boolean)
        .join(' ')
    )
    .join(' / ')
}

export function fromMorse(m) {
  return m
    .trim()
    .split(/\s*\/\s*/)
    .map((w) =>
      w
        .split(/\s+/)
        .map((c) => MORSE_REV[c] || '')
        .join('')
    )
    .join(' ')
}

export function normalizeAnswer(s) {
  return clean(s).toUpperCase().replace(/\s+/g, ' ').trim()
}
