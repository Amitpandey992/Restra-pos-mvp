import { Router } from "express";
import * as tenantController from "../controllers/tenant.controller";
import { validate } from "../middlewares/validation";
import * as tenantValidation from "../validations/tenant.validation";
import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/role";

const router = Router();

// Public - Registration happens via Auth module, but direct tenant creation might be admin-only or specific flow?
// Actually Auth module handles full registration (User+Tenant).
// This endpoint might be used by Admin to create a tenant without a user initially? Or simply discouraged.
// I will protect CREATE to SUPER_ADMIN only. Registration uses /auth/register.
router.post(
  "/",
  authenticate,
  authorize(["SUPER_ADMIN"]),
  validate(tenantValidation.createTenantSchema),
  tenantController.createTenant,
);

router.use(authenticate);

// Protected
router.get(
  "/:id",
  authorize(["SUPER_ADMIN", "OWNER"]),
  tenantController.getTenant,
);
router.put(
  "/:id",
  authorize(["SUPER_ADMIN", "OWNER"]),
  validate(tenantValidation.createTenantSchema.partial()),
  tenantController.updateTenant,
);
router.delete(
  "/:id",
  authorize(["SUPER_ADMIN"]),
  tenantController.deleteTenant,
);

export default router;
