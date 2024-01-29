import { connection } from './db_connect';

class Param {
    static getAll(cb) {
        connection.query('SELECT * FROM param LIMIT 1', (err, result) => {
            if(err) throw err;
            cb(result[0]);
        })
    }

    static add(duree_seance_matiere, cb) {
        connection.query('INSERT INTO param SET duree_seance_matiere = ?', [duree_seance_matiere], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static update(id, duree_seance_matiere, cb) {
        connection.query('UPDATE duree_seance_matiere SET duree_seance_matiere = ? WHERE id = ?', [duree_seance_matiere, id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static delete(id, cb) {
        connection.query('DELETE FROM param WHERE id = ?', [id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }
}

export {Param}