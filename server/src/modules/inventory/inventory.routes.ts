import { Router } from "express";
import * as inventoryController from "./inventory.controller";
import { authenticate } from "../../middlewares/auth";

const router = Router();
router.use(authenticate);

router.get("/", inventoryController.getInventory);
router.post("/", inventoryController.addIngredient);
router.post("/adjust", inventoryController.adjustStock);

export default router;
