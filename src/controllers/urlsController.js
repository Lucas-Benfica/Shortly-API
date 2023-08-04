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

export async function openShortUrl(req, res){
    const {shortUrl} = req.params;

    try {

        const result = await db.query(`UPDATE urls SET views = views + 1 WHERE "shortUrl" = $1 RETURNING url;`, [shortUrl]);

        if (result.rowCount === 0) return res.status(404).send({ message: "Url does not exist" });

        const url = result.rows[0].url;
        res.redirect(url);

    } catch (err) {
        res.status(500).send({message: "Error while opening url: " + err.message});
    }
}

export async function deleteUrl(req, res) {
    const { id } = req.params;
    const { userId } = res.locals;

    try {
        const result = await db.query(`DELETE FROM urls WHERE "id" = $1 AND "userId" = $2 RETURNING *;`, [id, userId]);

        if (result.rowCount === 0) {
            return res.status(404).send({ message: "Url does not exist" });
        }

        if (result.rows[0].userId !== userId) {
            return res.status(401).send({ message: "Url does not belong to the current user" });
        }

        res.sendStatus(204);
    } catch (err) {
        res.status(500).send({ message: "Error while deleting url: " + err.message });
    }
}


export async function getRanking(req, res){
    
    try {
        const ranking = await db.query(`
            SELECT u.id, u.name, COUNT(ur.id) AS "linksCount", SUM(ur.views) AS "visitCount"
            FROM users u
            JOIN urls ur ON u.id = ur."userId"
            GROUP BY u.id, u.name
            ORDER BY "visitCount" DESC
            LIMIT 10;`);

        res.send(ranking.rows);

    } catch (err) {
        res.status(500).send({message: "Error when fetching url by id: " + err.message});
    }
}