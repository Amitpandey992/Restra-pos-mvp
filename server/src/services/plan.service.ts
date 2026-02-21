import Plan from "../models/Plan";
import { ApiError } from "../utils/ApiError";

export const createPlan = async (payload: any) => {
  return await Plan.create(payload);
};

export const getAllPlans = async () => {
  return await Plan.findAll({ where: { is_active: true } });
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
