import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import * as tenantService from "../services/tenant.service";

export const createTenant = asyncHandler(
  async (req: Request, res: Response) => {
    const tenant = await tenantService.createTenant(req.body);
    res
      .status(201)
      .json(new ApiResponse(201, tenant, "Tenant created successfully"));
  },
);

export const getTenant = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;

    // RBAC Check
    if (req.user.role !== "SUPER_ADMIN" && req.user.tenantId !== id) {
      throw new ApiError(
        403,
        "Forbidden: You can only access your own tenant data",
      );
    }

    const tenant = await tenantService.getTenantById(id);
    res
      .status(200)
      .json(new ApiResponse(200, tenant, "Tenant retrieved successfully"));
  },
);

export const updateTenant = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;

    // RBAC Check
    if (req.user.role !== "SUPER_ADMIN" && req.user.tenantId !== id) {
      throw new ApiError(
        403,
        "Forbidden: You can only update your own tenant data",
      );
    }

    const tenant = await tenantService.updateTenant(id, req.body);
    res
      .status(200)
      .json(new ApiResponse(200, tenant, "Tenant updated successfully"));
  },
);

export const deleteTenant = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await tenantService.deleteTenant(id);
    res.status(200).json(new ApiResponse(200, null, "Tenant deactivated"));
  },
);
