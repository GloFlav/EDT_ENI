import { connection } from './db_connect';
import { Parcours } from './parcours';

class Matiere {
    static getAll(cb) {
        connection.query(`SELECT M.*, N.nom_niveau, P.nom_parcours, E.nom_enseignant
        FROM matiere M 
        LEFT JOIN niveau N ON M.niveau_id = N.id
        LEFT JOIN parcours P ON FIND_IN_SET(P.id, M.parcours_id) > 0
        LEFT JOIN enseignant E ON M.enseignant_id = E.id
        GROUP BY M.id`, async (err, result) => {
            if (err) throw err;
            if (result.length != 0 ) {
                cb(await this.getInstanceParcours(result));
                
            } else {
                cb([]);
            }
        })
    }

    static getOne(id, cb) {
        connection.query('SELECT * FROM matiere WHERE id = ?', [id], (err, result) => {
            if(err) throw err;
            cb(result[0]);
        })
    }

    static getWithParam(parcours_id, niveau_id, cb) {
        connection.query(`SELECT M.*, N.nom_niveau, E.id as enseignant_id
        FROM matiere M
        JOIN niveau N ON M.niveau_id = N.id
        JOIN parcours P ON FIND_IN_SET(P.id, M.parcours_id) > 0
        LEFT JOIN enseignant E ON M.enseignant_id = E.id
        WHERE FIND_IN_SET(?, M.parcours_id) > 0 AND M.niveau_id = ? GROUP BY M.id`, 
        [parcours_id, niveau_id], 
        async (err, result) => {
            if (err) throw err;
            if (result.length != 0 ) {
                cb(await this.getInstanceParcours(result));
                
            } else {
                cb([]);
            }
        })
    }

    static getInstanceParcours(matList) {
        return new Promise((resolve, reject) => {
            try {
                let finalResult = [];
                for (const matiere of matList) {
                    let tempArr = matiere.parcours_id.split(",");
                    if (tempArr.length > 1) {
                        Parcours.getMany(tempArr, (parcours) =>  {
                            finalResult.push({
                                matiere : matiere,
                                parcours : parcours
                            })
                            if (matList.length === finalResult.length) {
                                resolve(finalResult) 
                            }
                        })
                    } else {
                        Parcours.getOne(matiere.parcours_id, (parcours) =>  {
                            finalResult.push({
                                matiere : matiere,
                                parcours : parcours
                            })
                            if (matList.length === finalResult.length) {
                                resolve(finalResult) 
                            }
                        })
                    }
                }
            }
            catch(e) {
                reject(e)
            }
        })
    }

    static getByEnseignant(enseignant_id, cb) {
        connection.query(`SELECT M.*, N.nom_niveau, P.nom_parcours, E.nom_enseignant, S.nom_semestre  
        FROM matiere M, niveau N, parcours P, enseignant E, semestre S
        WHERE E.id = ? AND M.enseignant_id = E.id AND M.parcours_id = P.id AND M.niveau_id = N.id AND M.enseignant_id = E.id AND M.semestre_id = S.id`, [enseignant_id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static getBySemestre(semestre_id, cb) {
        connection.query(`SELECT M.*, N.nom_niveau, P.nom_parcours, E.nom_enseignant, S.nom_semestre  
        FROM matiere M, niveau N, parcours P, enseignant E, semestre S
        WHERE S.id = ? AND  M.semestre_id = S.id AND M.parcours_id = P.id AND M.niveau_id = N.id AND M.enseignant_id = E.id AND M.semestre_id = S.id`, [semestre_id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static add(nom_matiere, niveau_id, parcours_id, enseignant_id, semestre_id, cb) {
        semestre_id = semestre_id !== '' ? semestre_id : null;
        connection.query('INSERT INTO matiere SET nom_matiere = ?, niveau_id = ?, parcours_id = ?, enseignant_id = ?', 
        [nom_matiere, niveau_id, parcours_id, enseignant_id], 
        (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static update(id, nom_matiere, niveau_id, parcours_id, enseignant_id, semestre_id, cb) {
        semestre_id = semestre_id !== '' ? semestre_id : null;
        connection.query('UPDATE matiere SET nom_matiere = ?, niveau_id = ?, parcours_id = ?, enseignant_id = ?, semestre_id = ? WHERE id = ?', 
        [nom_matiere, niveau_id, parcours_id, enseignant_id, semestre_id, id], 
        (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static removeSpecificParcours(parcours_id, cb) {
        connection.query('UPDATE matiere SET parcours_id = REPLACE(REPLACE(parcours_id, ?, ""), ",,", ",")', [parcours_id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static removeSpecificNiveau(niveau_id, cb) {
        connection.query('UPDATE matiere SET niveau_id = NULL WHERE niveau_id = ?', [niveau_id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static removeSpecificEnseignant(enseignant_id, cb) {
        connection.query('UPDATE matiere SET enseignant_id = NULL WHERE enseignant_id = ?', [enseignant_id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static removeSpecificSemestre(semestre_id, cb) {
        connection.query('UPDATE matiere SET semestre_id = NULL WHERE semestre_id = ?', [semestre_id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }

    static delete(id, cb) {
        connection.query('DELETE FROM matiere WHERE id = ?', [id], (err, result) => {
            if(err) throw err;
            cb(result);
        })
    }
}

export {Matiere}