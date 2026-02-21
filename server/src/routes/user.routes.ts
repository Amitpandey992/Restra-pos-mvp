import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import * as userController from "../controllers/user.controller";
// Maybe add role check middleware later

const router = Router();

router.use(authenticate);

router.post("/", userController.createStaff);
router.get("/", userController.getStaff);
router.put("/:id", userController.updateStaff);
router.delete("/:id", userController.deleteStaff);

export default router;
