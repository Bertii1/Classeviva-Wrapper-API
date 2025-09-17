/**
 * Collegamenti (Endpoints) per l'API di Classeviva
 * Contiene tutti gli URL per le richieste API
 */

const BASE_URL = 'https://web.spaggiari.eu/rest';

export class Collegamenti {
    static base = BASE_URL;
    
    // Autenticazione
    static accesso = `${BASE_URL}/v1/auth/login`;
    static stato = `${BASE_URL}/v1/auth/status`;
    static biglietto = `${BASE_URL}/v1/auth/ticket`;
    
    // Documenti
    static documenti = `${BASE_URL}/v1/students/{}/documents`;
    static controlloDocumento = `${BASE_URL}/v1/students/{}/documents/check/{}`;
    static leggiDocumento = `${BASE_URL}/v1/students/{}/documents/read/{}`;
    
    // Assenze
    static assenze = `${BASE_URL}/v1/students/{}/absences/details`;
    static assenzeDa = `${BASE_URL}/v1/students/{}/absences/details/{}`;
    static assenzeDaA = `${BASE_URL}/v1/students/{}/absences/details/{}/{}`;
    
    // Agenda
    static agendaDaA = `${BASE_URL}/v1/students/{}/agenda/all/{}/{}`;
    static agendaCodiceDaA = `${BASE_URL}/v1/students/{}/agenda/{}/{}/{}`;
    
    // Didattica
    static didattica = `${BASE_URL}/v1/students/{}/didactics`;
    static didatticaElemento = `${BASE_URL}/v1/students/{}/didactics/item/{}`;
    
    // Bacheca (Noticeboard)
    static bacheca = `${BASE_URL}/v1/students/{}/noticeboard`;
    static bachecaLeggi = `${BASE_URL}/v1/students/{}/noticeboard/read/{}/{}/101`;
    static bachecaAllega = `${BASE_URL}/v1/students/{}/noticeboard/attach/{}/{}/101`;
    static bachecaAllegaEsterno = 'https://web.spaggiari.eu/sif/app/default/bacheca_personale.php?action=file_download&com_id={}';
    
    // Lezioni
    static lezioni = `${BASE_URL}/v1/students/{}/lessons/today`;
    static lezioniGiorno = `${BASE_URL}/v1/students/{}/lessons/{}`;
    static lezioniDaA = `${BASE_URL}/v1/students/{}/lessons/{}/{}`;
    static lezioniDaAMateria = `${BASE_URL}/v1/students/{}/lessons/{}/{}/{}`;
    
    // Calendario
    static calendario = `${BASE_URL}/v1/students/{}/calendar/all`;
    static calendarioDaA = `${BASE_URL}/v1/students/{}/calendar/{}/{}`;
    
    // Altri endpoint
    static libri = `${BASE_URL}/v1/students/{}/schoolbooks`;
    static carta = `${BASE_URL}/v1/students/{}/card`;
    static voti = `${BASE_URL}/v1/students/{}/grades`;
    static periodi = `${BASE_URL}/v1/students/{}/periods`;
    static materie = `${BASE_URL}/v1/students/{}/subjects`;
    static note = `${BASE_URL}/v1/students/{}/notes/all`;
    static leggiNota = `${BASE_URL}/v1/students/{}/notes/{}/read/{}`;
    static panoramicaDaA = `${BASE_URL}/v1/students/{}/overview/all/{}/{}`;
    static avatar = `${BASE_URL}/v1/users/{}/avatar`;

    /**
     * Utility per formattare gli URL con parametri
     * @param {string} template - Template URL con {}
     * @param {...any} params - Parametri da sostituire
     * @returns {string} URL formattato
     */
    static format(template, ...params) {
        let result = template;
        params.forEach(param => {
            result = result.replace('{}', param);
        });
        return result;
    }
}