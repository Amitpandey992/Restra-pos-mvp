import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import MenuItem from "../models/MenuItem";
import { tenantScope } from "../utils/tenantSecurity";
import Ingredient from "../models/Ingredient";

export const createMenuItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenant_id = req.user.tenantId;

    let image_url = req.body.image_url;
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      image_url = `${baseUrl}/uploads/${req.file.filename}`;
    }

    let ingredients = req.body.ingredients;
    if (typeof ingredients === "string") {
      try {
        ingredients = JSON.parse(ingredients);
      } catch (e) {
        ingredients = [];
      }
    }

    // Create Item
    const item: any = await MenuItem.create({
      ...req.body,
      price: Number(req.body.price),
      tenant_id,
      status: "available",
      image_url,
    });

    // Handle Ingredients Association
    if (ingredients && Array.isArray(ingredients) && ingredients.length > 0) {
      // Validate ownership
      const validIngredients = await Ingredient.findAll({
        where: {
          id: ingredients,
          tenant_id,
        },
        attributes: ["id"],
      });

      const validIds = validIngredients.map((i) => i.id);
      if (validIds.length > 0) {
        await item.setIngredients(validIds);
      }
    }

    // Refetch to include ingredients
    const fullItem = await MenuItem.findByPk(item.id, {
      include: [
        {
          model: Ingredient,
          attributes: [
            "id",
            "name",
            "unit",
            "purchase_unit",
            "recipe_unit",
            "conversion_factor",
          ],
          through: { attributes: [] }, // Hide join table
        },
      ],
    });

    res.status(201).json(new ApiResponse(201, fullItem, "Item created"));
  },
);

export const getMenuItems = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenant_id = req.user.tenantId;
    const { category, type, search, page = 1, limit = 50 } = req.query;

    const filters: any = {};
    if (category) filters.category = category;
    if (type) filters.type = type;

    const offset = (Number(page) - 1) * Number(limit);

    // Use tenantScope helper
    const { count, rows } = await MenuItem.findAndCountAll({
      ...tenantScope(tenant_id, filters),
      limit: Number(limit),
      offset,
      order: [["name", "ASC"]],
      include: [
        {
          model: Ingredient,
          attributes: [
            "id",
            "name",
            "unit",
            "purchase_unit",
            "recipe_unit",
            "conversion_factor",
          ],
          through: { attributes: [] },
        },
      ],
      distinct: true, // Important for accurate count with includes
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          total: count,
          items: rows,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        "Items fetched",
      ),
    );
  },
);

export const updateMenuItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const tenant_id = req.user.tenantId;

    const item: any = await MenuItem.findOne(tenantScope(tenant_id, { id }));
    if (!item) throw new ApiError(404, "Item not found");

    const updateData = { ...req.body };

    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      updateData.image_url = `${baseUrl}/uploads/${req.file.filename}`;
    }

    if (updateData.price) updateData.price = Number(updateData.price);

    await item.update(updateData);

    // Update Ingredients if provided
    if (req.body.ingredients !== undefined) {
      let ingredients = req.body.ingredients;
      if (typeof ingredients === "string") {
        try {
          ingredients = JSON.parse(ingredients);
        } catch (e) {
          ingredients = [];
        }
      }

      if (Array.isArray(ingredients)) {
        const validIngredients = await Ingredient.findAll({
          where: {
            id: ingredients,
            tenant_id,
          },
          attributes: ["id"],
        });
        const validIds = validIngredients.map((i) => i.id);
        await item.setIngredients(validIds);
      }
    }

    res.status(200).json(new ApiResponse(200, item, "Item updated"));
  },
);

export const deleteMenuItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const tenant_id = req.user.tenantId;

    const item = await MenuItem.findOne(tenantScope(tenant_id, { id }));

    if (!item) {
      throw new ApiError(404, "Item not found");
    }

    await item.destroy();

    res.status(200).json(new ApiResponse(200, null, "Item deleted"));
  },
);
