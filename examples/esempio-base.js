/**
 * Esempio di utilizzo base della libreria Classeviva.js
 * 
 * Questo file mostra come utilizzare le funzionalità principali
 */

import { Utente, ListaUtenti, PasswordNonValida } from '../src/index.js';

// ==================== ESEMPIO SINGOLO UTENTE ====================

async function esempioSingoloUtente() {
    console.log('🔹 Esempio Singolo Utente');
    console.log('========================');
    
    // Crea un nuovo utente (NON usare credenziali reali qui!)
    const utente = new Utente('S1234567', 'password_esempio');
    
    try {
        console.log('📝 Utente creato:', utente.toString());
        console.log('🔐 Connesso?', utente.connesso);
        
        // Effettua l'accesso (questo fallirebbe con credenziali fake)
        // await utente.accedi();
        // console.log('✅ Accesso effettuato!');
        // console.log('👤 Dati utente:', utente.dati);
        
        // Esempi di chiamate API (dopo l'accesso)
        // const voti = await utente.voti();
        // const assenze = await utente.assenze();
        // const agenda = await utente.agenda();
        
        console.log('⚠️  Per testare realmente, inserisci credenziali valide');
        
    } catch (error) {
        if (error instanceof PasswordNonValida) {
            console.error('❌ Password non valida');
        } else {
            console.error('❌ Errore:', error.message);
        }
    }
}

// ==================== ESEMPIO LISTA UTENTI ====================

async function esempioListaUtenti() {
    console.log('\\n🔹 Esempio Lista Utenti');
    console.log('========================');
    
    // Crea una lista di utenti
    const utenti = [
        new Utente('S1111111', 'password1'),
        new Utente('S2222222', 'password2'),
        new Utente('S3333333', 'password3')
    ];
    
    const lista = new ListaUtenti(utenti);
    
    console.log('📋 Lista creata:', lista.toString());
    console.log('📊 Statistiche:', lista.statistiche);
    
    // Aggiungi un altro utente
    const nuovoUtente = new Utente('S4444444', 'password4');
    const aggiunto = lista.aggiungi(nuovoUtente);
    console.log('➕ Utente aggiunto:', aggiunto);
    
    // Prova ad aggiungere un duplicato
    const duplicato = lista.aggiungi(new Utente('S1111111', 'password1'));
    console.log('🔄 Duplicato respinto:', !duplicato);
    
    console.log('📊 Nuove statistiche:', lista.statistiche);
    
    // Operazioni batch (funzionerebbero solo con credenziali reali)
    // await lista.accedi(); // Accede a tutti
    // const votiTutti = await lista.votiTutti(); // Voti di tutti
}

// ==================== ESEMPIO GESTIONE ERRORI ====================

async function esempioGestioneErrori() {
    console.log('\\n🔹 Esempio Gestione Errori');
    console.log('===========================');
    
    const utente = new Utente('INVALID', 'wrong');
    
    try {
        // Questo dovrebbe fallire
        await utente.accedi();
    } catch (error) {
        console.log('✅ Errore catturato correttamente:');
        console.log('   Tipo:', error.name);
        console.log('   Messaggio:', error.message);
    }
    
    // Test validazione date
    try {
        const { validaDate } = await import('../src/index.js');
        validaDate('2024-13-45'); // Data non valida
    } catch (error) {
        console.log('✅ Validazione data fallita correttamente:', error.message);
    }
}

// ==================== ESEMPIO IMPORT DIVERSI ====================

function esempioImport() {
    console.log('\\n🔹 Esempio Import Diversi');
    console.log('==========================');
    
    console.log('📦 Named import (raccomandato):');
    console.log('   import { Utente, ListaUtenti } from "classeviva-js";');
    
    console.log('\\n📦 Default import:');
    console.log('   import Classeviva from "classeviva-js";');
    console.log('   const utente = new Classeviva.Utente("S123", "pass");');
    
    console.log('\\n📦 Import specifici:');
    console.log('   import { TokenNonValido, validaDate } from "classeviva-js";');
}

// ==================== ESECUZIONE ESEMPI ====================

async function main() {
    console.log('🚀 Classeviva.js - Esempi di Utilizzo');
    console.log('=====================================');
    
    await esempioSingoloUtente();
    await esempioListaUtenti();
    await esempioGestioneErrori();
    esempioImport();
    
    console.log('\\n✨ Esempi completati!');
    console.log('\\n💡 Per usare la libreria:');
    console.log('   1. Sostituisci le credenziali fake con quelle reali');
    console.log('   2. Gestisci sempre gli errori con try/catch');
    console.log('   3. Usa await con tutti i metodi API');
}

// Esegui esempi
main().catch(console.error);
