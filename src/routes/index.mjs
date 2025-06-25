import usersRouter from "./user.mjs";
import productsRouter from "./products.mjs";
import { Router } from "express";

const router = Router();

router.use(usersRouter);
router.use(productsRouter);

export default router;
