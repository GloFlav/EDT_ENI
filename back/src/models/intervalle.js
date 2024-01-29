import { connection } from './db_connect';

class Intervalle {
    static getAll(cb) {
        connection.query('SELECT * FROM intervalle ORDER BY date_fin DESC', (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static getOne(id, cb) {
        connection.query('SELECT * FROM intervalle WHERE id = ?', [id], (err, result) => {
            if(err) throw err;
            cb(result[0]);
        })
    }

    static checkDate(date_debut, date_fin, cb) {
        connection.query('SELECT COUNT(*) as count FROM intervalle WHERE (? BETWEEN date(date_debut) AND date(date_fin)) OR (? BETWEEN date(date_debut) AND date(date_fin)) OR (date(date_debut) BETWEEN ? AND ?) OR (date(date_fin) BETWEEN ? AND ?)', [date_debut, date_fin, date_debut, date_fin, date_debut, date_fin], (err, result) => {
            if(err) throw err;
            cb(result[0]);
        })
    }

    static checkDateApartOne(id, date_debut, date_fin, cb) {
        connection.query('SELECT COUNT(*) as count FROM intervalle WHERE id <> ? AND ((? BETWEEN date(date_debut) AND date(date_fin)) OR (? BETWEEN date(date_debut) AND date(date_fin)) OR (date(date_debut) BETWEEN ? AND ?) OR (date(date_fin) BETWEEN ? AND ?))', [id, date_debut, date_fin, date_debut, date_fin, date_debut, date_fin], (err, result) => {
            if(err) throw err;
            cb(result[0]);
        })
    }

    static add(date_debut, date_fin, cb) {
        connection.query('INSERT INTO intervalle SET date_debut = ?, date_fin = ?', [date_debut, date_fin], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static update(id, date_debut, date_fin, cb) {
        connection.query('UPDATE intervalle SET date_debut = ?, date_fin = ? WHERE id = ?', [date_debut, date_fin, id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static delete(id, cb) {
        connection.query('DELETE FROM intervalle WHERE id = ?', [id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }
}

export {Intervalle}