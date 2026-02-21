import express from "express";
import { authenticate } from "../middlewares/auth";
import * as notificationController from "../controllers/notification.controller";

const router = express.Router();

router.use(authenticate);

router.get("/", notificationController.getNotifications);
router.put("/read-all", notificationController.markAllAsRead);
router.put("/:id/read", notificationController.markAsRead);

export default router;
