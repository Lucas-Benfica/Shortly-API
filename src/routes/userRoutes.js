import { Router } from "express";
import { getUserInfo, signIn, signUp } from "../controllers/userController.js";
import { validateAuth } from "../middlewares/validateAuthorization.js";
import { validateEmailCreation } from "../middlewares/validateEmailCreation.js";
import { validateLogin } from "../middlewares/validateLogin.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { schemaSignUp, schemaSignIn } from "../schemas/userSchemas.js";

const userRouter = Router();

userRouter.post('/signup', validateSchema(schemaSignUp), validateEmailCreation, signUp);
userRouter.post('/signin', validateSchema(schemaSignIn), validateLogin, signIn);
userRouter.get('/users/me', validateAuth, getUserInfo)

export default userRouter;