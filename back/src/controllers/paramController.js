import { Param } from '../models/param';

export const getAllParam = (req, res) => {
    try {
        Param.getAll((result) => {
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

export const postParam = (req, res) => {
    try {
        let duree_seance_matiere = req.body.duree_seance_matiere;
        Param.add(duree_seance_matiere, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'POST Param success'
        });
    })
} catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'POST Param failed'
        });
    }
}   

export const putParam = (req, res) => {
    try {
        let id = req.params.id;
        let duree_seance_matiere = req.body.duree_seance_matiere;
        Param.update(id, duree_seance_matiere, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'PUT Param success'
            });
        })
    }   catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'PUT Param failed'
        });
    }
}    

export const deleteParam = (req, res) => {
    try {
        let id = req.params.id;
        Param.delete(id, (result) => {
            res.status(200).json(result);
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}   