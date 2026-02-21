import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import * as otpService from "../services/otp.service";
import User from "../models/User";
import { ApiError } from "../utils/ApiError";
import { tenantScope } from "../utils/tenantSecurity";

export const createStaff = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const ownerId = req.user.id;

    // Authorization Guard: Only OWNER or ADMIN can create staff
    if (req.user.role !== "OWNER" && req.user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Only restaurant owners can add team members");
    }

    console.log(
      `[STAFF_CREATE] Owner(${ownerId}) from Tenant(${tenantId}) is creating staff`,
    );

    const { full_name, email, password, role_id } = req.body;

    // Block Tenant Injection: ignore any tenant_id sent from frontend
    if (req.body.tenant_id) {
      console.warn(
        `[SECURITY] Potential tenant injection blocked from user ${ownerId}. Tried to set tenant_id: ${req.body.tenant_id}`,
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError(400, "Email already in use.");
    }

    const user = await User.create({
      full_name,
      email,
      password,
      role_id,
      tenant_id: tenantId,
      created_by: ownerId,
      is_active: false,
      is_verified: false,
    });

    console.log(
      `[STAFF_CREATE] Assigned tenant ${tenantId} to new staff member ${user.id}`,
    );

    await otpService.generateOTP(user.email, user.full_name);

    res
      .status(201)
      .json(new ApiResponse(201, user, "Staff created. OTP sent to email."));
  },
);

export const getStaff = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const { page = 1, limit = 20 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await User.findAndCountAll({
      ...tenantScope(tenantId),
      include: ["Role"],
      limit: Number(limit),
      offset,
      attributes: { exclude: ["password"] },
      order: [["full_name", "ASC"]],
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          total: count,
          users: rows,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        "Staff list fetched",
      ),
    );
  },
);

export const updateStaff = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const { id } = req.params;

    const user = await User.findOne(
      tenantScope(tenantId, { id: id as string }),
    );
    if (!user) throw new ApiError(404, "User not found");

    // Prevent tenant_id update via this endpoint
    const updateData = { ...req.body };
    delete updateData.tenant_id;

    await user.update(updateData);

    res.status(200).json(new ApiResponse(200, user, "Staff updated"));
  },
);

export const deleteStaff = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const { id } = req.params;

    if (req.user.sub === id || req.user.id === id) {
      throw new ApiError(400, "Cannot delete yourself");
    }

    const user = await User.findOne(
      tenantScope(tenantId, { id: id as string }),
    );
    if (!user) throw new ApiError(404, "User not found");

    await user.update({ is_active: false });

    res.status(200).json(new ApiResponse(200, null, "Staff deactivated"));
  },
);
