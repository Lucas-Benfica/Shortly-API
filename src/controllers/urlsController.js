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
        res.status(500).send("Error when shortening url: " + err.message);
    }
}