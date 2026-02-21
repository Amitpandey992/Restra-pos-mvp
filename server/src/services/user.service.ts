import User from "../models/User";
import Tenant from "../models/Tenant";
import Role from "../models/Role";
import { ApiError } from "../utils/ApiError";

export const createUser = async (payload: any, transaction?: any) => {
  // Check if email exists
  const existingUser = await User.findOne({
    where: { email: payload.email },
    transaction,
  });
  if (existingUser) {
    throw new ApiError(400, "Email already taken");
  }
  return await User.create(payload, { transaction });
};

export const getUserByEmail = async (email: string) => {
  return await User.findOne({
    where: { email },
    include: [{ model: Role }, { model: Tenant }],
  });
};

export const getUserById = async (id: string) => {
  return await User.findByPk(id, {
    include: [{ model: Role }, { model: Tenant }],
  });
};
