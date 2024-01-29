import jwt from 'jsonwebtoken';
require('dotenv').config();
const secret_key = process.env.ACCESS_TOKEN_SECRET;

export const Authenticated = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (authorization === undefined) {
            res.sendStatus(401);
        } else {
            const token = authorization.split(' ')[1];
            jwt.verify(token, secret_key, (err, user) => {
                if (err) {
                    res.status(401);
                } else {
                    req.user = user;
                    next();
                }
            })
        }
    }
    catch(err) {
        res.status(401).json({error : err});
    }
}

export const isAdmin = (req, res, next) => {
    try {
        const { admin } = req.user;
        if (admin) {
            next();
        } else {
            res.status(403).send({ message : "Account no privilege with this feature" });
        }
    }
    catch(err) {
        res.status(401).json({error : err});
    }
}