// Modifica qui i collegamenti ai tuoi reel: appariranno nella pagina /qr
export const REELS = [
  { title: 'Cos\'è un IP e un DNS', game: '/ip-dns', url: '' },
  { title: 'Cos\'è una password sicura', game: '/password', url: '' },
  { title: 'Il codice più antico del mondo', game: '/decifra', url: '' },
  { title: 'Come un computer legge un quadro', game: '/arte', url: '' },
  { title: 'Come funziona un\'audioguida digitale', game: '/museo', url: '' },
  { title: 'Napoli e la tecnologia', game: '/mappa', url: '' }
]

export const INSTAGRAM = 'https://www.instagram.com/cltrcode/'

export function siteUrl() {
  return (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '')
}
