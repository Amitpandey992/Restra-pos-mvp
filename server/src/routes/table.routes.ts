import { Router } from "express";
import * as tableController from "../controllers/table.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.post("/", tableController.createTable);
router.get("/", tableController.getTables);
router.put("/:id", tableController.updateTable);
router.delete("/:id", tableController.deleteTable);

export default router;
