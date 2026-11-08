const COMMON = [
  '123456', '123456789', '12345678', 'password', 'qwerty', 'abc123', '111111', '123123', 'admin',
  'letmein', 'welcome', 'iloveyou', 'monkey', 'dragon', 'master', 'login', 'passw0rd', 'password1',
  'qwertyuiop', 'ciao', 'napoli', 'juventus', 'milan', 'inter', 'roma', 'password123', 'forzanapoli',
  'maradona', 'italia', 'giuseppe', 'francesco', 'ciao123', '000000', '1q2w3e4r', 'azerty', 'asdfgh'
]

// Ipotesi: attacco offline con GPU su hash veloce ≈ 10 miliardi di tentativi al secondo
export const GUESSES_PER_SEC = 1e10

function leet(s) {
  return s
    .toLowerCase()
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/\$/g, 's')
    .replace(/@/g, 'a')
}

function hasSequence(s) {
  const t = s.toLowerCase()
  let run = 1
  for (let i = 1; i < t.length; i++) {
    const d = t.charCodeAt(i) - t.charCodeAt(i - 1)
    if (d === 1 || d === -1) {
      run++
      if (run >= 4) return true
    } else run = 1
  }
  return false
}

export function analyze(pw) {
  if (!pw) return { empty: true }
  let pool = 0
  if (/[a-z]/.test(pw)) pool += 26
  if (/[A-Z]/.test(pw)) pool += 26
  if (/[0-9]/.test(pw)) pool += 10
  if (/[^A-Za-z0-9]/.test(pw)) pool += 33
  let entropy = pw.length * Math.log2(Math.max(pool, 2))

  const flags = []
  const lowered = pw.toLowerCase()
  const core = leet(pw)
  const common = COMMON.some((c) => lowered === c || core === c)
  if (common) {
    flags.push('È tra le password più usate: si trova in un dizionario.')
    entropy = Math.min(entropy, 10)
  } else if (COMMON.some((c) => c.length >= 5 && core.includes(c))) {
    flags.push('Contiene una parola comune: i dizionari la provano per prima.')
    entropy *= 0.6
  }
  if (/(.)\1{2,}/.test(pw)) {
    flags.push('Ripete lo stesso carattere più volte.')
    entropy *= 0.8
  }
  if (hasSequence(pw)) {
    flags.push('Contiene una sequenza (abcd, 1234…) facile da indovinare.')
    entropy *= 0.75
  }
  if (/(19|20)\d{2}/.test(pw)) {
    flags.push('Contiene un anno: tra i pattern più provati.')
    entropy *= 0.85
  }
  if (pw.length < 8) flags.push('Troppo corta: sotto 8 caratteri cade in fretta.')

  const combos = Math.pow(2, entropy)
  const seconds = combos / 2 / GUESSES_PER_SEC // media: si trova a metà strada

  let label = 'Debolissima'
  let score = 0
  if (seconds > 1) { label = 'Debole'; score = 1 }
  if (seconds > 3600 * 24) { label = 'Discreta'; score = 2 }
  if (seconds > 3600 * 24 * 365) { label = 'Forte'; score = 3 }
  if (seconds > 3600 * 24 * 365 * 100) { label = 'Blindata'; score = 4 }

  return { empty: false, entropy: Math.round(entropy), seconds, label, score, flags, pool }
}

export function humanTime(sec) {
  if (sec < 0.001) return 'meno di un istante'
  if (sec < 1) return 'meno di un secondo'
  const Y = 3600 * 24 * 365
  const steps = [
    [Y * 1000, 'millennio', 'millenni'],
    [Y * 100, 'secolo', 'secoli'],
    [Y, 'anno', 'anni'],
    [86400, 'giorno', 'giorni'],
    [3600, 'ora', 'ore'],
    [60, 'minuto', 'minuti'],
    [1, 'secondo', 'secondi']
  ]
  if (sec > Y * 1.4e10) return "più dell'età dell'universo"
  for (const [size, one, many] of steps) {
    if (sec >= size) {
      const v = sec / size
      const r = v >= 100 ? Math.round(v) : Math.round(v * 10) / 10
      return `${r.toLocaleString('it-IT')} ${r === 1 ? one : many}`
    }
  }
  return 'meno di un secondo'
}
