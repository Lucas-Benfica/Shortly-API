import { Router } from "express"
import userRouter from "./userRoutes.js"
//import customersRouter from "./customers.routes.js"


const router = Router()

router.use(userRouter);


export default router