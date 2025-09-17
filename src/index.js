/**
 * Classeviva.js - Wrapper JavaScript per l'API Classeviva
 * 
 * Libreria per interagire con il registro elettronico Classeviva di Spaggiari
 * Conversione JavaScript della libreria Python originale
 * 
 * @author Filippo Berti
 * @version 1.0.0
 */

// Esporta tutte le classi principali
export { Utente } from './lib/Utente.js';
export { ListaUtenti } from './lib/ListaUtenti.js';
export { Collegamenti } from './lib/collegamenti.js';

// Esporta tutte le eccezioni
export {
    TokenErrore,
    TokenNonValido,
    TokenScaduto,
    TokenNonPresente,
    UtenteErrore,
    PasswordNonValida,
    NonAccesso,
    SenzaDati,
    ErroreHTTP,
    ErroreHTTP404,
    DataErrore,
    FormatoNonValido,
    DataFuoriGamma,
    ValoreNonValido,
    ParametroNonValido,
    CategoriaNonPresente,
    sollevaErroreHTTP
} from './lib/eccezioni.js';

// Esporta utility e costanti
export {
    TEMPO_CONNESSIONE,
    intestazione,
    validaDate,
    anno,
    dataInizioAnno,
    dataFineAnno,
    dataFineAnnoOOggi,
    formattaDataPerAPI,
    formattaDataDaAPI
} from './lib/variabili.js';

// Export default per compatibilità
import { Utente } from './lib/Utente.js';
import { ListaUtenti } from './lib/ListaUtenti.js';

export default {
    Utente,
    ListaUtenti
};