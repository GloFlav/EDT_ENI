import { Matiere } from '../models/matiere';
import { Planification } from '../models/planification';

export const getAllMatiere = (req, res) => {
    try {
        Matiere.getAll((result) => {
            res.status(200).json({
                data : result
            });
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}

export const getMatiere = (req, res) => {
    try {
        let id = req.params.id;
        Matiere.getOne(id, (result) => {
            res.status(200).json({
                data : result[0]
            });
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}

export const getMatiereWithParam = (req, res) => {
    try {
        let { parcours_id, niveau_id } = req.query;
        Matiere.getWithParam(parcours_id, niveau_id, (result) => {
        res.status(200).json({
                data : result
            });
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}

export const postMatiere = (req, res) => {
    try {
        let { nom_matiere, niveau_id, parcours_id, enseignant_id, semestre_id } = req.body;
        Matiere.add(nom_matiere, niveau_id, (parcours_id.sort((a, b) => parseInt(a) - parseInt(b))).toString(), enseignant_id, semestre_id, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'POST Matiere success'
        });
    })
} catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'POST Matiere failed'
        });
    }
}   

export const putMatiere = (req, res) => {
    try {
        let id = req.params.id;
        let { nom_matiere, niveau_id, parcours_id, enseignant_id, semestre_id } = req.body;
        Matiere.update(id, nom_matiere, niveau_id, (parcours_id.sort((a, b) => parseInt(a) - parseInt(b))).toString().toString(), enseignant_id, semestre_id, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'PUT Matiere success'
            });
        })
    }   catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'PUT Matiere failed'
        });
    }
}    

export const deleteMatiere = (req, res) => {
    try {
        let id = req.params.id;
        Matiere.delete(id, (result) => {
            Planification.deleteByMatiere(id, () => {
                res.status(200).json(result);
            })
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}   