import { Groupe } from '../models/groupe';
import { Matiere } from '../models/matiere';
import { Niveau } from '../models/niveau';
import { Planification } from '../models/planification';

export const getAllNiveau = (req, res) => {
    try {
        Niveau.getAll((result) => {
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

export const getNiveau = (req, res) => {
    try {
        let id = req.params.id;
        Niveau.getOne(id, (result) => {
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

export const postNiveau = (req, res) => {
    try {
        let { nom_niveau } = req.body;
        Niveau.add(nom_niveau, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'POST Niveau success'
        });
    })
    } catch(err) {
            res.status(500).json({
                status: 500,
                error: err,
                message: 'POST Niveau failed'
            });
    }
}   

export const putNiveau = (req, res) => {
    try {
        let id = req.params.id;
        let { nom_niveau } = req.body;
        Niveau.update(id, nom_niveau, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'PUT Niveau success'
            });
        })
    }   catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'PUT Niveau failed'
        });
    }
}    

export const deleteNiveau = (req, res) => {
    try {
        let id = req.params.id;
        Niveau.delete(id, (result) => {
            Planification.deleteByNiveau(id, () => {
                Matiere.removeSpecificNiveau(id, () => {
                    Groupe.deleteByNiveau(id, () => {
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