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

export async function deleteUrl(req, res){
    const {id} = req.params;
    const { userId } = res.locals;

    try {
        const urlData = await db.query(`SELECT * FROM urls WHERE "id"=$1;`, [id]);
        if(!urlData.rows[0]) return res.status(404).send({message: "Url does not exist"});
        
        const urlInfo = urlData.rows[0];
        
        if(urlInfo.userId !== userId) return res.status(401).send({message: "The url does not belong to the current user"});

        await db.query(`DELETE FROM urls where "id"=$1;`, [id]);

        res.sendStatus(204);
    } catch (err) {
        res.status(500).send({message: "Error while opening url: " + err.message});
    }
}