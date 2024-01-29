import { Groupe } from '../models/groupe';

export const getAllGroupe = (req, res) => {
    try {
        Groupe.getAll((result) => {
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

export const getGroupe = (req, res) => {
    try {
        let id = req.params.id;
        Groupe.getOne(id, (result) => {
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

export const getGroupeWithParam = (req, res) => {
    try {
        let { parcours_id, niveau_id } = req.query;
        Groupe.getWithParam(parcours_id, niveau_id, (result) => {
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

export const postGroupe = (req, res) => {
    try {
        let { nom_groupe, niveau_id, parcours_id } = req.body;
        Groupe.add(nom_groupe, niveau_id, parcours_id, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'POST Groupe success'
        });
    })
} catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'POST Groupe failed'
        });
    }
}   

export const putGroupe = (req, res) => {
    try {
        let id = req.params.id;
        let { nom_groupe, niveau_id, parcours_id } = req.body;
        Groupe.update(id, nom_groupe, niveau_id, parcours_id, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'PUT Groupe success'
            });
        })
    }   catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'PUT Groupe failed'
        });
    }
}    

export const deleteGroupe = (req, res) => {
    try {
        let id = req.params.id;
        Groupe.delete(id, (result) => {
            res.status(200).json(result);
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}   