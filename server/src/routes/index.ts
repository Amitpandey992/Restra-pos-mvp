import { Router } from "express";
import planRoutes from "./plan.routes";
import tenantRoutes from "./tenant.routes";
import authRoutes from "./auth.routes";
import tableRoutes from "./table.routes";
import menuRoutes from "./menu.routes";
import orderRoutes from "./order.routes";
import inventoryRoutes from "../modules/inventory/inventory.routes";
import userRoutes from "./user.routes";
import recipeRoutes from "./recipe.routes";
import roleRoutes from "./role.routes";
import dashboardRoutes from "./dashboard.routes";
import searchRoutes from "./search.routes";
import notificationRoutes from "./notification.routes";

const router = Router();


router.use("/auth", authRoutes); // /api/v1/auth
router.use("/plans", planRoutes); // /api/v1/plans
router.use("/tenants", tenantRoutes); // /api/v1/tenants
router.use("/tables", tableRoutes); // /api/v1/tables
router.use("/menu", menuRoutes); // /api/v1/menu
router.use("/orders", orderRoutes); // /api/v1/orders
router.use("/inventory", inventoryRoutes); // /api/v1/inventory
router.use("/users", userRoutes); // /api/v1/users
router.use("/recipes", recipeRoutes); // /api/v1/recipes
router.use("/roles", roleRoutes); // /api/v1/roles
router.use("/dashboard", dashboardRoutes); // /api/v1/dashboard
router.use("/notifications", notificationRoutes); // /api/v1/notifications

router.use("/search", searchRoutes); // /api/v1/search

export default router;
