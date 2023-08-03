import { Router } from "express";
import { validateAuth } from "../middlewares/validateAuthorization.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { schemaUser, schemaLogin } from "../schemas/userSchemas.js";

const userRouter = Router();

//userRouter.post('/cadastro', validateSchema(schemaCadastro), cadastro);


export default userRouter;