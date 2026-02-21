import Role from "../models/Role";
import { ApiError } from "../utils/ApiError";

export const createRole = async (payload: any) => {
  return await Role.create(payload);
};

export const getRoleByName = async (name: string) => {
  const role = await Role.findOne({ where: { name } });
  if (!role) throw new ApiError(404, `Role ${name} not found`);
  return role;
};

export const ensureRolesExist = async () => {
  const roles = ["SUPER_ADMIN", "OWNER", "CASHIER", "WAITER", "CHEF"];
  for (const role of roles) {
    const existing = await Role.findOne({ where: { name: role } });
    if (!existing) {
      await Role.create({ name: role, description: `Default ${role} role` });
      console.log(`✅ Created role: ${role}`);
    }
  }
};
