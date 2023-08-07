import { db } from "../database/databaseConnection.js";
import { nanoid } from "nanoid";
import { createUrl, getUrlinfo, openUrl, rankingGet, urlDelete } from "../repositories/urlsRepository.js";

export async function shortenUrl(req, res) {
    const { url } = req.body;
    const { userId } = res.locals;
    const newShortUrl = nanoid(8);
    try {
        const result = await createUrl(url, newShortUrl, userId);
        const {id, shortUrl} = result.rows[0];
        res.status(201).send({id, shortUrl});
    } catch (err) {
        res.status(500).send({message: "Error when shortening url: " + err.message});
    }
}

export async function getUrl(req, res){
    const {id} = req.params;
    
    try {
        const urlData = await getUrlinfo(id);
        if(!urlData.rows[0]) return res.status(404).send({message: "Url does not exist"});
        const result = urlData.rows[0];
        res.status(200).send({id: result.id, shortUrl: result.shortUrl, url: result.url});
    } catch (err) {
        res.status(500).send({message: "Error when fetching url by id: " + err.message});
    }
}

export async function openShortUrl(req, res){
    const {shortUrl} = req.params;

    try {
        const result = await openUrl(shortUrl);
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
        const urlData = await getUrlinfo(id);
        if(!urlData.rows[0]) return res.status(404).send({message: "Url does not exist"});
        const urlInfo = urlData.rows[0];
        if(urlInfo.userId !== userId) return res.status(401).send({message: "The url does not belong to the current user"});
        await urlDelete(id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send({message: "Error while opening url: " + err.message});
    }
}

export async function getRanking(req, res){
    try {
        const ranking = await rankingGet();
        res.send(ranking.rows);
    } catch (err) {
        res.status(500).send({message: "Error when fetching url by id: " + err.message});
    }
}