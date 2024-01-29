import { connection } from './db_connect';

class Jour {
    static getAll(cb) {
        connection.query('SELECT * FROM jour', (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }
    
    static getOne(id, cb) {
        connection.query('SELECT * FROM jour WHERE id = ?', [id], (err, result) => {
            if (err) throw err;
            cb(result[0]);
        })
    }
    
    static add(nom_jour, cb) {
        connection.query('INSERT INTO jour SET nom_jour = ?', [nom_jour], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }
    
    static update(id, nom_jour, cb) {
        connection.query('UPDATE jour SET nom_jour = ? WHERE id = ?', [nom_jour, id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }
    
    static delete(id, cb) {
        connection.query('DELETE FROM jour WHERE id = ?', [id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }
}

export { Jour }