import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";


export async function cadastro(req, res) {
    const {name, email, password, confirmPassword} = req.body;
    try {

        //const userOk = await db.collection('user').findOne({email});
        //if (userOk) return res.sendStatus(409);
        const hash = bcrypt.hashSync(password, 10);
        
        //await db.collection('user').insertOne({name, email, password: hash, adress});
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}