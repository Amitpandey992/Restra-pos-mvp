import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import * as dashboardController from "../controllers/dashboard.controller";

const router = Router();

router.use(authenticate);

router.get("/stats", dashboardController.getDashboardStats);
router.get("/top-items", dashboardController.getTopSellingItems);
router.get("/sales-chart", dashboardController.getSalesChart);

export default router;
