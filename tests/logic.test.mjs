import assert from 'node:assert/strict'
import { caesar, atbash, toBinary, fromBinary, toMorse, fromMorse, normalizeAnswer } from '../src/lib/ciphers.js'
import { analyze, humanTime } from '../src/lib/password.js'
import { seededRng, shuffle } from '../src/lib/daily.js'
import { CIPHER_LEVELS, QUESTIONS, vigenere, NAPOLI, DNS_ITEMS } from '../src/lib/content.js'

// cifrari: andata e ritorno
assert.equal(caesar('CIAO NAPOLI', 3), 'FLDR QDSROL')
assert.equal(caesar(caesar('CIAO NAPOLI', 3), -3), 'CIAO NAPOLI')
assert.equal(atbash(atbash('CODICE')), 'CODICE')
assert.equal(fromBinary(toBinary('CODICE')), 'CODICE')
assert.equal(toBinary('A'), '01000001')
assert.equal(fromMorse(toMorse('SOS NAPOLI')), 'SOS NAPOLI')
assert.equal(toMorse('SOS'), '... --- ...')
assert.equal(vigenere(vigenere('IL CODICE AMA IL VESUVIO', 'NAPOLI'), 'NAPOLI', true), 'IL CODICE AMA IL VESUVIO')
assert.equal(normalizeAnswer('  città   di napoli! '), 'CITTA DI NAPOLI')

// ogni livello: la risposta in chiaro è la stessa dopo normalizzazione
for (const l of CIPHER_LEVELS) assert.equal(normalizeAnswer(l.plain), l.plain, 'livello ' + l.id)

// password
assert.equal(analyze('123456').score, 0)
assert.equal(analyze('password').score, 0)
assert.ok(analyze('cavallo-lampada-mare-vulcano').score >= 4)
assert.ok(analyze('Xk9#mP2$vL').score > analyze('abcdefgh').score)
assert.equal(analyze('').empty, true)
assert.equal(humanTime(0.5), 'meno di un secondo')
assert.equal(humanTime(90), '1,5 minuti')
assert.equal(humanTime(3600 * 24 * 365 * 250), '2,5 secoli')
assert.ok(humanTime(1e30).includes('universo'))

// determinismo sfida del giorno
const a = shuffle([1, 2, 3, 4, 5, 6], seededRng('2026-11-09'))
const b = shuffle([1, 2, 3, 4, 5, 6], seededRng('2026-11-09'))
const c = shuffle([1, 2, 3, 4, 5, 6], seededRng('2026-11-10'))
assert.deepEqual(a, b)
assert.notDeepEqual(a, c)

// integrità dei contenuti
for (const q of QUESTIONS) {
  assert.equal(q.o.length, 4, q.q)
  assert.ok(q.a >= 0 && q.a < 4, q.q)
  assert.equal(new Set(q.o).size, 4, 'opzioni duplicate: ' + q.q)
}
for (const p of NAPOLI) assert.ok(p.a >= 0 && p.a < p.o.length && p.lat > 40 && p.lng > 14, p.id)
assert.ok(['ip', 'dom', 'dns'].every((t) => DNS_ITEMS.filter((x) => x.t === t).length >= 4))
console.log('Tutti i test OK')
