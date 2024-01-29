import { connection } from './db_connect';

class Enseignant {
    static getAll(cb) {
        connection.query('SELECT * FROM enseignant ORDER BY nom_enseignant', (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static getOne(id, cb) {
        connection.query('SELECT * FROM enseignant WHERE id = ?', [id], (err, result) => {
            if(err) throw err;
            cb(result[0]);
        })
    }

    static add(nom_enseignant, cb) {
        connection.query('INSERT INTO enseignant SET nom_enseignant = ?', [nom_enseignant], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static update(id, nom_enseignant, cb) {
        connection.query('UPDATE enseignant SET nom_enseignant = ? WHERE id = ?', [nom_enseignant, id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static delete(idList, cb) {
        connection.query('DELETE FROM enseignant WHERE id IN (?)', [idList], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }
}

export {Enseignant}