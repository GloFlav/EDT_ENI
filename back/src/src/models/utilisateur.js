import { connection } from './db_connect';

class Utilisateur {
    static getAll(cb) {
        connection.query('SELECT * FROM utilisateur', (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static getOne(id, cb) {
        connection.query('SELECT * FROM utilisateur WHERE id = ?', [id], (err, result) => {
            if(err) throw err;
            cb(result[0]);
        })
    }

    static getOneByUsername(username, cb) {
        connection.query('SELECT * FROM utilisateur WHERE username = ?', [username], (err, result) => {
            if(err) throw err;
            cb(result[0]);
        })
    }

    static add(username, password, admin, cb) {
        connection.query('INSERT INTO utilisateur SET username = ?, password = ?, admin = ?', [username, password, admin], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static update(id, username, password, admin, cb) {
        connection.query('UPDATE utilisateur SET username = ?, password = ?, admin = ?', [username, password, admin, id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static delete(id, cb) {
        connection.query('DELETE FROM utilisateur WHERE id = ?', [id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }
}

export {Utilisateur}