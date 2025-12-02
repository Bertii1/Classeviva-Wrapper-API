# Classeviva.js

**Wrapper JavaScript/Node.js per l'API di Classeviva** - Registro elettronico di Spaggiari

[![npm version](https://img.shields.io/badge/npm-1.0.0-blue.svg)](https://npmjs.org)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-green.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)

## 📖 Descrizione

Libreria JavaScript per interagire con il sistema Classeviva di Spaggiari, il registro elettronico utilizzato nelle scuole italiane. Conversione della libreria Python originale con supporto completo per Node.js e JavaScript moderno.

### ✨ Caratteristiche

- 🔄 **API completamente async/await**
- 🏫 **Copertura completa API Classeviva** (voti, assenze, agenda, documenti, etc.)
- 👥 **Gestione batch utenti** con `ListaUtenti` 
- 🛡️ **Gestione errori robusta** con eccezioni tipizzate
- 📅 **Validazione automatica date** 
- 🔐 **Gestione sessioni e token automatica**
- 📦 **Import ES6 moderni**
- 🇮🇹 **Documentazione e messaggi in italiano**

## 🚀 Installazione

```bash
npm install classeviva-js
```

## 📋 Requisiti

- **Node.js** ≥ 16.0.0
- **npm** o **yarn**

## 🔧 Utilizzo Base

### Import

```javascript
// Named imports (raccomandato)
import { Utente, ListaUtenti } from 'classeviva-js';

// Default import
import Classeviva from 'classeviva-js';
const utente = new Classeviva.Utente('utente', 'password');

// Import specifici
import { PasswordNonValida, validaDate } from 'classeviva-js';
```

### Singolo Utente

```javascript
import { Utente } from 'classeviva-js';

async function main() {
    // Crea utente
    const utente = new Utente('utente', 'tua_password');
    
    try {
        // Effettua l'accesso
        await utente.accedi();
        console.log('✅ Accesso effettuato!');
        
        // Ottieni informazioni utente
        console.log('Dati utente:', utente.dati);
        
        // Ottieni i voti
        const voti = await utente.voti();
        console.log('Voti:', voti);
        
        // Ottieni le assenze
        const assenze = await utente.assenze();
        console.log('Assenze:', assenze);
        
        // Ottieni l'agenda
        const agenda = await utente.agenda();
        console.log('Agenda:', agenda);
        
    } catch (error) {
        console.error('Errore:', error.message);
    }
}

main();
```

### Lista Utenti (Operazioni Batch)

```javascript
import { Utente, ListaUtenti } from 'classeviva-js';

async function gestisciClasse() {
    // Crea lista studenti
    const studenti = new ListaUtenti([
        new Utente('utente1', 'password1'),
        new Utente('utente2', 'password2'),
        new Utente('utente3', 'password3')
    ]);
    
    try {
        // Effettua l'accesso per tutti
        await studenti.accedi();
        console.log('✅ Tutti gli studenti connessi!');
        
        // Ottieni i voti di tutti
        const votiTutti = await studenti.votiTutti();
        console.log('Voti classe:', votiTutti);
        
        // Ottieni statistiche
        console.log('Statistiche:', studenti.statistiche);
        
    } catch (error) {
        console.error('Errore batch:', error.message);
    }
}

gestisciClasse();
```

## 📚 API Documentazione

### Classe `Utente`

#### Metodi Principali

| Metodo | Descrizione | Ritorno |
|--------|-------------|---------|
| `accedi()` | Effettua l'accesso | `Promise<void>` |
| `voti()` | Ottiene i voti | `Promise<Array>` |
| `assenze()` | Ottiene le assenze | `Promise<Array>` |
| `materie()` | Ottiene le materie | `Promise<Array>` |
| `agenda()` | Ottiene l'agenda | `Promise<Array>` |
| `note()` | Ottiene le note | `Promise<Object>` |
| `pagelle()` | Ottiene le pagelle | `Promise<Array>` |
| `bacheca()` | Ottiene la bacheca | `Promise<Array>` |
| `carta()` | Ottiene carta studente | `Promise<Object>` |
| `libri()` | Ottiene libri di testo | `Promise<Object>` |

#### Proprietà

| Proprietà | Descrizione | Tipo |
|-----------|-------------|------|
| `connesso` | Stato connessione | `boolean` |
| `dati` | Dati utente essenziali | `Object` |
| `token` | Token di autenticazione | `string` |

### Classe `ListaUtenti`

#### Metodi Principali

| Metodo | Descrizione | Ritorno |
|--------|-------------|---------|
| `accedi()` | Accesso per tutti gli utenti | `Promise<void>` |
| `votiTutti()` | Voti di tutti gli utenti | `Promise<Array>` |
| `assenzeTutti()` | Assenze di tutti gli utenti | `Promise<Array>` |
| `aggiungi(utente)` | Aggiunge utente (no duplicati) | `boolean` |
| `applicaTutti(metodo, ...args)` | Applica metodo a tutti | `Promise<Array>` |

## 🎯 Esempi Avanzati

### Gestione Date

```javascript
import { validaDate, formattaDataPerAPI } from 'classeviva-js';

// Ottieni assenze in un periodo
const assenzePeriodo = await utente.assenzeDaA('2024-01-01', '2024-03-31');

// Ottieni agenda specifica
const agendaMarzo = await utente.agendaDaA('2024-03-01', '2024-03-31');
```

### Gestione Errori

```javascript
import { PasswordNonValida, TokenScaduto, DataFuoriGamma } from 'classeviva-js';

try {
    await utente.accedi();
} catch (error) {
    if (error instanceof PasswordNonValida) {
        console.error('Credenziali non valide');
    } else if (error instanceof TokenScaduto) {
        console.error('Sessione scaduta, riaccedi');
    } else if (error instanceof DataFuoriGamma) {
        console.error('Data fuori range anno scolastico');
    } else {
        console.error('Errore generico:', error.message);
    }
}
```

### Download File

```javascript
// Ottieni avatar
const avatarBuffer = await utente.avatar();
// Salva su file
import fs from 'fs';
fs.writeFileSync('avatar.jpg', avatarBuffer);

// Ottieni documenti
const documenti = await utente.documenti();
console.log('Pagelle disponibili:', documenti.schoolReports);
```

## 🔒 Sicurezza

⚠️ **IMPORTANTE**: Non salvare mai le credenziali nel codice! Usa variabili d'ambiente:

```javascript
// .env file
CLASSEVIVA_USER=S1234567
CLASSEVIVA_PASSWORD=tua_password_sicura

// Nel codice
import 'dotenv/config';
const utente = new Utente(
    process.env.CLASSEVIVA_USER,
    process.env.CLASSEVIVA_PASSWORD
);
```

## 🛠️ Sviluppo

```bash
# Clona repository
git clone https://github.com/tu-username/classeviva-js.git

# Installa dipendenze
npm install

# Esegui esempi
npm run test

# Sviluppo con watch
npm run dev
```

## 📁 Struttura Progetto

```
src/
├── lib/
│   ├── Utente.js          # Classe principale utente
│   ├── ListaUtenti.js     # Gestione batch utenti
│   ├── collegamenti.js    # URL endpoints API
│   ├── eccezioni.js       # Eccezioni personalizzate
│   └── variabili.js       # Costanti e utility
├── index.js               # Entry point principale
examples/
├── esempio-base.js        # Esempi di utilizzo
test/
└── test.js               # Test base
```

## 🤝 Contributi

I contributi sono benvenuti! Per favore:

1. Fai un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per dettagli.

## 🙏 Crediti

- **Libreria Python originale**: [Classeviva-Wrapper-API](https://github.com/Lioydiano/Classeviva)
- **API Endpoints**: [Documentazione ufficiale](https://github.com/Lioydiano/Classeviva-Official-Endpoints)
- **Conversione JavaScript**: Filippo Berti

## ❓ Supporto

Per problemi o domande:
- Apri una [Issue](https://github.com/tu-username/classeviva-js/issues)
- Consulta la [Documentazione API](https://github.com/Lioydiano/Classeviva-Official-Endpoints)

---

⭐ **Se questa libreria ti è utile, lascia una stella su GitHub!** ⭐
