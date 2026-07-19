import sequelize from "../config/database";
import User from "../models/User";
import Tenant from "../models/Tenant";
import Role from "../models/Role";
import { ApiError } from "../utils/ApiError";
import * as tokenService from "./token.service";
import * as otpService from "./otp.service";

export const registerTenant = async (
  tenantData: {
    name: string;
    plan_id?: string;
  },
  userData: {
    full_name: string;
    email: string;
    password: string;
    is_verified?: boolean;
    is_active?: boolean;
  },
) => {
  const transaction = await sequelize.transaction();
  try {
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new ApiError(
        400,
        "Email already registered. Please use a different email.",
      );
    }

    // 1. Create Tenant
    const newTenant = await Tenant.create(
      {
        name: tenantData.name,
        plan_id: tenantData.plan_id || null,
        is_active: false,
        subscription_end_date: new Date(0),
      },
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

// export const purchasePlan = async ()

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
