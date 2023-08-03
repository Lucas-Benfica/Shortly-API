import { Router } from "express";
import urlRouter from "./urlsRoutes.js";
import userRouter from "./userRoutes.js";


const router = Router();

router.use(userRouter);
router.use(urlRouter);


export default router;