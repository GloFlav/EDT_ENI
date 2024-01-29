import { connection } from './db_connect';
import { Salle } from './salle';

class Planification {
    static getAll(cb) {
        connection.query(`SELECT P.*, E.nom_enseignant, G.nom_groupe, N.nom_niveau, M.nom_matiere, M.total_heure, S.nom_salle 
            FROM planification P, enseignant E, groupe G, niveau N, salle S, matiere M 
            WHERE AND P.matiere_id = M.id AND M.enseignant_id = E.id AND M.niveau_id = N.id AND P.groupe_id = G.id AND G.niveau_id = N.id AND P.salle_id = S.id GROUP BY P.date`, (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static getById(id, cb) {
        connection.query('SELECT * FROM planification WHERE id = ?', [id], (err, result) => {
            if (err) throw err;
            cb(result[0]);
        })
    }

    static getInstance(inter_id, niveau_id, parcours_id, cb) {
        connection.query(`SELECT P.*, G.nom_groupe as nom_groupe, M.nom_matiere as nom_matiere, E.nom_enseignant as nom_enseignant 
        FROM planification P 
        JOIN matiere M ON P.matiere_id = M.id 
        LEFT JOIN enseignant E ON M.enseignant_id = E.id
        LEFT JOIN groupe G ON p.groupe_id = G.id
        WHERE P.inter_id = ? AND P.niveau_id = ? AND P.parcours_id = ?`, [inter_id, niveau_id, parcours_id], async (err, result1) => {
            if (err) throw err;
            if (result1.length != 0) {
                cb(await this.getPlanSalle(result1));
            } else {
                cb([]);
            }
        })
    }

    static getPlanSalle(planList) {
        return new Promise((resolve, reject) => {
            try {
                let finalResult = [];
                for (const plan of planList) {
                    let tempArr = plan.salle_id.split(",");
                    if (tempArr.length > 1) {
                        Salle.getMany(tempArr, (salles) => {
                            finalResult.push({
                                plan: plan,
                                salle: salles
                            })
                            if (planList.length === finalResult.length) {
                                resolve(finalResult)
                            }
                        })
                    } else {
                        Salle.getOne(plan.salle_id, (salle) => {
                            finalResult.push({
                                plan: plan,
                                salle: salle
                            })
                            if (planList.length === finalResult.length) {
                                resolve(finalResult)
                            }
                        })
                    }
                }
            }
            catch (e) {
                reject(e)
            }
        })
    }

    static getByMatiereAndDate(matiere_id, date, cb) {
        connection.query('SELECT * FROM planification WHERE matiere_id = ? AND date(date) = ?', [matiere_id, date], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static getByMatiereAndWeek(matiere_id, date, cb) {
        connection.query('SELECT * FROM planification WHERE matiere_id = ? AND week(date, 1) = week(?, 1)', [matiere_id, date], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static getBySemestre(semestre_id, cb) {
        connection.query(`SELECT P.*, E.nom_enseignant, G.nom_groupe, N.nom_niveau, M.nom_matiere, M.total_heure, S.nom_salle
            FROM planification P, enseignant E, groupe G, niveau N, salle S, matiere M 
            WHERE P.matiere_id = M.id AND M.semestre_id = S.id AND S.id = ? AND M.enseignant_id = E.id AND M.niveau_id = N.id AND P.groupe_id = G.id AND G.niveau_id = N.id AND P.salle_id = S.id GROUP BY P.date`, [semestre_id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static getByDate(date, cb) {
        connection.query(`SELECT P.*, E.nom_enseignant, G.nom_groupe, N.nom_niveau, M.nom_matiere, M.total_heure, S.nom_salle 
            FROM planification P, enseignant E, groupe G, niveau N, salle S, matiere M 
            WHERE date(P.date) = ? AND P.matiere_id = M.id AND M.enseignant_id = E.id AND M.niveau_id = N.id AND P.groupe_id = G.id AND G.niveau_id = N.id AND P.salle_id = S.id`, [date], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static checkEnseignant(id, matiere_id, niveau_id, inter_id, jour_id, heure_id, bool, groupe_id, cb) {
        if (bool) {
            let sql = `SELECT e.*, m.id matiere_id, m.nom_matiere nom_matiere, p.id planification_id, p.matiere_id FROM ((planification p JOIN matiere m ON p.matiere_id = m.id)
                JOIN enseignant e ON m.enseignant_id = e.id)
                WHERE p.id <> ? AND e.id = (SELECT enseignant_id FROM matiere WHERE id = ?) AND (groupe_id IS NULL OR p.groupe_id NOT IN (?))
                AND ((p.jour_id = ? AND p.heure_id = ? AND p.inter_id = ? AND NOT p.matiere_id = ?) 
                OR (p.jour_id = ? AND p.heure_id = ? AND p.inter_id = ? AND p.bool = 0 AND p.matiere_id = ?))`
            let params = [id, matiere_id, groupe_id, jour_id, heure_id, inter_id, matiere_id, jour_id, heure_id, inter_id, matiere_id]
            connection.query(sql, params, (err, result) => {
                if (err) throw err;
                cb(result);
            })
        } else {
            let sql = `SELECT e.*,m.id matiere_id, m.nom_matiere nom_matiere FROM ((planification p JOIN matiere m ON p.matiere_id = m.id)
                JOIN enseignant e ON m.enseignant_id = e.id)
                WHERE p.id <> ? AND p.jour_id = ? AND p.heure_id = ? AND p.inter_id = ? AND (groupe_id IS NULL OR p.groupe_id NOT IN (?))
                AND e.id = (SELECT enseignant_id FROM matiere WHERE id = ?)`
            let params = [id, jour_id, heure_id, inter_id, groupe_id, matiere_id]
            connection.query(sql, params, (err, result) => {
                if (err) throw err;
                cb(result);
            })
        }
    }

    static memeEnseignant(id, matiere_id, cb) {
        let sql = `SELECT e.id FROM enseignant e JOIN matiere m ON m.enseignant_id = e.id
                JOIN planification p ON p.matiere_id = m.id 
                WHERE p.id = ?`
        connection.query(sql, [id], (err, p_enseignant_id) => {
            if (err) throw err;
            connection.query(`SELECT enseignant_id id FROM matiere WHERE id = ?`, [matiere_id], (err, m_enseignant_id) => {
                if (err) throw err;
                if (p_enseignant_id[0].id == m_enseignant_id[0].id) cb(true)
                else cb(false)
            })
        })
    }

    static checkNiveau(niveau_id, parcours_id, inter_id, jour_id, heure_id, cb) {
        let sql = `SELECT n.nom_niveau, pr.nom_parcours FROM ((planification p JOIN niveau n ON p.niveau_id = n.id)
                JOIN parcours pr ON p.parcours_id = pr.id)
                WHERE niveau_id = ? AND parcours_id = ? AND inter_id = ? AND jour_id = ? AND heure_id = ?`
        let params = [niveau_id, parcours_id, inter_id, jour_id, heure_id]
        connection.query(sql, params, (err, result) => {
            if (err) throw err;
            cb(result)
        })
    }

    static add(matiere_id, niveau_id, parcours_id, inter_id, jour_id, heure_id, salle_id, bool, cb) {
        bool = bool || false;
        connection.query('INSERT INTO planification SET matiere_id = ?, niveau_id = ?, parcours_id = ?, inter_id = ?, jour_id = ?, heure_id = ?, salle_id = ?, bool = ?', [matiere_id, niveau_id, parcours_id, inter_id, jour_id, heure_id, salle_id, bool], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static addWithGroup(matiere_id, niveau_id, parcours_id, inter_id, jour_id, heure_id, groupe_id, salle_id, bool, cb) {
        bool = bool || false;
        connection.query('INSERT INTO planification SET matiere_id = ?, niveau_id = ?, parcours_id = ?, inter_id = ?, jour_id = ?, heure_id = ?, groupe_id = ?, salle_id = ?, bool = ?', [matiere_id, niveau_id, parcours_id, inter_id, jour_id, heure_id, groupe_id, salle_id, bool], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static updateInstance(id, matiere_id, salle_id, bool, cb) {
        connection.query('UPDATE planification SET matiere_id = ?, salle_id = ?, bool = ? WHERE id = ?', [matiere_id, salle_id, bool, id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static updateGroupeInstance(groupe_id, inter_id, jour_id, heure_id, matiere_id, salle_id, bool, cb) {
        connection.query('UPDATE planification SET matiere_id = ?, salle_id = ?, bool = ? WHERE inter_id = ? AND jour_id = ? AND heure_id = ? AND groupe_id = ?', [matiere_id, salle_id, bool, inter_id, jour_id, heure_id, groupe_id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static updateMatiere(id, matiere_id, cb) {
        connection.query('UPDATE planification SET matiere_id = ? WHERE id = ?', [matiere_id, id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static updateSalle(id, salle_id, cb) {
        connection.query('UPDATE planification SET salle_id = ? WHERE id = ?', [salle_id, id], (err, result) => {
            if (err) throw err;
            cb(result)
        })
    }

    static updateDate(id, jour_id, heure_id, cb) {
        connection.query('UPDATE planification SET jour_id = ?, heure_id = ? WHERE id = ?', [jour_id, heure_id, id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static removeSpecificSalle(salle_id, cb) {
        connection.query('UPDATE planification SET salle_id = REPLACE(REPLACE(salle_id, ?, ""), ",,", ",")', [salle_id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static deleteByIntervalle(inter_id, cb) {
        connection.query('DELETE FROM planification WHERE inter_id = ?', [inter_id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static deleteByHeure(heure_id, cb) {
        connection.query('DELETE FROM planification WHERE heure_id = ?', [heure_id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static deleteByNiveau(niveau_id, cb) {
        connection.query('DELETE FROM planification WHERE niveau_id = ?', [niveau_id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static deleteByParcours(parcours_id, cb) {
        connection.query('DELETE FROM planification WHERE parcours_id = ?', [parcours_id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static deleteByMatiere(matiere_id, cb) {
        connection.query('DELETE FROM planification WHERE matiere_id = ?', [matiere_id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }

    static delete(id, cb) {
        connection.query('DELETE FROM planification WHERE id IN (?)', [id], (err, result) => {
            if (err) throw err;
            cb(result);
        })
    }
}

export { Planification }