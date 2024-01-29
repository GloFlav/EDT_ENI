import { connection } from './db_connect';

class Niveau {
    static getAll(cb) {
        connection.query('SELECT * FROM niveau ORDER BY nom_niveau', (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static getOne(id, cb) {
        connection.query('SELECT * FROM niveau WHERE id = ?', [id], (err, result) => {
            if(err) throw err;
            cb(result[0]);
        })
    }

    static add(nom_niveau, cb) {
        connection.query('INSERT INTO niveau SET nom_niveau = ?', [nom_niveau], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static update(id, nom_niveau, cb) {
        connection.query('UPDATE niveau SET nom_niveau = ? WHERE id = ?', [nom_niveau, id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static delete(id, cb) {
        connection.query('DELETE FROM niveau WHERE id = ?', [id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }
}

export {Niveau}