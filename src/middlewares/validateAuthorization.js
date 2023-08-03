
export async function validateAuth(req, res, next) {
    let tokenOk;
    const { authorization } = req.headers;
    
    const token = authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);
    
    try {
        // Procurar na tebala se o token existe.
        //tokenOk = await db.collection("section").findOne({token});
        if (!tokenOk) return res.sendStatus(401);
    } catch (err) {
        res.status(500).send(err.message);
    }

    res.locals.tokenOk = tokenOk;
    next();
}