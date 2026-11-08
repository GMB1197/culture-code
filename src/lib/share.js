// Genera una card verticale 1080x1920 (formato storia Instagram) e la condivide o la scarica.
export async function makeCard({ title, big, lines = [], footer = 'cltrcode' }) {
  const W = 1080
  const H = 1920
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  const bg = g.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#1d1a2a')
  bg.addColorStop(1, '#0b0b0f')
  g.fillStyle = bg
  g.fillRect(0, 0, W, H)
  g.strokeStyle = 'rgba(242,180,90,.25)'
  g.lineWidth = 3
  g.strokeRect(60, 60, W - 120, H - 120)

  g.textAlign = 'center'
  g.fillStyle = '#f2b45a'
  g.font = '700 90px ui-monospace, Menlo, monospace'
  g.fillText('</>', W / 2, 260)
  g.fillStyle = '#9a97a6'
  g.font = '600 38px system-ui, sans-serif'
  g.fillText('CULTURE CODE', W / 2, 330)

  g.fillStyle = '#f1ede6'
  g.font = '700 74px system-ui, sans-serif'
  wrap(g, title, W / 2, 700, 880, 90)

  g.fillStyle = '#f2b45a'
  g.font = '800 200px system-ui, sans-serif'
  g.fillText(big, W / 2, 1010)

  g.fillStyle = '#f1ede6'
  g.font = '500 48px system-ui, sans-serif'
  let y = 1160
  for (const l of lines) {
    y = wrap(g, l, W / 2, y, 860, 64) + 20
  }

  g.fillStyle = '#9a97a6'
  g.font = '600 40px ui-monospace, Menlo, monospace'
  g.fillText('@' + footer, W / 2, H - 140)
  return new Promise((res) => c.toBlob(res, 'image/png'))
}

function wrap(g, text, x, y, maxW, lh) {
  const words = String(text).split(' ')
  let line = ''
  for (const w of words) {
    const t = line ? line + ' ' + w : w
    if (g.measureText(t).width > maxW && line) {
      g.fillText(line, x, y)
      line = w
      y += lh
    } else line = t
  }
  g.fillText(line, x, y)
  return y + lh
}

export async function shareCard(opts, text = '') {
  const blob = await makeCard(opts)
  const file = new File([blob], 'culture-code.png', { type: 'image/png' })
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text })
      return 'shared'
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return 'cancel'
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'culture-code.png'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
  return 'download'
}
