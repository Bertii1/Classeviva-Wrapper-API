/**
 * Classe ListaUtenti - Gestisce liste di utenti Classeviva
 * Estende Set per operazioni batch e deduplicazione automatica
 */

import { Utente } from './Utente.js';

export class ListaUtenti extends Set {
    /**
     * Costruttore ListaUtenti
     * @param {Iterable<Utente>} utenti - Lista iniziale di utenti
     */
    constructor(utenti = []) {
        super();
        
        for (const utente of utenti) {
            if (utente instanceof Utente) {
                this.add(utente);
            }
        }
        
        this._riduci(); // Rimuove duplicati
    }

    toString() {
        return `[ListaUtenti con ${this.size} utenti]`;
    }

    /**
     * Rimuove utenti duplicati basandosi su ID e password
     * @private
     */
    _riduci() {
        const utentiCopia = [...this];
        
        for (const utente of utentiCopia) {
            const altraCopia = [...this];
            altraCopia.splice(altraCopia.indexOf(utente), 1); // Rimuove l'utente corrente
            
            for (const utentino of altraCopia) {
                if (utente._id === utentino._id && utente.password === utentino.password) {
                    this.delete(utentino);
                }
            }
        }
    }

    /**
     * Aggiunge un utente alla lista (se non duplicato)
     * @param {Utente} utente - Utente da aggiungere
     * @returns {boolean} True se aggiunto, False se duplicato
     */
    aggiungi(utente) {
        if (!(utente instanceof Utente)) {
            throw new TypeError("L'oggetto deve essere un'istanza di Utente");
        }
        
        // Controlla duplicati
        for (const u of this) {
            if (u._id === utente._id && u.password === utente.password) {
                return false; // Duplicato
            }
        }
        
        this.add(utente);
        return true;
    }

    /**
     * Esegue l'accesso per tutti gli utenti non connessi
     * @returns {Promise<void>}
     */
    async accedi() {
        const promiseAccessi = this.nonConnessi.map(utente => utente.accedi());
        await Promise.all(promiseAccessi);
    }

    /**
     * Restituisce gli utenti connessi
     * @returns {Set<Utente>} Set di utenti connessi
     */
    get connessi() {
        return new Set([...this].filter(utente => utente.connesso));
    }

    /**
     * Restituisce gli utenti non connessi
     * @returns {Set<Utente>} Set di utenti non connessi
     */
    get nonConnessi() {
        return new Set([...this].filter(utente => !utente.connesso));
    }

    /**
     * Esegue una funzione su tutti gli utenti della lista
     * @param {Function} funzione - Funzione da eseguire su ogni utente
     * @param {...any} args - Argomenti aggiuntivi per la funzione
     * @returns {Array} Array dei risultati
     */
    async applicaTutti(funzione, ...args) {
        const promises = [...this].map(async (utente) => {
            try {
                if (typeof utente[funzione] === 'function') {
                    return await utente[funzione](...args);
                } else {
                    throw new Error(`Metodo ${funzione} non trovato`);
                }
            } catch (error) {
                console.error(`Errore per utente ${utente.id}:`, error.message);
                return null;
            }
        });
        
        return await Promise.all(promises);
    }

    /**
     * Filtra utenti per una condizione
     * @param {Function} condizione - Funzione di filtro
     * @returns {ListaUtenti} Nuova ListaUtenti filtrata
     */
    filtra(condizione) {
        const utentiFiltrati = [...this].filter(condizione);
        return new ListaUtenti(utentiFiltrati);
    }

    /**
     * Trasforma ogni utente applicando una funzione
     * @param {Function} trasformatore - Funzione di trasformazione
     * @returns {Array} Array dei risultati
     */
    async mappaTutti(trasformatore) {
        const promises = [...this].map(async (utente) => {
            try {
                return await trasformatore(utente);
            } catch (error) {
                console.error(`Errore trasformazione per utente ${utente.id}:`, error.message);
                return null;
            }
        });
        
        return await Promise.all(promises);
    }

    /**
     * Ottiene i voti di tutti gli utenti
     * @returns {Promise<Array>} Array di {utente, voti}
     */
    async votiTutti() {
        return await this.mappaTutti(async (utente) => ({
            utente: utente.id,
            nome: utente.dati?.firstName || 'N/D',
            cognome: utente.dati?.lastName || 'N/D',
            voti: await utente.voti()
        }));
    }

    /**
     * Ottiene le assenze di tutti gli utenti
     * @returns {Promise<Array>} Array di {utente, assenze}
     */
    async assenzeTutti() {
        return await this.mappaTutti(async (utente) => ({
            utente: utente.id,
            nome: utente.dati?.firstName || 'N/D',
            cognome: utente.dati?.lastName || 'N/D',
            assenze: await utente.assenze()
        }));
    }

    /**
     * Converte la lista in array semplice
     * @returns {Array<Utente>} Array di utenti
     */
    toArray() {
        return [...this];
    }

    /**
     * Restituisce informazioni di riepilogo
     * @returns {Object} Oggetto con statistiche
     */
    get statistiche() {
        return {
            totale: this.size,
            connessi: this.connessi.size,
            nonConnessi: this.nonConnessi.size,
            utenti: [...this].map(u => ({
                id: u.id,
                connesso: u.connesso
            }))
        };
    }
}