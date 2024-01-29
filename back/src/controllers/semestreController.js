import { Matiere } from '../models/matiere';
import { Semestre } from '../models/semestre';

export const getAllSemestre = (req, res) => {
    try {
        Semestre.getAll((result) => {
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

export const getSemestre = (req, res) => {
    try {
        let id = req.params.id;
        Semestre.getOne(id, (result) => {
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

export const postSemestre = (req, res) => {
    try {
        let { nom_semestre, date_debut, date_fin } = req.body;
        Semestre.add(nom_semestre, date_debut, date_fin, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'POST Semestre success'
        });
    })
} catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'POST Semestre failed'
        });
    }
}   

export const putSemestre = (req, res) => {
    try {
        let id = req.params.id;
        let { nom_semestre, date_debut, date_fin } = req.body;
        Semestre.update(id, nom_semestre, date_debut, date_fin, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'PUT Semestre success'
            });
        })
    }   catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'PUT Semestre failed'
        });
    }
}    

export const deleteSemestre = (req, res) => {
    try {
        let id = req.params.id;
        Semestre.delete(id, (result) => {
            Matiere.removeSpecificSemestre(id, () => {
                res.status(200).json(result);
            })
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}   