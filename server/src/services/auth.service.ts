import sequelize from "../config/database";
import User from "../models/User";
import Tenant from "../models/Tenant";
import Role from "../models/Role";
import Plan from "../models/Plan";
import { ApiError } from "../utils/ApiError";
import * as tokenService from "./token.service";
import * as otpService from "./otp.service";

export const registerTenant = async (
  tenantData: {
    name: string;
    phone?: string;
    plan_id?: string;
  },
  userData: {
    full_name: string;
    email: string;
    password: string;
    phone?: string;
    is_verified?: boolean;
    is_active?: boolean;
  },
) => {
  const transaction = await sequelize.transaction();
  try {
    // 0. Check if user already exists
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new ApiError(
        400,
        "Email already registered. Please login or use a different email.",
      );
    }

    // 1. Create Tenant
    // Validate Plan if provided and not empty
    if (tenantData.plan_id) {
      const plan = await Plan.findByPk(tenantData.plan_id);
      if (!plan)
        throw new ApiError(400, "Invalid Plan ID", [], "Tenant.plan_id");
    }

    // If plan_id is empty string, set it to null or undefined so it doesn't cause DB error for UUID
    const planIdToSave = tenantData.plan_id || null;

    const newTenant = await Tenant.create(
      {
        ...tenantData,
        plan_id: planIdToSave,
        subscription_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      } as any,
      { transaction },
    );

    // 2. Find Owner Role
    const ownerRole = await Role.findOne({ where: { name: "OWNER" } });
    if (!ownerRole)
      throw new ApiError(500, 'System Role "OWNER" missing. Contact Admin.');

    // 3. Create User
    const newUser = await User.create(
      {
        full_name: userData.full_name,
        email: userData.email,
        password: userData.password,
        role_id: ownerRole.id,
        tenant_id: newTenant.id,
        is_active: false,
        is_verified: false,
      },
      { transaction },
    );

    // 4. Generate & Send OTP
    await otpService.generateOTP(newUser.email, newUser.full_name);

    await transaction.commit();

    return { user: newUser, tenant: newTenant };
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
