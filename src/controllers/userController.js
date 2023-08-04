import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { db } from "../database/databaseConnection.js";

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(422).send({ message: "Incompatible passwords" });
    }

    try {
        const hash = bcrypt.hashSync(password, 10);

        await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`, [name, email, hash]);
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).send("Error while signing up: " + err.message);
    }
}

export async function signIn(req, res) {
    const { userData } = res.locals;
    const token = uuid();
    try {
        await db.query(`INSERT INTO session ("userId", token) VALUES ($1, $2);`, [userData.id, token]);

        res.status(200).send({ token: token, userName: userData.name });
    } catch (err) {
        res.status(500).send("Error while signing in: " + err.message);
    }
}

export async function getUserInfo(req, res) {
    const { userId } = res.locals;

    try {
        //json_agg é usado para agrupar os resultados da subconsulta em um array JSON.
        //json_build_object é usado para criar objetos JSON para cada URL encurtada.
        const userInfo = await db.query(`
            SELECT
                u.id,
                u.name,
                SUM(ur.views) AS "visitCount",
                json_agg(json_build_object(
                    'id', ur.id,
                    'shortUrl', ur."shortUrl",
                    'url', ur."url",
                    'visitCount', ur.views
                )) AS "shortenedUrls"
            FROM users u
            JOIN urls ur ON u.id = ur."userId"
            WHERE u.id = $1
            GROUP BY u.id, u.name;
        `, [userId]);

        res.status(200).send(userInfo.rows[0]);

    } catch (err) {
        res.status(500).send("Error while getting user information: " + err.message);
    }
}