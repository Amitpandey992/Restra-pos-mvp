import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import * as inventoryService from "./inventory.service";

export const getInventory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const { page = 1, limit = 20, search } = req.query;

    const result = await inventoryService.getIngredients(
      tenantId,
      Number(page),
      Number(limit),
      search as string,
    );
    res.status(200).json(new ApiResponse(200, result, "Inventory fetched"));
  },
);

export const adjustStock = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const { ingredientId, quantity, type, reason } = req.body;

    const result = await inventoryService.updateStock(
      tenantId,
      ingredientId,
      quantity,
      type,
      reason,
    );
    res.status(200).json(new ApiResponse(200, result, "Stock updated"));
  },
);

export const addIngredient = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const result = await inventoryService.createIngredient(tenantId, req.body);
    res.status(201).json(new ApiResponse(201, result, "Ingredient added"));
  },
);
