import { Matiere } from '../models/matiere';
import { Planification } from '../models/planification';
import { Salle } from '../models/salle';

export const getAllPlanification = (req, res) => {
    try {
        Planification.getAll((result) => {
            res.status(200).json({
                data: result
            });
        })
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

export const getPlanification = (req, res) => {
    try {
        let { intervalle_id, niveau_id, parcours_id } = req.query;
        Planification.getInstance(intervalle_id, niveau_id, parcours_id, (result) => {
            res.status(200).json({
                data: result
            });
        })
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

export const postPlanification = (req, res) => {
    let { matiere_id, intervalle_id, jour_id, heure_id, niveau_id, parcours_id, salle_id, groupes, bool } = req.body;

    // 1 - verification du prof si libre
    if (groupes && groupes.length > 0) {
        groupes = groupes.filter(el => el.salle_id.length != 0);
        for (const g of groupes) {
            let matNotDispo = [];
            Planification.checkEnseignant('', g.matiere_id, niveau_id, intervalle_id, jour_id, heure_id, g.bool, groupes.map(el => el.groupe_id), (result1) => {
                if (result1.length != 0) {
                    Matiere.getOne(g.matiere_id, result2 => {
                        matNotDispo.push(result2.nom_matiere);
                        if (matNotDispo.length != 0 && groupes.indexOf(g) == groupes.length - 1) {
                            return res.send({ status: 400, error: 'Enseignants non disponible pour les matières : ' + matNotDispo.toString() })
                        }
                    });
                }
                else {
                    Planification.addWithGroup(g.matiere_id, niveau_id, parcours_id, intervalle_id, jour_id, heure_id, g.groupe_id, (g.salle_id.sort((a, b) => parseInt(a) - parseInt(b))).toString(), g.bool, () => {
                        if (matNotDispo.length == 0 && groupes.indexOf(g) == groupes.length - 1) {
                            return res.status(200).send({
                                success: 'Ajout avec succès'
                            })
                        }
                    })
                }
            })
        }
    } else {
        Planification.checkEnseignant('', matiere_id, niveau_id, intervalle_id, jour_id, heure_id, bool, '', (result1) => {
            if (result1.length != 0) return res.send({ status: 400, error: 'Enseignant non disponible' })
            Planification.add(matiere_id, niveau_id, parcours_id, intervalle_id, jour_id, heure_id, (salle_id.sort((a, b) => parseInt(a) - parseInt(b))).toString(), bool, (result3) => {
                return res.status(200).send({
                    insertId: result3.insertId,
                    success: 'Ajout avec succès'
                })
            })

        })
    }

}

export const getSalleLibre = (req, res) => {
    let { id, groupe_id, intervalle_id, jour_id, heure_id, matiere_id, bool } = req.query;
    let paramId = id !== 'undefined' ? id : (groupe_id !== 'undefined' ? groupe_id.split(',') : '');
    Salle.getSalleOccupe(paramId, intervalle_id, jour_id, heure_id, matiere_id.split(','), bool, (result1) => {
        if (result1.length !== 0) {
            let salle_occupe = []
            for (let i = 0; i < result1.length; i++) {
                salle_occupe.push(result1[i].salle_id)
                salle_occupe = salle_occupe.toString()
                salle_occupe = salle_occupe.split(",")
            }
            Salle.getSalleLibre(salle_occupe, (result2) => {
                return res.status(200).json({ data: result2 })
            })
        }
        else {
            Salle.getAll((result) => {
                return res.status(200).json({ data: result })
            })
        }
    })
}

function toInt(x) {
    return parseInt(x)
}

export const putPlanification = (req, res) => {
    let { id, matiere_id, intervalle_id, jour_id, heure_id, niveau_id, parcours_id, groupes, salle_id, bool } = req.body;

    if (groupes && groupes.length > 0) {
        groupes = groupes.filter(el => el.salle_id.length != 0);
        for (const g of groupes) {
            let matNotDispo = [];
            if (g.salle_id.length != 0) {
                Planification.checkEnseignant('', g.matiere_id, niveau_id, intervalle_id, jour_id, heure_id, g.bool, groupes.map(el => el.groupe_id), (result1) => {
                    if (result1.length != 0) {
                        Matiere.getOne(g.matiere_id, result2 => {
                            matNotDispo.push(result2.nom_matiere);
                            if (matNotDispo.length != 0 && groupes.indexOf(g) == groupes.length - 1) {
                                return res.send({ status: 400, error: 'Enseignants non disponible pour les matières : ' + matNotDispo.toString() })
                            }
                        });
                    }
                    else {
                        if (g.plan_id) {
                            Planification.updateInstance(g.plan_id, g.matiere_id, (g.salle_id.sort((a, b) => parseInt(a) - parseInt(b))).toString(), g.bool, () => {
                                if (matNotDispo.length == 0 && groupes.indexOf(g) == groupes.length - 1) {
                                    return res.status(200).send({
                                        success: 'Modification avec succès'
                                    })
                                }
                            })
                        } else {
                            Planification.addWithGroup(g.matiere_id, niveau_id, parcours_id, intervalle_id, jour_id, heure_id, g.groupe_id, (g.salle_id.sort((a, b) => parseInt(a) - parseInt(b))).toString(), g.bool, () => {
                                if (matNotDispo.length == 0 && groupes.indexOf(g) == groupes.length - 1) {
                                    return res.status(200).send({
                                        success: 'Modification avec succès'
                                    })
                                }
                            })
                        }
                    }
                })
            }
        }
    } else {
        Planification.checkEnseignant(id, matiere_id, niveau_id, intervalle_id, jour_id, heure_id, bool, '', (result1) => {
            if (result1.length) return res.send({ status: 400, error: 'Enseignant non disponible' })
            Planification.updateInstance(id, matiere_id, (salle_id.sort((a, b) => parseInt(a) - parseInt(b))).toString(), bool, (result2) => {
                return res.status(200).json({
                    insertId: result2.insertId,
                    message: 'Modification effectuée'
                })
            })
        })
    }
}

export const deletePlanification = (req, res) => {
    try {
        let id = req.params.id.split(',');
        Planification.delete(id, (result) => {
            res.status(200).json(result);
        })
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}   