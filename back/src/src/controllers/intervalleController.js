import { Intervalle } from '../models/intervalle';
import { Planification } from '../models/planification';

export const getAllIntervalle = (req, res) => {
    try {
        Intervalle.getAll((result) => {
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

export const getIntervalle = (req, res) => {
    try {
        let id = req.params.id;
        Intervalle.getOne(id, (result) => {
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

export const postIntervalle = (req, res) => {
    try {
        let { date_debut, date_fin } = req.body;
        Intervalle.checkDate(date_debut, date_fin, (result1) => {
            if (result1.count != 0) {
                res.json({
                    status: 400,
                    error: 'Intervalle already exists'
                });
            } 
            else {
                Intervalle.add(date_debut, date_fin, (result2) => {
                    res.status(200).json({
                        status: 200,
                        insertId: result2.insertId,
                        message: 'POST Intervalle success'
                    });
                })
            }
        })
} catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'POST Intervalle failed'
        });
    }
}   

export const putIntervalle = (req, res) => {
    try {
        let id = req.params.id;
        let { date_debut, date_fin } = req.body;
        Intervalle.checkDateApartOne(id, date_debut, date_fin, (result1) => {
            if (result1.count != 0) {
                res.json({
                    status: 400,
                    error: 'Intervalle already exists'
                });
            } 
            else {
                Intervalle.update(id, date_debut, date_fin, (result2) => {
                    res.status(200).json({
                        status: 200,
                        insertId: result2.insertId,
                        message: 'PUT Intervalle success'
                    });
                })
            }
        })
    }   catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'PUT Intervalle failed'
        });
    }
}    

export const deleteIntervalle = (req, res) => {
    try {
        let id = req.params.id;
        Intervalle.delete(id, (result1) => {
            Planification.deleteByIntervalle(id, () => {
                res.status(200).json(result1);
            })
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}   