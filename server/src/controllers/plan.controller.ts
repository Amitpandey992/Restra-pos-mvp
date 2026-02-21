import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import * as planService from "../services/plan.service";

export const createPlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await planService.createPlan(req.body);
  res.status(201).json(new ApiResponse(201, plan, "Plan created successfully"));
});

export const getPlans = asyncHandler(async (req: Request, res: Response) => {
  const plans = await planService.getAllPlans();
  res
    .status(200)
    .json(new ApiResponse(200, plans, "Plans retrieved successfully"));
});

export const getPlan = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const plan = await planService.getPlanById(id);
  res
    .status(200)
    .json(new ApiResponse(200, plan, "Plan retrieved successfully"));
});

export const updatePlan = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const plan = await planService.updatePlan(id, req.body);
  res.status(200).json(new ApiResponse(200, plan, "Plan updated successfully"));
});

export const deletePlan = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await planService.deletePlan(id);
  res.status(200).json(new ApiResponse(200, null, "Plan marked inactive"));
});
