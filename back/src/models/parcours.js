import { connection } from './db_connect';

class Parcours {
    static getAll(cb) {
        connection.query('SELECT * FROM parcours ORDER BY nom_parcours', (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static getOne(id, cb) {
        connection.query('SELECT * FROM parcours WHERE id = ?', [id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static getMany(idList, cb) {
        connection.query('SELECT * FROM parcours WHERE id IN (?)', [idList], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static add(nom_parcours, cb) {
        connection.query('INSERT INTO parcours SET nom_parcours = ?', [nom_parcours], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static update(id, nom_parcours, cb) {
        connection.query('UPDATE parcours SET nom_parcours = ? WHERE id = ?', [nom_parcours, id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static delete(id, cb) {
        connection.query('DELETE FROM parcours WHERE id = ?', [id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }
}

export {Parcours}