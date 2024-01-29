import { connection } from './db_connect';

class Heure {
    static getAll(cb) {
        connection.query('SELECT * FROM heure ORDER BY fin ASC', (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }
    
    static getOne(id, cb) {
        connection.query('SELECT * FROM heure WHERE id = ?', [id], (err, result) => {
            if (err) throw err;
            cb(result[0]);
        })
    }
    
    static check(debut, fin, cb) {
        connection.query('SELECT COUNT(*) as count FROM heure WHERE (? > debut AND ? < fin) OR (? > debut AND ? < fin) OR (debut > ? AND debut < ?) OR (fin > ? AND fin < ?)', [debut, debut, fin, fin, debut, fin, debut, fin], (err, result) => {
            if (err) throw err;
            cb(result[0]);
        })
    }

    static checkApartOne(id, debut, fin, cb) {
        connection.query('SELECT COUNT(*) as count FROM heure WHERE id <> ? AND ((? > debut AND ? < fin) OR (? > debut AND ? < fin) OR (debut > ? AND debut < ?) OR (fin > ? AND fin < ?))', [id, debut, debut, fin, fin, debut, fin, debut, fin], (err, result) => {
            if (err) throw err;
            cb(result[0]);
        })
    }

    static add(debut, fin, cb) {
        connection.query('INSERT INTO heure SET debut = ?, fin = ?', [debut, fin], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }
    
    static update(id, debut, fin, cb) {
        connection.query('UPDATE heure SET debut = ?, fin = ? WHERE id = ?', [debut, fin, id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }
    
    static delete(id, cb) {
        connection.query('DELETE FROM heure WHERE id = ?', [id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }
}

export { Heure }