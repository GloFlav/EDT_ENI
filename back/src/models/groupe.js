import { connection } from './db_connect';

class Groupe {
    static getAll(cb) {
        connection.query('SELECT G.*, P.id parcours_id, P.nom_parcours, N.id niveau_id, N.nom_niveau FROM groupe G, parcours P, niveau N WHERE G.parcours_id = P.id AND G.niveau_id = N.id ORDER BY nom_groupe', (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }
    
    static getOne(id, cb) {
        connection.query('SELECT * FROM groupe WHERE id = ?', [id], (err, result) => {
            if (err) throw err;
            cb(result[0]);
        })
    }
    
    static getWithParam(parcours_id, niveau_id, cb) {
        connection.query('SELECT * FROM groupe WHERE parcours_id = ? AND niveau_id = ?', [parcours_id, niveau_id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static add(nom_groupe, niveau_id, parcours_id, cb) {
        connection.query('INSERT INTO groupe SET nom_groupe = ?, niveau_id = ?, parcours_id = ?', [nom_groupe, niveau_id, parcours_id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }
    
    static update(id, nom_groupe, niveau_id, parcours_id, cb) {
        connection.query('UPDATE groupe SET nom_groupe = ?, niveau_id = ?, parcours_id = ? WHERE id = ?', [nom_groupe, niveau_id, parcours_id, id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }
    
    static deleteByParcours(parcours_id, cb) {
        connection.query('DELETE FROM groupe WHERE parcours_id = ?', [parcours_id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static deleteByNiveau(niveau_id, cb) {
        connection.query('DELETE FROM groupe WHERE niveau_id = ?', [niveau_id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static delete(id, cb) {
        connection.query('DELETE FROM groupe WHERE id = ?', [id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }
}

export { Groupe }