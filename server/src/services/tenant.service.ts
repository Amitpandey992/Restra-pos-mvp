import Tenant from "../models/Tenant";
import Plan from "../models/Plan";
import { ApiError } from "../utils/ApiError";

export const createTenant = async (payload: any) => {
  // Check if plan exists
  if (payload.plan_id) {
    const plan = await Plan.findByPk(payload.plan_id);
    if (!plan) throw new ApiError(400, "Invalid Plan ID");
  }

  // Set default subscription end date if not provided (e.g. 14 days trial)
  if (!payload.subscription_end_date) {
    const date = new Date();
    date.setDate(date.getDate() + 14); // 14 days trial
    payload.subscription_end_date = date;
  }

  return await Tenant.create(payload);
};

export const getTenantById = async (id: string) => {
  const tenant = await Tenant.findByPk(id, { include: [Plan] });
  if (!tenant) throw new ApiError(404, "Tenant not found");
  return tenant;
};

export const updateTenant = async (id: string, payload: any) => {
  const tenant = await getTenantById(id);
  return await tenant.update(payload);
};

export const deleteTenant = async (id: string) => {
  const tenant = await getTenantById(id); // Ensure it exists
  // Soft delete usually preferred
  return await tenant.update({ is_active: false });
};
