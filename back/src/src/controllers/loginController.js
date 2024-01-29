import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Utilisateur } from '../models/utilisateur';

require('dotenv').config();
const secret_key = process.env.ACCESS_TOKEN_SECRET;

export const login = (req, res) => {
    try {
        const { username, password } = req.body;
        Utilisateur.getOneByUsername(username, async user => {
            if (user) {
                const matchPass = await bcrypt.compare(password, user.password);
                if (matchPass) {
                    const accessToken = jwt.sign(user, secret_key, {expiresIn : '24h'});
                    res.status(200).json({accessToken : accessToken});
                }
                else  {
                    res.status(400).json("Mot de passe incorrect");
                }
            } else {
                res.status(400).json("Nom d'utilisateur ou Mot de passe incorrect");
            }
        })
    }
    catch(err) {
        res.status(400).json({ error : err });
    }
}