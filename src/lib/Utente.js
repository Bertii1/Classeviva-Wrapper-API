/**
 * Classe Utente - Rappresenta un utente Classeviva
 * Contiene tutti i metodi per interagire con l'API
 */

import axios from 'axios';
import { Collegamenti } from './collegamenti.js';
import { intestazione, TEMPO_CONNESSIONE, validaDate, formattaDataPerAPI, dataInizioAnno, dataFineAnno, dataFineAnnoOOggi } from './variabili.js';
import { 
    PasswordNonValida, 
    TokenNonPresente, 
    TokenScaduto,
    TokenNonValido,
    SenzaDati,
    FormatoNonValido,
    DataFuoriGamma,
    ParametroNonValido,
    CategoriaNonPresente,
    sollevaErroreHTTP 
} from './eccezioni.js';

export class Utente {
    /**
     * Costruttore classe Utente
     * @param {string} id - ID utente (formato S/G + numeri)
     * @param {string} password - Password utente
     */
    constructor(id, password) {
        this.id = id;
        this._id = id.replace(/^[SG]/, ''); // Rimuove S o G dall'inizio
        this.password = password;
        this._dati = {};
        this._token = null;
        this.inizio = null;
        this.fine = null;
    }

    toString() {
        return `[Utente Classeviva ${this.id}]`;
    }

    /**
     * Verifica se l'utente è connesso localmente (senza chiamata API)
     * @returns {boolean} True se connesso
     */
    get connesso() {
        if (this.inizio) {
            const passati = (new Date() - this.inizio) / 1000;
            return passati < TEMPO_CONNESSIONE;
        }
        return false;
    }

    /**
     * Restituisce i dati essenziali dell'utente
     * @returns {Object} Dati utente (ident, firstName, lastName)
     */
    get dati() {
        if (!this._dati.ident || !this._dati.firstName || !this._dati.lastName) {
            throw new SenzaDati(`${this} non ha i dati sufficienti per questa proprietà`);
        }
        
        return {
            ident: this._dati.ident,
            firstName: this._dati.firstName,
            lastName: this._dati.lastName
        };
    }

    /**
     * Restituisce il token di autenticazione
     * @returns {string} Token
     * @throws {TokenNonPresente|TokenScaduto}
     */
    get token() {
        if (!this._token) {
            throw new TokenNonPresente("Non sei connesso");
        }
        if (!this.connesso) {
            throw new TokenScaduto("Il token è scaduto");
        }
        return this._token;
    }

    // ==================== METODI PRIVATI ====================

    /**
     * Crea headers per le richieste API con token
     * @returns {Object} Headers completi
     */
    _getIntestazione() {
        if (!this._token) {
            throw new TokenNonPresente("Token non presente");
        }
        
        return {
            ...intestazione,
            'Z-Auth-Token': this._token
        };
    }

    /**
     * Decorator pattern per auto-connessione
     * @param {Function} metodo - Metodo da decorare
     * @returns {Function} Metodo decorato
     */
    _connettente(metodo) {
        return async (...args) => {
            if (!this.connesso) {
                await this.accedi();
            }
            return await metodo.apply(this, args);
        };
    }

    // ==================== AUTENTICAZIONE ====================

    /**
     * Effettua l'accesso all'API
     * @throws {PasswordNonValida|ErroreHTTP}
     */
    async accedi() {
        if (this.connesso) return;

        const dati = {
            ident: null,
            pass: this.password,
            uid: this.id
        };

        try {
            const response = await axios.post(Collegamenti.accesso, dati, {
                headers: intestazione
            });

            if (response.status === 200) {
                this._dati = response.data;
                this.inizio = new Date(this._dati.release);
                this.fine = new Date(this._dati.expire);
                this._token = this._dati.token;
            }
        } catch (error) {
            if (error.response?.status === 422) {
                throw new PasswordNonValida(`La password di ${this} non combacia`);
            }
            sollevaErroreHTTP(error.response || error);
        }
    }

    /**
     * Verifica stato connessione con l'API
     * @returns {boolean} True se il token è ancora valido
     */
    async stato() {
        try {
            const response = await axios.get(Collegamenti.stato, {
                headers: this._getIntestazione()
            });
            return response.status === 200;
        } catch {
            return false;
        }
    }

    /**
     * Ottiene il biglietto dell'utente
     * @returns {Object} Dati completi del biglietto
     */
    async bigliettoCompleto() {
        const response = await axios.get(Collegamenti.biglietto, {
            headers: this._getIntestazione()
        });
        
        if (response.status !== 200) {
            sollevaErroreHTTP(response);
        }
        
        return response.data;
    }

    /**
     * Ottiene solo il biglietto come stringa
     * @returns {string} Biglietto
     */
    async biglietto() {
        const completo = await this.bigliettoCompleto();
        return completo.ticket;
    }

    // ==================== DOCUMENTI ====================

    /**
     * Ottiene i documenti dell'utente
     * @returns {Object} Lista documenti raggruppati per tipo
     */
    async documenti() {
        if (!this.connesso) await this.accedi();
        
        const response = await axios.post(
            Collegamenti.format(Collegamenti.documenti, this._id),
            {},
            { headers: this._getIntestazione() }
        );

        if (response.status === 200) {
            return response.data;
        }
        sollevaErroreHTTP(response);
    }

    /**
     * Controlla disponibilità di un documento
     * @param {string} documento - Hash del documento
     * @returns {boolean} True se disponibile
     */
    async controllaDocumento(documento) {
        if (!this.connesso) await this.accedi();
        
        const response = await axios.post(
            Collegamenti.format(Collegamenti.controlloDocumento, this._id, documento),
            {},
            { headers: this._getIntestazione() }
        );

        if (response.status === 200) {
            return response.data.document.available;
        }
        sollevaErroreHTTP(response);
    }

    /**
     * Ottiene le pagelle disponibili
     * @returns {Array} Lista pagelle con desc, confirmLink, viewLink
     */
    async pagelle() {
        const documenti = await this.documenti();
        
        if (!documenti.schoolReports) {
            throw new SenzaDati(`${this} non ha i dati sufficienti per questa proprietà`);
        }
        
        return documenti.schoolReports.map(documento => ({
            desc: documento.desc,
            confirmLink: documento.confirmLink,
            viewLink: documento.viewLink
        }));
    }

    // ==================== ASSENZE ====================

    /**
     * Ottiene tutte le assenze
     * @returns {Array} Lista eventi assenza
     */
    async assenze() {
        if (!this.connesso) await this.accedi();
        
        const response = await axios.get(
            Collegamenti.format(Collegamenti.assenze, this._id),
            { headers: this._getIntestazione() }
        );

        if (response.status === 200) {
            return response.data.events;
        }
        sollevaErroreHTTP(response);
    }

    /**
     * Ottiene assenze da una data specifica
     * @param {string} inizio - Data inizio (YYYY-MM-DD)
     * @returns {Array} Lista eventi assenza
     */
    async assenzeDa(inizio = null) {
        if (!inizio) return await this.assenze();
        
        validaDate(inizio);
        if (!this.connesso) await this.accedi();
        
        try {
            const response = await axios.get(
                Collegamenti.format(Collegamenti.assenzeDa, this._id, formattaDataPerAPI(inizio)),
                { headers: this._getIntestazione() }
            );

            if (response.status === 200) {
                return response.data.events;
            }
        } catch (error) {
            if (error.response?.status === 404) {
                const errore = error.response.data?.error || '';
                if (errore.startsWith('120')) {
                    throw new FormatoNonValido("Formato non valido, il parametro dev'essere YYYY-MM-DD");
                }
                if (errore.startsWith('122')) {
                    throw new DataFuoriGamma(`La data è fuori dall'anno scolastico. Inizio: ${inizio}`);
                }
            }
            sollevaErroreHTTP(error.response || error);
        }
    }

    /**
     * Ottiene assenze in un range di date
     * @param {string} inizio - Data inizio (YYYY-MM-DD)
     * @param {string} fine - Data fine (YYYY-MM-DD)
     * @returns {Array} Lista eventi assenza
     */
    async assenzeDaA(inizio = null, fine = null) {
        if (!inizio) return await this.assenze();
        if (!fine) return await this.assenzeDa(inizio);
        
        validaDate(inizio, fine);
        if (!this.connesso) await this.accedi();
        
        try {
            const response = await axios.get(
                Collegamenti.format(
                    Collegamenti.assenzeDaA, 
                    this._id, 
                    formattaDataPerAPI(inizio), 
                    formattaDataPerAPI(fine)
                ),
                { headers: this._getIntestazione() }
            );

            if (response.status === 200) {
                return response.data.events;
            }
        } catch (error) {
            if (error.response?.status === 404) {
                const errore = error.response.data?.error || '';
                if (errore.startsWith('120')) {
                    throw new FormatoNonValido("Formato non valido, il parametro dev'essere YYYY-MM-DD");
                }
                if (errore.startsWith('122')) {
                    throw new DataFuoriGamma(`
                        Una data è fuori dall'anno scolastico.
                        OPPURE la data di inizio è successiva a quella di fine.
                        Inizio: ${inizio}, Fine: ${fine}
                    `.trim());
                }
            }
            sollevaErroreHTTP(error.response || error);
        }
    }

    // ==================== AGENDA ====================

    /**
     * Ottiene tutti gli eventi dell'agenda dell'anno scolastico
     * @returns {Array} Lista eventi agenda
     */
    async agenda() {
        if (!this.connesso) await this.accedi();
        
        const response = await axios.get(
            Collegamenti.format(
                Collegamenti.agendaDaA,
                this._id,
                dataInizioAnno(),
                dataFineAnno()
            ),
            { headers: this._getIntestazione() }
        );

        if (response.status === 200) {
            return response.data.agenda;
        }
        sollevaErroreHTTP(response);
    }

    /**
     * Ottiene eventi agenda in un range di date
     * @param {string} inizio - Data inizio (YYYY-MM-DD)
     * @param {string} fine - Data fine (YYYY-MM-DD)
     * @returns {Array} Lista eventi agenda
     */
    async agendaDaA(inizio = null, fine = null) {
        if (!inizio || !fine) return await this.agenda();
        
        validaDate(inizio, fine);
        if (!this.connesso) await this.accedi();
        
        try {
            const response = await axios.get(
                Collegamenti.format(
                    Collegamenti.agendaDaA,
                    this._id,
                    formattaDataPerAPI(inizio),
                    formattaDataPerAPI(fine)
                ),
                { headers: this._getIntestazione() }
            );

            if (response.status === 200) {
                return response.data.agenda;
            }
        } catch (error) {
            if (error.response?.status === 404) {
                const errore = error.response.data?.error || '';
                if (errore.startsWith('120')) {
                    throw new FormatoNonValido("Formato non valido, il parametro dev'essere YYYY-MM-DD");
                }
                if (errore.startsWith('122')) {
                    throw new DataFuoriGamma(`
                        Una data è fuori dall'anno scolastico.
                        OPPURE la data di inizio è successiva a quella di fine.
                        Inizio: ${inizio}, Fine: ${fine}
                    `.trim());
                }
            }
            sollevaErroreHTTP(error.response || error);
        }
    }

    // ==================== VOTI E MATERIE ====================

    /**
     * Ottiene tutti i voti
     * @returns {Array} Lista voti
     */
    async voti() {
        if (!this.connesso) await this.accedi();
        
        const response = await axios.get(
            Collegamenti.format(Collegamenti.voti, this._id),
            { headers: this._getIntestazione() }
        );

        if (response.status === 200) {
            return response.data.grades;
        }
        sollevaErroreHTTP(response);
    }

    /**
     * Ottiene tutte le materie
     * @returns {Array} Lista materie con insegnanti
     */
    async materie() {
        if (!this.connesso) await this.accedi();
        
        const response = await axios.get(
            Collegamenti.format(Collegamenti.materie, this._id),
            { headers: this._getIntestazione() }
        );

        if (response.status === 200) {
            return response.data.subjects;
        }
        sollevaErroreHTTP(response);
    }

    /**
     * Ottiene i periodi scolastici
     * @returns {Array} Lista periodi
     */
    async periodi() {
        if (!this.connesso) await this.accedi();
        
        const response = await axios.get(
            Collegamenti.format(Collegamenti.periodi, this._id),
            { headers: this._getIntestazione() }
        );

        if (response.status === 200) {
            return response.data.periods;
        }
        sollevaErroreHTTP(response);
    }

    // ==================== NOTE ====================

    /**
     * Ottiene tutte le note
     * @returns {Object} Note raggruppate per tipo
     */
    async note() {
        if (!this.connesso) await this.accedi();
        
        const response = await axios.get(
            Collegamenti.format(Collegamenti.note, this._id),
            { headers: this._getIntestazione() }
        );

        if (response.status === 200) {
            return response.data;
        }
        sollevaErroreHTTP(response);
    }

    /**
     * Legge il contenuto di una nota specifica
     * @param {string} tipo - Tipo nota (NTTE, NTCL, NTWN, NTST)
     * @param {number} id - ID della nota
     * @returns {string} Testo della nota
     */
    async leggiNota(tipo, id) {
        if (!this.connesso) await this.accedi();
        
        try {
            const response = await axios.post(
                Collegamenti.format(Collegamenti.leggiNota, this._id, tipo, id),
                {},
                { headers: this._getIntestazione() }
            );

            if (response.status === 200) {
                return response.data.event.evtText;
            }
        } catch (error) {
            if (error.response?.status === 404) {
                const errore = error.response.data?.error || '';
                if (errore.startsWith('130')) {
                    throw new ParametroNonValido(`Nota con ID ${id} non trovata`);
                }
                if (errore.startsWith('102')) {
                    throw new CategoriaNonPresente(`Categoria di nota ${tipo} non trovata`);
                }
            }
            sollevaErroreHTTP(error.response || error);
        }
    }

    // ==================== BACHECA ====================

    /**
     * Ottiene la bacheca (noticeboard)
     * @returns {Array} Lista elementi bacheca
     */
    async bacheca() {
        if (!this.connesso) await this.accedi();
        
        const response = await axios.get(
            Collegamenti.format(Collegamenti.bacheca, this._id),
            { headers: this._getIntestazione() }
        );

        if (response.status === 200) {
            return response.data.items;
        }
        sollevaErroreHTTP(response);
    }

    /**
     * Legge un elemento specifico della bacheca
     * @param {string} codice - Codice evento
     * @param {number} id - ID pubblicazione
     * @returns {Object} Contenuto completo
     */
    async bachecaLeggi(codice, id) {
        if (!this.connesso) await this.accedi();
        
        const response = await axios.post(
            Collegamenti.format(Collegamenti.bachecaLeggi, this._id, codice, id),
            {},
            { headers: this._getIntestazione() }
        );

        if (response.status === 200) {
            return response.data;
        }
        sollevaErroreHTTP(response);
    }

    // ==================== LEZIONI ====================

    /**
     * Ottiene le lezioni di oggi
     * @returns {Array} Lista lezioni
     */
    async lezioni() {
        if (!this.connesso) await this.accedi();
        
        const response = await axios.get(
            Collegamenti.format(Collegamenti.lezioni, this._id),
            { headers: this._getIntestazione() }
        );

        if (response.status === 200) {
            return response.data.lessons;
        }
        sollevaErroreHTTP(response);
    }

    /**
     * Ottiene lezioni di un giorno specifico
     * @param {string} giorno - Data (YYYY-MM-DD)
     * @returns {Array} Lista lezioni
     */
    async lezioniGiorno(giorno = null) {
        if (!giorno) return await this.lezioni();
        
        validaDate(giorno);
        if (!this.connesso) await this.accedi();
        
        const response = await axios.get(
            Collegamenti.format(Collegamenti.lezioniGiorno, this._id, formattaDataPerAPI(giorno)),
            { headers: this._getIntestazione() }
        );

        if (response.status === 200) {
            return response.data.lessons;
        }
        sollevaErroreHTTP(response);
    }

    // ==================== PANORAMICA ====================

    /**
     * Ottiene panoramica completa in un range di date
     * @param {string} inizio - Data inizio (YYYY-MM-DD)
     * @param {string} fine - Data fine (YYYY-MM-DD)
     * @returns {Object} Panoramica con agenda, voti, note, etc.
     */
    async panoramicaDaA(inizio = null, fine = null) {
        if (!inizio || !fine) {
            if (!inizio && !fine) {
                inizio = dataInizioAnno().slice(0, 4) + '-09-01';
                fine = dataFineAnno().slice(0, 4) + '-06-30';
            } else if (!inizio) {
                inizio = dataInizioAnno().slice(0, 4) + '-09-01';
            } else if (!fine) {
                fine = dataFineAnno().slice(0, 4) + '-06-30';
            }
        }
        
        validaDate(inizio, fine);
        if (!this.connesso) await this.accedi();
        
        const response = await axios.get(
            Collegamenti.format(
                Collegamenti.panoramicaDaA,
                this._id,
                formattaDataPerAPI(inizio),
                formattaDataPerAPI(fine)
            ),
            { headers: this._getIntestazione() }
        );

        if (response.status === 200) {
            return response.data;
        }
        sollevaErroreHTTP(response);
    }

    // ==================== ALTRI METODI ====================

    /**
     * Ottiene l'avatar dell'utente
     * @returns {Buffer} Immagine avatar
     */
    async avatar() {
        if (!this.connesso) await this.accedi();
        
        try {
            const response = await axios.get(
                Collegamenti.format(Collegamenti.avatar, this._id),
                { 
                    headers: this._getIntestazione(),
                    responseType: 'arraybuffer'
                }
            );

            if (response.status === 200) {
                return Buffer.from(response.data);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                const errore = error.response.data?.error || '';
                if (errore.startsWith('252')) {
                    throw new TokenNonValido("Token non valido");
                }
            }
            sollevaErroreHTTP(error.response || error);
        }
    }

    /**
     * Ottiene informazioni sulla carta dello studente
     * @returns {Object} Dati carta studente
     */
    async carta() {
        if (!this.connesso) await this.accedi();
        
        const response = await axios.get(
            Collegamenti.format(Collegamenti.carta, this._id),
            { headers: this._getIntestazione() }
        );

        if (response.status === 200) {
            return response.data.card;
        }
        sollevaErroreHTTP(response);
    }

    /**
     * Ottiene i libri di testo
     * @returns {Object} Informazioni sui libri
     */
    async libri() {
        if (!this.connesso) await this.accedi();
        
        const response = await axios.get(
            Collegamenti.format(Collegamenti.libri, this._id),
            { headers: this._getIntestazione() }
        );

        if (response.status === 200) {
            return response.data.schoolbooks[0];
        }
        sollevaErroreHTTP(response);
    }
}
