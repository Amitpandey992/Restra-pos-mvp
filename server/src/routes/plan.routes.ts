import { Router } from "express";
import * as planController from "../controllers/plan.controller";
import { validate } from "../middlewares/validation";
import * as planValidation from "../validations/plan.validation";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/role";

const router = Router();

router.get("/", planController.getPlans); // Public API
router.get("/:id", planController.getPlan); // Public API

// Protected Routes
router.use(authenticate);
router.post(
  "/",
  authorize(["SUPER_ADMIN"]),
  validate(planValidation.createPlanSchema),
  planController.createPlan,
);
router.put(
  "/:id",
  authorize(["SUPER_ADMIN"]),
  validate(planValidation.createPlanSchema.partial()),
  planController.updatePlan,
);
router.delete("/:id", authorize(["SUPER_ADMIN"]), planController.deletePlan);

export default router;
