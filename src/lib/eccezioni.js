/**
 * Eccezioni personalizzate per l'API Classeviva
 * Gerarchia di errori che rispecchia quella Python originale
 */

// ==================== ERRORI TOKEN ====================

export class TokenErrore extends Error {
    constructor(message) {
        super(message);
        this.name = 'TokenErrore';
    }
}

export class TokenNonValido extends TokenErrore {
    constructor(message) {
        super(message);
        this.name = 'TokenNonValido';
    }
}

export class TokenScaduto extends TokenErrore {
    constructor(message) {
        super(message);
        this.name = 'TokenScaduto';
    }
}

export class TokenNonPresente extends TokenErrore {
    constructor(message) {
        super(message);
        this.name = 'TokenNonPresente';
    }
}

// ==================== ERRORI UTENTE ====================

export class UtenteErrore extends Error {
    constructor(message) {
        super(message);
        this.name = 'UtenteErrore';
    }
}

export class PasswordNonValida extends UtenteErrore {
    constructor(message) {
        super(message);
        this.name = 'PasswordNonValida';
    }
}

// ==================== ERRORI ACCESSO ====================

export class NonAccesso extends Error {
    constructor(message) {
        super(message);
        this.name = 'NonAccesso';
    }
}

export class SenzaDati extends NonAccesso {
    constructor(message) {
        super(message);
        this.name = 'SenzaDati';
    }
}

// ==================== ERRORI HTTP ====================

export class ErroreHTTP extends Error {
    constructor(message, statusCode = null, response = null) {
        super(message);
        this.name = 'ErroreHTTP';
        this.statusCode = statusCode;
        this.response = response;
    }
}

export class ErroreHTTP404 extends ErroreHTTP {
    constructor(message, response = null) {
        super(message, 404, response);
        this.name = 'ErroreHTTP404';
    }
}

// ==================== ERRORI DATE ====================

export class DataErrore extends Error {
    constructor(message) {
        super(message);
        this.name = 'DataErrore';
    }
}

export class FormatoNonValido extends DataErrore {
    constructor(message) {
        super(message);
        this.name = 'FormatoNonValido';
    }
}

export class DataFuoriGamma extends DataErrore {
    constructor(message) {
        super(message);
        this.name = 'DataFuoriGamma';
    }
}

// ==================== ERRORI VALORI ====================

export class ValoreNonValido extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValoreNonValido';
    }
}

export class ParametroNonValido extends ValoreNonValido {
    constructor(message) {
        super(message);
        this.name = 'ParametroNonValido';
    }
}

export class CategoriaNonPresente extends ValoreNonValido {
    constructor(message) {
        super(message);
        this.name = 'CategoriaNonPresente';
    }
}

// ==================== FUNZIONI UTILITY ====================

/**
 * Solleva un errore HTTP appropriato basandosi sulla risposta
 * @param {Object} response - Oggetto response di axios
 * @throws {ErroreHTTP|ErroreHTTP404}
 */
export function sollevaErroreHTTP(response) {
    const statusCode = response?.status || response?.statusCode || 'unknown';
    const statusText = response?.statusText || '';
    const data = response?.data || response?.responseText || '';
    
    const message = `
        Richiesta non corretta
        Codice: ${statusCode}
        Status: ${statusText}
        Risposta: ${JSON.stringify(data, null, 2)}
    `.trim();

    if (statusCode === 404) {
        throw new ErroreHTTP404(message, response);
    }
    
    throw new ErroreHTTP(message, statusCode, response);
}