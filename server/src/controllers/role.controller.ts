import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import Role from "../models/Role";

export const getRoles = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const roles = await Role.findAll({ order: [["name", "ASC"]] });

    // Filter out SUPER_ADMIN role unless the current user is a SUPER_ADMIN
    const userRole = req.user.role;
    let filteredRoles = roles;

    if (userRole !== "SUPER_ADMIN") {
      filteredRoles = roles.filter((r) => r.name !== "SUPER_ADMIN");
    }

    res.status(200).json(new ApiResponse(200, filteredRoles, "Roles fetched"));
  },
);
