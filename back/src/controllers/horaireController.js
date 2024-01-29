import { Horaire } from '../models/horaire';

export const getAllHoraire = (req, res) => {
    try {
        Horaire.getAll((result) => {
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

export const getHoraire = (req, res) => {
    try {
        let code_jour = req.params.code_jour;
        Horaire.getOne(code_jour, (result) => {
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

export const postHoraire = (req, res) => {
    try {
        let { jour, heure_ouverture_matin, heure_cloture_matin, heure_ouverture_aprem, heure_cloture_aprem } = req.body;
        Horaire.add(jour, heure_ouverture_matin, heure_cloture_matin, heure_ouverture_aprem, heure_cloture_aprem, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'POST Horaire success'
        });
    })
} catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'POST Horaire failed'
        });
    }
}   

export const putHoraire = (req, res) => {
    try {
        let code_jour = req.params.code_jour;
        let { jour, heure_ouverture_matin, heure_cloture_matin, heure_ouverture_aprem, heure_cloture_aprem } = req.body;
        Horaire.update(code_jour, jour, heure_ouverture_matin, heure_cloture_matin, heure_ouverture_aprem, heure_cloture_aprem, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'PUT Horaire success'
            });
        })
    }   catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'PUT Horaire failed'
        });
    }
}    

export const deleteHoraire = (req, res) => {
    try {
        let code_jour = req.params.code_jour;
        Horaire.delete(code_jour, (result) => {
            res.status(200).json(result);
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}   