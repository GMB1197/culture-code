// ---------- Domande (Indovina il codice + Sfida del giorno) ----------
// cat: info = informatica, nap = Napoli, cul = cultura e storia del codice
export const QUESTIONS = [
  { cat: 'info', q: 'Quanti bit ci sono in un byte?', o: ['4', '8', '16', '32'], a: 1, why: 'Un byte è un gruppo di 8 bit: 8 interruttori che valgono 0 o 1, fino a 256 combinazioni.' },
  { cat: 'info', q: 'Che cosa fa il DNS?', o: ['Protegge la rete dai virus', 'Traduce i nomi dei siti in indirizzi IP', 'Velocizza il Wi-Fi', 'Archivia le password'], a: 1, why: 'Il DNS è la rubrica di Internet: trasforma "google.com" nel numero che identifica il server.' },
  { cat: 'info', q: 'Che cos\'è, in concreto, "il cloud"?', o: ['Una nuvola di dati nell\'aria', 'Computer di qualcun altro in un edificio', 'Un tipo di Wi-Fi', 'Un software antivirus'], a: 1, why: 'Il cloud sono server fisici dentro i data center: la nuvola è solo una metafora.' },
  { cat: 'info', q: 'A che cosa serve un database?', o: ['A disegnare interfacce', 'A salvare e ritrovare dati in modo organizzato', 'A comprimere i video', 'A scrivere codice più veloce'], a: 1, why: 'È l\'archivio dietro quasi ogni app: utenti, post, ordini e tutto il resto vivono lì.' },
  { cat: 'info', q: 'Quale password è più difficile da indovinare?', o: ['Napoli1926!', 'P@ssw0rd', 'cavallo-lampada-mare-vulcano', '12345678'], a: 2, why: 'Conta soprattutto la lunghezza: quattro parole casuali valgono più di una parola con simboli sostituiti.' },
  { cat: 'info', q: 'Come "impara" un modello di intelligenza artificiale?', o: ['Qualcuno scrive ogni risposta a mano', 'Trova schemi in moltissimi esempi', 'Copia Internet intera in memoria', 'Cerca su Google ogni volta'], a: 1, why: 'Il machine learning regola milioni di parametri finché i suoi risultati somigliano agli esempi.' },
  { cat: 'info', q: 'Qual è il numero decimale rappresentato da 1010 in binario?', o: ['8', '10', '12', '14'], a: 1, why: '1010 = 8 + 0 + 2 + 0 = 10.' },
  { cat: 'info', q: 'Che cosa significa la "S" in HTTPS?', o: ['Server', 'Speed', 'Secure', 'Simple'], a: 2, why: 'HTTPS cifra la comunicazione tra te e il sito, quindi nessuno in mezzo può leggerla facilmente.' },
  { cat: 'info', q: 'Quale linguaggio descrive la struttura di una pagina web?', o: ['HTML', 'SQL', 'Python', 'Bash'], a: 0, why: 'HTML definisce titoli, paragrafi, immagini e link; CSS ne cura l\'aspetto.' },
  { cat: 'cul', q: 'Chi viene ricordata come autrice del primo algoritmo pensato per una macchina?', o: ['Ada Lovelace', 'Marie Curie', 'Rita Levi-Montalcini', 'Margherita Hack'], a: 0, why: 'Nel 1843 Ada Lovelace descrisse un procedimento di calcolo per la macchina analitica di Babbage.' },
  { cat: 'cul', q: 'Quale popolo antico diffuse l\'alfabeto fonetico da cui derivano greco e latino?', o: ['Egizi', 'Fenici', 'Etruschi', 'Sumeri'], a: 1, why: 'L\'alfabeto fenicio usava un segno per suono: il primo "linguaggio" semplice ed efficiente.' },
  { cat: 'cul', q: 'Per quale tecnologia fu inventato il codice Morse?', o: ['Radio FM', 'Telegrafo', 'Telefono', 'Televisione'], a: 1, why: 'Il Morse trasformava le lettere in impulsi lunghi e brevi lungo i fili del telegrafo.' },
  { cat: 'cul', q: 'Quale invenzione del Quattrocento cambiò per sempre la diffusione del sapere?', o: ['La stampa a caratteri mobili', 'La polvere da sparo', 'Il microscopio', 'L\'orologio meccanico'], a: 0, why: 'Con Gutenberg i libri smisero di essere copiati a mano e il sapere iniziò a circolare in massa.' },
  { cat: 'cul', q: 'Il telaio Jacquard usava schede forate: di quale idea è un antenato?', o: ['Dei programmi memorizzati', 'Dei satelliti', 'Dei laser', 'Del GPS'], a: 0, why: 'Le schede forate dettavano il disegno del tessuto e ispirarono Babbage e i primi computer.' },
  { cat: 'cul', q: 'Chi pubblicò nel 1703 la spiegazione moderna del sistema binario?', o: ['Leibniz', 'Newton', 'Galileo', 'Pascal'], a: 0, why: 'Gottfried Wilhelm Leibniz mostrò che bastano 0 e 1 per scrivere qualsiasi numero.' },
  { cat: 'cul', q: 'Come può un computer "riconoscere" il soggetto di un dipinto?', o: ['Con una rete neurale addestrata sulle immagini', 'Leggendo il titolo sulla cornice', 'Ascoltando la voce dell\'autore', 'Chiedendolo al museo'], a: 0, why: 'Le reti neurali convoluzionali imparano forme e texture da milioni di immagini etichettate.' },
  { cat: 'nap', q: 'In che anno fu fondata l\'Università di Napoli Federico II?', o: ['1088', '1224', '1348', '1500'], a: 1, why: 'Federico II di Svevia la fondò nel 1224: è tra le più antiche università del mondo.' },
  { cat: 'nap', q: 'Quale azienda tech ha aperto a Napoli, a San Giovanni a Teduccio, la sua prima academy per sviluppatori in Europa?', o: ['Google', 'Apple', 'Microsoft', 'Amazon'], a: 1, why: 'L\'Apple Developer Academy è nata nel 2016 con l\'Università Federico II.' },
  { cat: 'nap', q: 'In che anno fu inaugurato il Teatro di San Carlo?', o: ['1537', '1737', '1837', '1937'], a: 1, why: 'Inaugurato nel 1737, è considerato il più antico teatro d\'opera d\'Europa ancora attivo.' },
  { cat: 'nap', q: 'Quale istituto napoletano, fondato nel 1872 da Anton Dohrn, studia la vita marina?', o: ['Stazione Zoologica', 'Osservatorio Vesuviano', 'Orto Botanico', 'Acquario di Cetara'], a: 0, why: 'La Stazione Zoologica Anton Dohrn nacque nella Villa Comunale ed è un riferimento mondiale per la biologia marina.' },
  { cat: 'nap', q: 'Che cosa si osserva dall\'Osservatorio Astronomico di Capodimonte, fondato nel 1819?', o: ['Il cielo', 'Il mare', 'I vulcani', 'Il traffico'], a: 0, why: 'È uno dei più antichi osservatori astronomici italiani e oggi usa anche analisi dei dati su larga scala.' },
  { cat: 'nap', q: 'Da quali antiche città vesuviane arrivano molti reperti del Museo Archeologico Nazionale di Napoli?', o: ['Pompei ed Ercolano', 'Cuma e Baia', 'Paestum e Velia', 'Capua e Benevento'], a: 0, why: 'Affreschi, mosaici e oggetti di vita quotidiana da Pompei ed Ercolano sono custoditi proprio lì.' },
  { cat: 'nap', q: 'Chi scolpì il Cristo velato della Cappella Sansevero?', o: ['Giuseppe Sanmartino', 'Michelangelo', 'Canova', 'Bernini'], a: 0, why: 'Giuseppe Sanmartino lo realizzò nel 1753: il velo di marmo sembra stoffa vera.' }
]

export const CAT_ICON = { info: 'chip', nap: 'landmark', cul: 'bookOpen' }
export const CAT_LABEL = { info: 'Informatica', nap: 'Napoli', cul: 'Cultura del codice' }

// ---------- Decifra il messaggio ----------
// kind: caesar (shift noto), atbash, binary, morse, caesar-unknown
export const CIPHER_LEVELS = [
  { id: 1, kind: 'caesar', shift: 3, plain: 'CIAO NAPOLI', title: 'Il cifrario di Cesare', story: 'Giulio Cesare spostava ogni lettera di 3 posti: A diventa D, B diventa E. Per leggerlo devi tornare indietro di 3.', hint: 'Sposta ogni lettera indietro di 3 posizioni.', lesson: 'È il più semplice cifrario a sostituzione. Con sole 25 chiavi possibili si rompe in pochi secondi.' },
  { id: 2, kind: 'atbash', plain: 'IL CODICE E CULTURA', title: 'Atbash', story: 'Un cifrario antico, usato anche in testi ebraici: l\'alfabeto viene specchiato. A diventa Z, B diventa Y.', hint: 'A↔Z, B↔Y, C↔X, e così via.', lesson: 'È un cifrario senza chiave: chi conosce il metodo lo legge subito. La sicurezza vera ha sempre bisogno di una chiave segreta.' },
  { id: 3, kind: 'binary', plain: 'CODICE', title: 'Binario', story: 'I computer scrivono tutto con 0 e 1. Ogni lettera è un gruppo di 8 cifre (un byte) secondo la tabella ASCII.', hint: 'Converti ogni gruppo di 8 bit in decimale, poi cerca la lettera: 01000001 = 65 = A.', lesson: 'Leibniz mostrò nel 1703 che bastano due simboli per scrivere qualunque numero: è la base di ogni computer.' },
  { id: 4, kind: 'morse', plain: 'SOS NAPOLI', title: 'Codice Morse', story: 'Punti e linee per il telegrafo. Le lettere sono separate da uno spazio, le parole da una barra /.', hint: 'S = ...  O = ---  e prosegui da lì.', lesson: 'Il Morse è un codice a lunghezza variabile: le lettere frequenti, come la E (un solo punto), sono più corte. Lo stesso principio delle compressioni moderne.' },
  { id: 5, kind: 'caesar', shift: 7, plain: 'LA PASSWORD CONTA', title: 'Cesare, chiave misteriosa', story: 'Stavolta lo spostamento non è 3. Hai 25 possibilità: prova a trovare quella giusta.', hint: 'Usa il cursore sotto per provare tutti gli spostamenti: si legge una sola frase sensata.', lesson: 'Provare tutte le chiavi si chiama forza bruta. Più chiavi possibili ci sono, più è lungo provarle.', brute: true },
  { id: 6, kind: 'vigenere', key: 'NAPOLI', plain: 'IL CODICE AMA IL VESUVIO', title: 'Vigenère', story: 'Il cifrario "indecifrabile" per tre secoli: ogni lettera viene spostata di quanto indica la lettera corrispondente di una parola chiave. Qui la chiave è NAPOLI e si ripete.', hint: 'Per la prima lettera sposta indietro di N (13), per la seconda di A (0), poi P (15), O (14), L (11), I (8), e ricomincia.', lesson: 'Vigenère cambia lo spostamento a ogni lettera, quindi l\'analisi delle frequenze semplice non basta. Fu rotto nell\'Ottocento da Babbage e Kasiski.' }
]

export function vigenere(text, key, decrypt = false) {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let k = 0
  return text
    .toUpperCase()
    .split('')
    .map((c) => {
      const i = A.indexOf(c)
      if (i < 0) return c
      const s = A.indexOf(key[k % key.length])
      k++
      return A[(i + (decrypt ? 26 - s : s)) % 26]
    })
    .join('')
}

// ---------- IP o DNS? ----------
// t: ip | dom | dns
export const DNS_ITEMS = [
  { t: 'ip', s: '142.250.180.14' }, { t: 'ip', s: '192.168.1.1' }, { t: 'ip', s: '8.8.8.8' },
  { t: 'ip', s: '2001:db8::1' }, { t: 'ip', s: '127.0.0.1' }, { t: 'ip', s: '93.184.216.34' },
  { t: 'dom', s: 'wikipedia.org' }, { t: 'dom', s: 'unina.it' }, { t: 'dom', s: 'instagram.com' },
  { t: 'dom', s: 'youtube.com' }, { t: 'dom', s: 'comune.napoli.it' }, { t: 'dom', s: 'cltrcode.app' },
  { t: 'dns', s: 'La rubrica che traduce i nomi in numeri' },
  { t: 'dns', s: 'Risponde alla domanda: "dov\'è questo sito?"' },
  { t: 'dns', s: 'Il servizio che collega youtube.com al suo server' },
  { t: 'dns', s: 'Il sistema dei nomi di dominio' },
  { t: 'dns', s: 'Ricorda i numeri così tu ricordi i nomi' },
  { t: 'dns', s: 'Il passaggio che avviene prima ancora che la pagina si carichi' }
]

// ---------- Museo in ttasca ----------
export const MUSEUM = [
  { id: 'fenici', ic: 'font', title: 'L\'alfabeto fenicio', era: 'circa XI secolo a.C.', text: 'Prima dell\'alfabeto serviva imparare centinaia di segni per scrivere. I Fenici ne usarono pochi, uno per ogni suono. Fu un\'invenzione di semplicità: da quel sistema derivano l\'alfabeto greco e quello latino, quello che stai leggendo adesso.' },
  { id: 'antikythera', ic: 'gears', title: 'Il meccanismo di Anticitera', era: 'II–I secolo a.C.', text: 'Recuperato nel 1901 da un relitto vicino all\'isola di Anticitera, è un complesso ingranaggio di bronzo. Serviva a prevedere le posizioni degli astri e le eclissi. Molti lo considerano il più antico calcolatore analogico conosciuto.' },
  { id: 'gutenberg', ic: 'bookOpen', title: 'La stampa a caratteri mobili', era: 'circa 1455', text: 'Con i caratteri mobili di Gutenberg un testo si compone una volta e si ristampa mille volte. I libri diventano più economici, le idee viaggiano più veloci. È una rivoluzione dell\'informazione come lo sarà Internet.' },
  { id: 'jacquard', ic: 'tableCells', title: 'Il telaio Jacquard', era: '1804', text: 'Joseph Marie Jacquard automatizzò il telaio con schede di cartone forate: i fori decidevano quali fili alzare. È un programma scritto su un supporto fisico. Babbage e Ada Lovelace si ispirarono a quest\'idea per la macchina analitica.' },
  { id: 'lovelace', ic: 'laptopCode', title: 'Le note di Ada Lovelace', era: '1843', text: 'Traducendo un articolo sulla macchina analitica, Ada Lovelace aggiunse note più lunghe del testo stesso. Descrisse un procedimento per calcolare i numeri di Bernoulli e intuì che una macchina poteva manipolare simboli, non solo numeri. Per questo è ricordata come la prima programmatrice.' }
]

// ---------- Mappa culturale di Napoli ----------
export const NAPOLI = [
  { id: 'unina', name: 'Università Federico II', lat: 40.8467, lng: 14.2569, ic: 'graduationCap', story: 'Fondata nel 1224 da Federico II di Svevia per formare i funzionari del regno, senza dipendere dalla Chiesa. È una delle più antiche università del mondo e oggi ospita anche corsi di informatica e data science.', idea: 'App che mostra su una mappa tutte le facoltà con la loro data di fondazione, come una linea del tempo del sapere.', q: 'Quale imperatore la fondò?', o: ['Federico II', 'Carlo V', 'Napoleone', 'Augusto'], a: 0 },
  { id: 'sancarlo', name: 'Teatro di San Carlo', lat: 40.8374, lng: 14.2497, ic: 'masksTheater', story: 'Inaugurato nel 1737, è considerato il più antico teatro d\'opera d\'Europa ancora in attività. La sala è pensata per l\'acustica: la voce arriva a tutti senza microfono.', idea: 'Un modello 3D in cui vedi come il suono si riflette sulle pareti e sui palchi.', q: 'In che secolo fu inaugurato?', o: ['XVI', 'XVIII', 'XIX', 'XX'], a: 1 },
  { id: 'toledo', name: 'Stazione Toledo', lat: 40.8397, lng: 14.2491, ic: 'trainSubway', story: 'Una delle stazioni "dell\'arte" della metropolitana: mosaici, luce e colore trasformano un passaggio quotidiano in un museo sotterraneo. Spesso compare tra le più belle stazioni d\'Europa.', idea: 'Un\'audioguida per i pendolari, attivata scansionando un QR sulla banchina.', q: 'Che tipo di luogo è la stazione Toledo?', o: ['Un mercato', 'Una stazione della metro', 'Un faro', 'Un castello'], a: 1 },
  { id: 'sansevero', name: 'Cappella Sansevero', lat: 40.8486, lng: 14.2551, ic: 'monument', story: 'Custodisce il Cristo velato di Giuseppe Sanmartino (1753): un velo di marmo così sottile da sembrare stoffa. Accanto, le misteriose Macchine anatomiche attirano scienziati e curiosi.', idea: 'Un\'esperienza in realtà aumentata che "toglie" il velo e mostra la struttura della scultura.', q: 'Chi scolpì il Cristo velato?', o: ['Bernini', 'Sanmartino', 'Canova', 'Donatello'], a: 1 },
  { id: 'museo', name: 'Museo Archeologico Nazionale', lat: 40.8531, lng: 14.2503, ic: 'landmark', story: 'Una delle più grandi raccolte archeologiche del mondo: affreschi, mosaici e oggetti di Pompei ed Ercolano, più la collezione Farnese.', idea: 'Un database di reperti con ricerca per immagine: scatti una foto e ritrovi l\'oggetto simile.', q: 'Da quali città arrivano molti suoi reperti?', o: ['Pompei ed Ercolano', 'Atene e Sparta', 'Roma e Milano', 'Torino e Genova'], a: 0 },
  { id: 'dohrn', name: 'Stazione Zoologica Anton Dohrn', lat: 40.8328, lng: 14.2375, ic: 'water', story: 'Fondata nel 1872 dal tedesco Anton Dohrn nella Villa Comunale, è un istituto di ricerca marina tra i più antichi del mondo. Gli scienziati vengono qui da ogni paese per studiare il Golfo.', idea: 'Una dashboard con i dati del mare in tempo reale, mostrati come una mappa interattiva.', q: 'Che cosa studia soprattutto?', o: ['La vita marina', 'I vulcani', 'Le stelle', 'I testi antichi'], a: 0 },
  { id: 'capodimonte', name: 'Osservatorio di Capodimonte', lat: 40.8627, lng: 14.2506, ic: 'moon', story: 'Fondato nel 1819 sulla collina di Capodimonte, è un osservatorio astronomico storico. Oggi i telescopi producono tantissimi dati che vanno analizzati con il calcolo.', idea: 'Un simulatore del cielo di Napoli per ogni data della storia.', q: 'In che anno fu fondato?', o: ['1819', '1919', '1719', '1619'], a: 0 }
]
