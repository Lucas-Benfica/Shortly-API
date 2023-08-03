import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { db } from "../database/databaseConnection.js";

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(409).send({ message: "Incompatible passwords" });
    }

    try {
        const hash = bcrypt.hashSync(password, 10);

        await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`, [name, email, hash]);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).send("Error while signing up: " + error.message);
    }
}

export async function signIn(req, res){
    const {email, password} = req.body;
    const {userData} = res.locals;
    const token = uuid();
    try{
        await db.query(`INSERT INTO session ("userId", token) VALUES ($1, $2);`, [userData.id, token]);

        res.status(200).send({token: token, userName: userData.name});
    }catch (err) {
        res.status(500).send("Error while signing in: " + error.message);  
    }
}