import { Planification } from '../models/planification';
import { Salle } from '../models/salle';

export const getAllSalle = (req, res) => {
    try {
        Salle.getAll((result) => {
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

export const getSalle = (req, res) => {
    try {
        let id = req.params.id;
        Salle.getOne(id, (result) => {
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

export const postSalle = (req, res) => {
    try {
        let nom_salle = req.body.nom_salle;
        Salle.add(nom_salle, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'POST Salle success'
        });
    })
} catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'POST Salle failed'
        });
    }
}   

export const putSalle = (req, res) => {
    try {
        let id = req.params.id;
        let nom_salle = req.body.nom_salle;
        Salle.update(id, nom_salle, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'PUT Salle success'
            });
        })
    }   catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'PUT Salle failed'
        });
    }
}    

export const deleteSalle = (req, res) => {
    try {
        let id = req.params.id;
        Salle.delete(id, (result) => {
            Planification.removeSpecificSalle(id, () => {
                res.status(200).json(result);
            })
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({
            error: err
        });
    }
}   