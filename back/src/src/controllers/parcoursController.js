import { Groupe } from '../models/groupe';
import { Matiere } from '../models/matiere';
import { Parcours } from '../models/parcours';
import { Planification } from '../models/planification';

export const getAllParcours = (req, res) => {
    try {
        Parcours.getAll((result) => {
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

export const getParcours = (req, res) => {
    try {
        let id = req.params.id;
        Parcours.getOne(id, (result) => {
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

export const postParcours = (req, res) => {
    try {
        let { nom_parcours } = req.body;
        Parcours.add(nom_parcours, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'POST Parcours success'
        });
    })
} catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'POST Parcours failed'
        });
    }
}   

export const putParcours = (req, res) => {
    try {
        let id = req.params.id;
        let { nom_parcours } = req.body;
        Parcours.update(id, nom_parcours, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'PUT Parcours success'
            });
        })
    }   catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'PUT Parcours failed'
        });
    }
}    

export const deleteParcours = (req, res) => {
    try {
        let id = req.params.id;
        Parcours.delete(id, (result) => {
            Planification.deleteByParcours(id, () => {
                Matiere.removeSpecificParcours(id, () => {
                    Groupe.deleteByParcours(id, () => {
                        res.status(200).json(result);
                    })
                })
            })
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}   