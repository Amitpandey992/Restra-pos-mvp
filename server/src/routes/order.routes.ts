import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrder);
router.put("/:id/status", orderController.updateOrderStatus);
router.post("/:id/checkout", orderController.checkoutOrder);

export default router;
