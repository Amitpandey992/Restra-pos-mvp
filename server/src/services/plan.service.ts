import Plan from "../models/Plan";
import { ApiError } from "../utils/ApiError";

export const createPlan = async (payload: {
  name: string;
  price: number;
  duration_days: number;
  features: string[];
  is_active: boolean;
}) => {
  const existingPlan = await Plan.findOne({
    where: {
      name: payload.name,
      is_active: true,
    },
  });
  if (existingPlan) throw new ApiError(400, "Plan already exists");
  if (payload.price <= 0)
    throw new ApiError(400, "Price must be greater than 0");
  if (payload.duration_days <= 0)
    throw new ApiError(400, "Duration must be greater than 0");

  const plan = await Plan.create(payload);
  return plan;
};

export const getAllPlans = async () => {
  const plans = await Plan.findAll({ where: { is_active: true } });
  return plans;
};

export const getPlanById = async (id: string) => {
  const plan = await Plan.findByPk(id);
  if (!plan) throw new ApiError(404, "Plan not found");
  return plan;
};

export const updatePlan = async (id: string, payload: any) => {
  const plan = await getPlanById(id);
  return await plan.update(payload);
};

export const deletePlan = async (id: string) => {
  const plan = await getPlanById(id);
  // Soft delete or just deactivate
  return await plan.update({ is_active: false });
};
