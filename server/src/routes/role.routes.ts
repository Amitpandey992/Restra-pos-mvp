import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import * as roleController from "../controllers/role.controller";

const router = Router();

router.use(authenticate);

router.get("/", roleController.getRoles);

export default router;
