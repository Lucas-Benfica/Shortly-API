import { db } from "../database/databaseConnection.js";
import { nanoid } from "nanoid";

export async function shortenUrl(req, res) {
    const { url } = req.body;
    const { userId } = res.locals;
    const newShortUrl = nanoid(8);
    try {
        const result = await db.query(`INSERT INTO urls (url, "shortUrl", "userId") VALUES ($1, $2, $3) RETURNING id, "shortUrl"`, [url, newShortUrl, userId]);
        const {id, shortUrl} = result.rows[0];

        res.status(201).send({id, shortUrl});

    } catch (err) {
        res.status(500).send({message: "Error when shortening url: " + err.message});
    }
}

export async function getUrl(req, res){
    const {id} = req.params;
    
    try {
        const urlData = await db.query(`SELECT id, "shortUrl", url FROM urls WHERE id=$1`, [id]);

        if(!urlData.rows[0]) return res.status(404).send({message: "Url does not exist"});
        res.status(200).send(urlData.rows[0]);

    } catch (err) {
        res.status(500).send({message: "Error when fetching url by id: " + err.message});
    }
}