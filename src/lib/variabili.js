/**
 * Variabili e costanti per l'API Classeviva
 * Include headers, costanti di tempo e funzioni di validazione
 */

import { FormatoNonValido } from './eccezioni.js';

// ==================== COSTANTI ====================

/**
 * Tempo di connessione per una sessione in secondi
 * @type {number}
 */
export const TEMPO_CONNESSIONE = 5400;

/**
 * Headers standard per le richieste API
 * @type {Object}
 */
export const intestazione = {
    'content-type': 'application/json',
    'Z-Dev-ApiKey': 'Tg1NWEwNGIgIC0K',
    'User-Agent': 'CVVS/std/4.2.3 Android/12'
};

// ==================== FUNZIONI UTILITY DATE ====================

/**
 * Valida il formato delle date (YYYY-MM-DD)
 * @param {...string} date - Date da validare
 * @throws {FormatoNonValido} Se il formato non è valido
 */
export function validaDate(...date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    
    for (const data of date) {
        if (!dateRegex.test(data)) {
            throw new FormatoNonValido("Formato data non valido, dev'essere YYYY-MM-DD");
        }
        
        // Verifica che sia una data valida
        const dateObj = new Date(data);
        const [year, month, day] = data.split('-').map(Number);
        
        if (dateObj.getFullYear() !== year || 
            dateObj.getMonth() + 1 !== month || 
            dateObj.getDate() !== day) {
            throw new FormatoNonValido("Data non valida: " + data);
        }
    }
}

/**
 * Restituisce l'anno corrente
 * @returns {number} Anno corrente
 */
export function anno() {
    return new Date().getFullYear();
}

/**
 * Restituisce l'anno di inizio dell'anno scolastico corrente.
 * Se siamo tra settembre e dicembre, è l'anno corrente.
 * Se siamo tra gennaio e agosto, è l'anno precedente.
 * @returns {number} Anno di inizio a.s.
 */
export function annoScolasticoInizio() {
    const oggi = new Date();
    const mese = oggi.getMonth() + 1; // 1-12
    // Se siamo da gennaio ad agosto, l'a.s. è iniziato l'anno prima
    if (mese < 9) {
        return anno() - 1;
    }
    return anno();
}

/**
 * Restituisce la data di inizio dell'anno scolastico (1 settembre)
 * @returns {string} Data in formato YYYYMMDD
 */
export function dataInizioAnno() {
    return `${annoScolasticoInizio()}0901`;
}

/**
 * Restituisce la data di fine dell'anno scolastico (30 giugno dell'anno successivo)
 * @returns {string} Data in formato YYYYMMDD  
 */
export function dataFineAnno() {
    return `${annoScolasticoInizio() + 1}0630`;
}

/**
 * Restituisce la data di fine anno scolastico o quella corrente se anteriore
 * @returns {string} Data in formato YYYYMMDD
 */
export function dataFineAnnoOOggi() {
    const oggi = new Date();
    const fineAnno = new Date(anno(), 5, 30); // 30 giugno (mese 5 = giugno)
    
    if (oggi < fineAnno) {
        const mese = String(oggi.getMonth() + 1).padStart(2, '0');
        const giorno = String(oggi.getDate()).padStart(2, '0');
        return `${anno()}${mese}${giorno}`;
    }
    
    return dataFineAnno();
}

/**
 * Converte una data dal formato YYYY-MM-DD a YYYYMMDD
 * @param {string} data - Data in formato YYYY-MM-DD
 * @returns {string} Data in formato YYYYMMDD
 */
export function formattaDataPerAPI(data) {
    return data.replace(/-/g, '');
}

/**
 * Converte una data dal formato YYYYMMDD a YYYY-MM-DD
 * @param {string} data - Data in formato YYYYMMDD
 * @returns {string} Data in formato YYYY-MM-DD
 */
export function formattaDataDaAPI(data) {
    if (data.length !== 8) {
        throw new FormatoNonValido("Data API deve essere in formato YYYYMMDD");
    }
    
    return `${data.slice(0, 4)}-${data.slice(4, 6)}-${data.slice(6, 8)}`;
}