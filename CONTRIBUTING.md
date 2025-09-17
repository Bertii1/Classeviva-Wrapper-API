# Contributing to Classeviva.js

Grazie per l'interesse nel contribuire a Classeviva.js! 🎉

## 🤝 Come Contribuire

### 1. Fork e Clone

```bash
# Fai fork del repository su GitHub, poi clona
git clone https://github.com/tuo-username/classeviva-js.git
cd classeviva-js

# Aggiungi l'upstream
git remote add upstream https://github.com/original-username/classeviva-js.git
```

### 2. Setup Ambiente

```bash
# Installa dipendenze
npm install

# Verifica che tutto funzioni
npm test
npm run validate
```

### 3. Crea Branch

```bash
# Crea un branch per la tua feature/bugfix
git checkout -b feature/nome-feature
# oppure
git checkout -b fix/nome-bug
```

### 4. Sviluppa

- ✅ **Segui il coding style esistente**
- ✅ **Aggiungi commenti JSDoc per nuove funzioni**
- ✅ **Testa le modifiche con `npm test`**
- ✅ **Valida la sintassi con `npm run validate`**

### 5. Commit

```bash
# Commit con messaggi chiari
git commit -m "feat: aggiungi metodo per calendario dettagliato"
git commit -m "fix: correggi validazione date per febbraio"
git commit -m "docs: aggiorna esempi README"
```

**Convenzioni commit:**
- `feat:` nuova funzionalità
- `fix:` correzione bug
- `docs:` documentazione
- `style:` formattazione (non logica)
- `refactor:` refactoring codice
- `test:` test aggiuntivi
- `chore:` manutenzione

### 6. Push e Pull Request

```bash
# Push del branch
git push origin feature/nome-feature

# Crea Pull Request su GitHub con:
# - Titolo descrittivo
# - Descrizione di cosa cambia
# - Link a issue se applicabile
```

## 🧪 Testing

### Test Locale
```bash
# Test base (senza credenziali reali)
npm test

# Test con credenziali reali (se disponibili)
# Crea un file test-reale.js con le tue credenziali
# (questo file è in .gitignore)
node test-reale.js
```

### Validazione
```bash
# Controlla sintassi
npm run validate

# Lint (se disponibile)
npm run lint
```

## 📝 Linee Guida Codice

### Stile JavaScript
```javascript
// ✅ Buono
export class NuovaClasse {
    /**
     * Descrizione metodo
     * @param {string} parametro - Descrizione parametro
     * @returns {Promise<Object>} Descrizione ritorno
     */
    async nuovoMetodo(parametro) {
        if (!parametro) {
            throw new ParametroNonValido('Parametro richiesto');
        }
        
        const risultato = await this._chiamataAPI(parametro);
        return risultato;
    }
}

// ❌ Evitare
function bruttaFunzione(p){
    return axios.get("url" + p).then(r=>r.data)
}
```

### Gestione Errori
```javascript
// ✅ Usa sempre le eccezioni personalizzate
import { FormatoNonValido, ErroreHTTP } from './eccezioni.js';

if (!validFormat) {
    throw new FormatoNonValido('Data deve essere YYYY-MM-DD');
}

// ✅ Gestisci gli errori HTTP
try {
    const response = await axios.get(url);
    return response.data;
} catch (error) {
    if (error.response?.status === 404) {
        throw new ParametroNonValido('Risorsa non trovata');
    }
    sollevaErroreHTTP(error.response);
}
```

### Documentazione
```javascript
/**
 * Ottiene informazioni dettagliate su un periodo specifico
 * @param {string} inizio - Data inizio formato YYYY-MM-DD
 * @param {string} fine - Data fine formato YYYY-MM-DD
 * @param {Object} [opzioni] - Opzioni aggiuntive
 * @param {boolean} [opzioni.includiDettagli=false] - Include dettagli extra
 * @returns {Promise<Object>} Dati del periodo
 * @throws {FormatoNonValido} Se le date non sono valide
 * @throws {DataFuoriGamma} Se le date sono fuori dall'anno scolastico
 * 
 * @example
 * const periodo = await utente.periodoDettagliato('2024-01-01', '2024-03-31');
 * console.log(periodo.eventi);
 */
async periodoDettagliato(inizio, fine, opzioni = {}) {
    // implementazione...
}
```

## 🐛 Segnalazione Bug

### Prima di segnalare:
1. ✅ Controlla se il bug è già stato segnalato
2. ✅ Testa con l'ultima versione
3. ✅ Verifica che non sia un problema di credenziali

### Informazioni da includere:
- **Versione Node.js**: `node --version`
- **Versione libreria**: da package.json
- **Sistema operativo**: Windows/macOS/Linux
- **Codice per riprodurre**: esempio minimo
- **Errore completo**: stack trace se disponibile

### Template Issue Bug
```markdown
## Descrizione Bug
Breve descrizione del problema...

## Riproduzione
1. Crea utente con `new Utente('S123', 'pass')`
2. Chiama `await utente.voti()`
3. Si verifica errore...

## Comportamento Atteso
Dovrebbe restituire array di voti...

## Comportamento Attuale
Genera errore: PasswordNonValida...

## Ambiente
- Node.js: v20.0.0
- classeviva-js: 1.0.0
- OS: Windows 11
```

## ✨ Feature Request

### Template Issue Feature
```markdown
## Feature Richiesta
Descrizione della funzionalità...

## Motivazione
Perché questa feature sarebbe utile...

## Implementazione Proposta
Come pensi possa essere implementata...

## Alternative Considerate
Altre soluzioni valutate...
```

## 🚀 Release Process

Solo per maintainer:

1. Aggiorna versione in `package.json`
2. Aggiorna CHANGELOG.md
3. Crea tag: `git tag v1.x.x`
4. Push: `git push origin v1.x.x`
5. GitHub Action gestirà la release

## 📞 Supporto

- **Issues GitHub**: per bug e feature request
- **Discussions**: per domande generali
- **Email**: per questioni private

## 🏆 Riconoscimenti

Tutti i contributori verranno aggiunti al README.md!

---

Grazie per aiutare a migliorare Classeviva.js! 🙏