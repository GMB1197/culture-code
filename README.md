# Culture Code (@cltrcode)

Web app / PWA interattiva per il profilo social Culture Code. Vue 3 + Vite + vite-plugin-pwa, nessun backend: i progressi sono salvati in `localStorage`.

## Contenuti

**Giochi e quiz:** Indovina il codice · Decifra il messaggio (6 livelli) · Password Cracker · IP o DNS? · Il computer vede l'arte
**Esperienze:** Museo in tasca (audioguida + AR leggera con fotocamera) · Mappa culturale di Napoli · Binario o alfabeto?
**Fidelizzazione:** Sfida del giorno (uguale per tutti, cambia ogni giorno) · striscia · XP e livelli (Apprendista, Sviluppatore, Hacker culturale) · 12 badge · card 1080×1920 per le storie · pagina `/qr` con QR scaricabili

## Sviluppo

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # test della logica (cifrari, password, sfida del giorno, contenuti)
npm run build    # produce dist/
```

## Pubblicazione

```bash
git init && git add . && git commit -m "Culture Code"
git branch -M main
git remote add origin https://github.com/GMB1197/cltrcode.git
git push -u origin main
```

Su Vercel: *Add New → Project → importa il repo*. Preset **Vite** (build `npm run build`, output `dist`). Il file `vercel.json` gestisce le rotte della SPA.

Quando hai il dominio definitivo, aggiungi su Vercel la variabile `VITE_SITE_URL` (es. `https://cltrcode.vercel.app`) così i QR in `/qr` puntano all'indirizzo giusto, poi rifai il deploy.

## Da personalizzare

- `src/lib/config.js`: link ai reel e al profilo Instagram.
- `src/lib/content.js`: domande, livelli di cifratura, tappe del museo, luoghi di Napoli.
- `src/style.css`: colori (variabili `:root`).
- `public/icon-*.png` e `favicon.svg`: icone dell'app.

## Note

- La mappa usa i tile di OpenStreetMap (serve connessione; i tile visti vengono messi in cache).
- La realtà aumentata richiede HTTPS e il permesso della fotocamera; l'audioguida usa la sintesi vocale del dispositivo.
- Il Password Cracker è didattico: la password non lascia mai il dispositivo.
