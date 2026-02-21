import sequelize from "../config/database";
import User from "../models/User";
import Tenant from "../models/Tenant";
import Role from "../models/Role";
import Plan from "../models/Plan";
import { ApiError } from "../utils/ApiError";
import * as tenantService from "./tenant.service";
import * as userService from "./user.service";
import * as tokenService from "./token.service";
import * as otpService from "./otp.service";

export const registerTenant = async (payload: any) => {
  // payload should have { tenant: {...}, user: {...} }
  const transaction = await sequelize.transaction();
  try {
    // 0. Check if user already exists
    const existingUser = await User.findOne({
      where: { email: payload.user.email },
    });
    if (existingUser) {
      throw new ApiError(
        400,
        "Email already registered. Please login or use a different email.",
      );
    }

    // 1. Create Tenant
    // Validate Plan
    const plan = await Plan.findByPk(payload.tenant.plan_id);
    if (!plan) throw new ApiError(400, "Invalid Plan ID", [], "Tenant.plan_id");

    const tenant = await Tenant.create(
      {
        ...payload.tenant,
        subscription_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      },
      { transaction },
    );

    // 2. Find Owner Role
    const ownerRole = await Role.findOne({ where: { name: "OWNER" } });
    if (!ownerRole)
      throw new ApiError(500, 'System Role "OWNER" missing. Contact Admin.');

    // 3. Create User
    const user = await User.create(
      {
        full_name: payload.user.full_name,
        email: payload.user.email,
        password: payload.user.password,
        role_id: ownerRole.id,
        tenant_id: tenant.id,
        is_active: false,
        is_verified: false,
      },
      { transaction },
    );

    // 4. Generate & Send OTP
    await otpService.generateOTP(user.email, user.full_name);

    await transaction.commit();

    return { user, tenant };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  // 1. Find user
  const user = await User.findOne({
    where: { email },
    include: [{ model: Role }, { model: Tenant }],
  });

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 2. Check verified
  if (!user.is_verified) {
    throw new ApiError(
      401,
      "Email not verified. Please verify your email first.",
    );
  }

  // 3. Check active
  if (!user.is_active) {
    throw new ApiError(403, "User account is deactivated");
  }

  // 3. Check Tenant Status (if not Super Admin)
  if (user.role_id && user.Role?.name !== "SUPER_ADMIN") {
    if (!user.Tenant || !user.Tenant.is_active) {
      throw new ApiError(
        403,
        "Company subscription is inactive. Please renew.",
      );
    }
  }

  // 4. Update login time
  user.last_login = new Date();
  await user.save();

  // 5. Generate Tokens
  const tokens = tokenService.generateTokens(user);
  return { user, tokens };
};

export const getCurrentUser = async (userId: string) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
    include: [{ model: Role }, { model: Tenant }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};
