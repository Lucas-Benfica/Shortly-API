import { db } from "../database/databaseConnection.js";

export async function createUrl (url, newShortUrl, userId) {
    const result = db.query(`INSERT INTO urls (url, "shortUrl", "userId") VALUES ($1, $2, $3) RETURNING id, "shortUrl"`, [url, newShortUrl, userId]);
    return result;
}

export async function getUrlinfo (id) {
    const result = db.query(`SELECT * FROM urls WHERE id=$1`, [id]);
    return result;
}

export async function openUrl(shortUrl) {
    const result = db.query(`UPDATE urls SET views = views + 1 WHERE "shortUrl" = $1 RETURNING url;`, [shortUrl]);
    return result;
}

export async function urlDelete(id){
    const result = db.query(`DELETE FROM urls where "id"=$1;`, [id]);
    return result;
}

export async function rankingGet(){
    const result = db.query(`
        SELECT u.id, u.name, COUNT(ur.id) AS "linksCount", SUM(ur.views) AS "visitCount"
        FROM users u
        JOIN urls ur ON u.id = ur."userId"
        GROUP BY u.id, u.name
        ORDER BY "visitCount" DESC
        LIMIT 10;`);
    return result;
}