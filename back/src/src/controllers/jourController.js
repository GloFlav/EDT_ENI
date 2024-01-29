import { Jour } from '../models/jour';

export const getAllJour = (req, res) => {
    try {
        Jour.getAll((result) => {
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

export const getJour = (req, res) => {
    try {
        let id = req.params.id;
        Jour.getOne(id, (result) => {
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

export const putJour = (req, res) => {
    try {
        let id = req.params.id;
        let { nom_jour } = req.body;
        Jour.update(id, nom_jour, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'PUT Jour success'
            });
        })
    }   catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'PUT Jour failed'
        });
    }
}    

export const deleteJour = (req, res) => {
    try {
        let id = req.params.id;
        Jour.delete(id, (result) => {
            res.status(200).json(result);
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}   