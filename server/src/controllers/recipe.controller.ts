import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import * as recipeService from "../services/recipe.service";

export const createRecipe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const recipe = await recipeService.createRecipe(tenantId, req.body);
    res.status(201).json(new ApiResponse(201, recipe, "Recipe created"));
  },
);

export const getRecipes = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const { page = 1, limit = 20 } = req.query;
    const result = await recipeService.getRecipes(
      tenantId,
      Number(page),
      Number(limit),
    );
    res.status(200).json(new ApiResponse(200, result, "Recipes fetched"));
  },
);

export const getRecipe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const { id } = req.params;
    const recipe = await recipeService.getRecipeById(tenantId, id as string);
    res.status(200).json(new ApiResponse(200, recipe, "Recipe fetched"));
  },
);

export const updateRecipe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const { id } = req.params;
    const recipe = await recipeService.updateRecipe(
      tenantId,
      id as string,
      req.body,
    );
    res.status(200).json(new ApiResponse(200, recipe, "Recipe updated"));
  },
);

export const deleteRecipe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const { id } = req.params;
    await recipeService.deleteRecipe(tenantId, id as string);
    res.status(200).json(new ApiResponse(200, null, "Recipe deleted"));
  },
);
