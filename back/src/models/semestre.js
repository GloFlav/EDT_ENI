import { connection } from './db_connect';

class Semestre {
    static getAll(cb) {
        connection.query('SELECT * FROM semestre ORDER BY date_fin DESC', (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static getOne(id, cb) {
        connection.query('SELECT * FROM semestre WHERE id = ?', [id], (err, result) => {
            if(err) throw err;
            cb(result[0]);
        })
    }

    static add(nom_semestre, date_debut, date_fin, cb) {
        connection.query('INSERT INTO semestre SET nom_semestre = ?, date_debut = ?, date_fin = ?', [nom_semestre, date_debut, date_fin], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static update(id, nom_semestre, date_debut, date_fin, cb) {
        connection.query('UPDATE semestre SET nom_semestre = ?, date_debut = ?, date_fin = ? WHERE id = ?', [nom_semestre, date_debut, date_fin, id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static delete(id, cb) {
        connection.query('DELETE FROM semestre WHERE id = ?', [id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }
}

export {Semestre}