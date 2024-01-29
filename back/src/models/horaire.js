import { connection } from './db_connect';

class Horaire {
    static getAll(cb) {
        connection.query('SELECT * FROM horaire', (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static getOne(code_jour, cb) {
        connection.query('SELECT * FROM horaire WHERE code_jour = ?', [code_jour], (err, result) => {
            if(err) throw err;
            cb(result[0]);
        })
    }

    static add(jour, heure_ouverture_matin, heure_cloture_matin, heure_ouverture_aprem,	heure_cloture_aprem, cb) {
        connection.query('INSERT INTO horaire SET jour = ?, heure_ouverture_matin = ?, heure_cloture_matin = ?, heure_ouverture_aprem = ?, heure_cloture_aprem = ?', [jour, heure_ouverture_matin, heure_cloture_matin, heure_ouverture_aprem,	heure_cloture_aprem], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static update(code_jour, jour, heure_ouverture_matin, heure_cloture_matin, heure_ouverture_aprem, heure_cloture_aprem, cb) {
        connection.query('UPDATE horaire SET jour = ?, heure_ouverture_matin = ?, heure_cloture_matin = ?, heure_ouverture_aprem = ?, heure_cloture_aprem = ? WHERE code_jour = ?', [jour, heure_ouverture_matin, heure_cloture_matin, heure_ouverture_aprem, heure_cloture_aprem, code_jour], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static delete(code_jour, cb) {
        connection.query('DELETE FROM horaire WHERE code_jour = ?', [code_jour], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }
}

export {Horaire}