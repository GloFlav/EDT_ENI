import { Enseignant } from '../models/enseignant';
import { Matiere } from '../models/matiere';

export const getAllEnseignant = (req, res) => {
    try {
        Enseignant.getAll((result) => {
            res.status(200).json({
                data : result
            });
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({
            error: err
        });
    }
}

export const getEnseignant = (req, res) => {
    try {
        let id = req.params.id;
        Enseignant.getOne(id, (result) => {
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

export const postEnseignant = (req, res) => {
    try {
        let nom_enseignant = req.body.nom_enseignant;
        Enseignant.add(nom_enseignant, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'POST Enseignant success'
        });
    })
} catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'POST Enseignant failed'
        });
    }
}   

export const putEnseignant = (req, res) => {
    try {
        let id = req.params.id;
        let nom_enseignant = req.body.nom_enseignant;
        Enseignant.update(id, nom_enseignant, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'PUT Enseignant success'
            });
        })
    }   catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'PUT Enseignant failed'
        });
    }
}    

export const deleteEnseignant = (req, res) => {
    try {
        let id = req.params.id;
        Enseignant.delete(id, (result) => {
            Matiere.removeSpecificEnseignant(id, () => {
                res.status(200).json(result);
            })
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}   