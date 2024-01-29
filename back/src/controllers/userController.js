import bcrypt from 'bcrypt'
import { Utilisateur } from '../models/utilisateur';

export function getAllUser(req, res) {
    try {
        Utilisateur.getAll((result) => {
            res.status(200).json(result);
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}

export function getUser(req, res) {
    try {
        let id = req.params.id;
        Utilisateur.getOne(id, (result) => {
            res.status(200).json(result);
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}

export function postUser(req, res) {
    try {
        let password = bcrypt.hashSync(req.body.password, 8);
        let admin = req.body.admin;
        Utilisateur.add(username, password, admin, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'POST Utilisateur success'
            });
        })
    } catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'POST Utilisateur failed'
        });
    }
}

export function putUser(req, res) {
    try {
        let id = req.params.id
        let username = req.body.username;
        let password = bcrypt.hashSync(req.body.password);
        let admin = req.body.admin;
        Utilisateur.update(id, username, password, admin, (result) => {
            res.status(200).json({
                status: 200,
                insertId: result.insertId,
                message: 'PUT Utilisateur success'
            });
        })
    } catch(err) {
        res.status(500).json({
            status: 500,
            error: err,
            message: 'PUT Utilisateur failed'
        });
    }
}

export function deleteUser(req, res) {
    try {
        let id = req.params.id;
        Utilisateur.delete(id, (result) => {
            res.status(200).json(result);
        })
    } catch(err) {
        res.status(500).json({
            error: err
        });
    }
}