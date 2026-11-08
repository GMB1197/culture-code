import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'
import Ic from './components/Ic.vue'
import { tilt, magnetic } from './lib/motion'
import 'leaflet/dist/leaflet.css'
import Landing from './views/Landing.vue'
import Games from './views/Games.vue'

const routes = [
  { path: '/', component: Landing, meta: { title: 'Culture Code' } },
  { path: '/giochi', component: Games, meta: { title: 'Giochi' } },
  { path: '/sfida', component: () => import('./views/Daily.vue'), meta: { title: 'Sfida del giorno' } },
  { path: '/indovina', component: () => import('./views/Quiz.vue'), meta: { title: 'Indovina il codice' } },
  { path: '/decifra', component: () => import('./views/Cipher.vue'), meta: { title: 'Decifra il messaggio' } },
  { path: '/password', component: () => import('./views/Password.vue'), meta: { title: 'Password Cracker' } },
  { path: '/ip-dns', component: () => import('./views/DnsGame.vue'), meta: { title: 'IP o DNS?' } },
  { path: '/arte', component: () => import('./views/Vision.vue'), meta: { title: "Il computer vede l'arte" } },
  { path: '/museo', component: () => import('./views/Museum.vue'), meta: { title: 'Museo in tasca' } },
  { path: '/mappa', component: () => import('./views/MapNapoli.vue'), meta: { title: 'Mappa culturale di Napoli' } },
  { path: '/binario', component: () => import('./views/Binary.vue'), meta: { title: 'Binario o alfabeto?' } },
  { path: '/profilo', component: () => import('./views/Profile.vue'), meta: { title: 'Il tuo profilo' } },
  { path: '/qr', component: () => import('./views/QrPage.vue'), meta: { title: 'QR e reel' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
router.afterEach((to) => {
  document.title = to.meta.title === 'Culture Code' ? 'Culture Code' : `${to.meta.title} · Culture Code`
})

const app = createApp(App)
app.component('Ic', Ic)
app.directive('tilt', tilt)
app.directive('magnetic', magnetic)
app.use(router).mount('#app')

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.__bip = e
})
