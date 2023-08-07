import { db } from "../database/databaseConnection.js";

export async function createUser (name, email, password) {
	
    const newUser = db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`, [name, email, password]);
    return newUser;

}

export async function signInSession (token, userData) {	
    const login = db.query(`INSERT INTO session ("userId", token) VALUES ($1, $2);`, [userData.id, token]);
    return login;
}

export async function getUser (id) {	
    //json_agg é usado para agrupar os resultados da subconsulta em um array JSON.
    //json_build_object é usado para criar objetos JSON para cada URL encurtada.
            
    const userInfo = db.query(`
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
        `, [id]);
    
    return userInfo;
}