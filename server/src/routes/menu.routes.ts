import { Router } from "express";
import * as menuController from "../controllers/menu.controller";
import { authenticate } from "../middlewares/auth";
import { upload } from "../middlewares/fileUpload";

const router = Router();

router.use(authenticate);

// Handle file upload for creating and updating menu items
router.post("/", upload.single("image"), menuController.createMenuItem);
router.get("/", menuController.getMenuItems);
router.put("/:id", upload.single("image"), menuController.updateMenuItem);
router.delete("/:id", menuController.deleteMenuItem);

export default router;
