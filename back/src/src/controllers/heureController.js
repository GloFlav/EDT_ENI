import { Heure } from '../models/heure';
import moment from 'moment';
import { Planification } from '../models/planification';

export const getAllHeure = (req, res) => {
    try {
        Heure.getAll((result) => {
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

export const getHeure = (req, res) => {
    try {
        let id = req.params.id;
        Heure.getOne(id, (result) => {
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

export const postHeure = (req, res) => {
    try {
        let { debut, fin } = req.body;
        Heure.check(debut, fin, (result1) => {
            if (result1.count != 0) {
                res.json({
                    status: 400,
                    error: 'Heure already exists'
                });
            } else {
                Heure.add(debut, fin, (result2) => {
                    res.status(200).json({
                        status: 200,
                        insertId: result2.insertId,
                        message: 'POST Heure success'
                    });
                })
            }
        })
} catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'POST Heure failed'
        });
    }
}   

export const putHeure = (req, res) => {
    try {
        let id = req.params.id;
        let { debut, fin } = req.body;
        Heure.checkApartOne(id, debut, fin, (result1) => {
            if (result1.count != 0) {
                res.json({
                    status: 400,
                    error: 'Heure already exists'
                });
            } else {
                Heure.update(id, debut, fin, (result) => {
                    res.status(200).json({
                        status: 200,
                        insertId: result.insertId,
                        message: 'PUT Heure success'
                    });
                })
            }
        })
    }   catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'PUT Heure failed'
        });
    }
}    

export const deleteHeure = (req, res) => {
    try {
        let id = req.params.id;
        Heure.delete(id, (result) => {
            Planification.deleteByHeure(id, () => {
                res.status(200).json(result);
            })
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}   