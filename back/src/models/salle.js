import { connection } from './db_connect';

class Salle {
    static getAll(cb) {
        connection.query('SELECT * FROM salle ORDER BY nom_salle', (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static getOne(id, cb) {
        connection.query('SELECT * FROM salle WHERE id = ?', [id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static getMany(idList, cb) {
        connection.query('SELECT * FROM salle WHERE id IN (?)', [idList], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static getNombreSalle(cb) {
        connection.query('SELECT COUNT(id) nb_total_salle FROM salle', (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static getSalleOccupe(paramId, inter_id, jour_id, heure_id, matiere_id, bool, cb) {
        bool = (bool == 'true');
        if (matiere_id && bool) {
            let queryTxt = Array.isArray(paramId) ?
                "SELECT salle_id FROM planification WHERE inter_id = ? AND jour_id = ? AND heure_id = ? AND groupe_id NOT IN (?) AND (matiere_id NOT IN (?) OR (matiere_id IN (?) AND bool = 0))" :
                "SELECT salle_id FROM planification WHERE inter_id = ? AND jour_id = ? AND heure_id = ? AND id <> ? AND (matiere_id NOT IN (?) OR (matiere_id IN (?) AND bool = 0))"
            connection.query(queryTxt,
                [inter_id, jour_id, heure_id, paramId, matiere_id, matiere_id], (err, result) => {
                    if (err) throw err;
                    cb(result)
                })
        }
        else {
            let queryTxt = Array.isArray(paramId) ?
                "SELECT salle_id FROM planification WHERE (groupe_id IS NULL OR groupe_id NOT IN (?)) AND inter_id = ? AND jour_id = ? AND heure_id = ?" :
                "SELECT salle_id FROM planification WHERE id <> ? AND inter_id = ? AND jour_id = ? AND heure_id = ?";
            connection.query(queryTxt,
                [paramId, inter_id, jour_id, heure_id, matiere_id], (err, result) => {
                    if (err) throw err;
                    cb(result)
                })
        }
    }

    static getSalleLibre(params, cb) {
        connection.query("SELECT * FROM salle WHERE id NOT IN (?) ORDER BY nom_salle", [params], (err, result) => {
            if (err) throw err;
            cb(result)
        })
    }

    static add(nom_salle, cb) {
        connection.query('INSERT INTO salle SET nom_salle = ?', [nom_salle], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static update(id, nom_salle, cb) {
        connection.query('UPDATE salle SET nom_salle = ? WHERE id = ?', [nom_salle, id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static delete(id, cb) {
        connection.query('DELETE FROM salle WHERE id = ?', [id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static addAffectation(planification_id, groupe_id, jour_id, heure_id, salle_id, cb) {
        let sql = `INSERT INTO affectation (planification_id, groupe_id, jour_id, heure_id, salle_id) VALUES(?,?,?,?,?)`
        let params = [planification_id, groupe_id, jour_id, heure_id, salle_id]
        connection.query(sql, params, (err, result) => {
            if (err) throw err;
        })
    }

    static deleteAffectationByPlanification(planification_id) {
        connection.query('DELETE FROM affectation WHERE planification_id = ?', [planification_id], (err, result) => {
            if (err) throw err;
        })
    }
}

export { Salle }