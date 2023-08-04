import { Router } from "express";
import { getUrl, openShortUrl, shortenUrl } from "../controllers/urlsController.js";
import { validateAuth } from "../middlewares/validateAuthorization.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { schemaUrl } from "../schemas/urlsSchemas.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateSchema(schemaUrl), validateAuth, shortenUrl );
urlRouter.get("/urls/:id", getUrl);
urlRouter.get("/urls/open/:shortUrl", openShortUrl);

export default urlRouter;