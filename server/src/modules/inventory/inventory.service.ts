import sequelize from "../../config/database";
import Ingredient from "../../models/Ingredient";
import StockTransaction from "../../models/StockTransaction";
import Recipe from "../../models/Recipe";
import RecipeItem from "../../models/RecipeItem";
import MenuItem from "../../models/MenuItem";
import { ApiError } from "../../utils/ApiError";
import { Op, Transaction } from "sequelize";
import { tenantScope } from "../../utils/tenantSecurity";

export const getIngredients = async (
  tenantId: string,
  page = 1,
  limit = 20,
  search?: string,
) => {
  const offset = (page - 1) * limit;
  const where: any = {};

  if (search) {
    where.name = { [Op.like]: `%${search}%` };
  }

  const { count, rows } = await Ingredient.findAndCountAll({
    ...tenantScope(tenantId, where),
    limit,
    offset,
    order: [["name", "ASC"]],
  });

  return {
    total: count,
    items: rows,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
};

export const createIngredient = async (tenantId: string, data: any) => {
  const exists = await Ingredient.findOne(
    tenantScope(tenantId, { name: data.name }),
  );
  if (exists) throw new ApiError(400, "Ingredient already exists");

  return await Ingredient.create({ ...data, tenant_id: tenantId });
};

export const updateStock = async (
  tenantId: string,
  ingredientId: string,
  quantity: number,
  type: "purchase" | "adjustment" | "waste",
  reason?: string,
) => {
  const transaction = await sequelize.transaction();
  try {
    const ingredient = await Ingredient.findOne({
      ...tenantScope(tenantId, { id: ingredientId }),
      transaction,
    });
    if (!ingredient) throw new ApiError(404, "Ingredient not found");

    const uomMultiplier =
      type === "purchase" || type === "adjustment"
        ? ingredient.conversion_factor || 1
        : 1;

    const changeInRecipeUnits =
      (type === "waste" ? -Math.abs(quantity) : quantity) *
      (ingredient.conversion_factor || 1);

    const newStock = ingredient.current_stock + changeInRecipeUnits;

    if (newStock < 0)
      throw new ApiError(400, "Insufficient stock for adjustment");

    await ingredient.update({ current_stock: newStock }, { transaction });

    await StockTransaction.create(
      {
        tenant_id: tenantId,
        ingredient_id: ingredientId,
        quantity_change: changeInRecipeUnits,
        type,
        reason,
      },
      { transaction },
    );

    await transaction.commit();
    return ingredient;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Checks if stock is available for a list of OrderItems.
 * Throws if insufficient.
 */
export const validateStockForOrder = async (
  tenantId: string,
  items: { menu_item_id: string; quantity: number }[],
) => {
  // 1. Aggregate total ingredients needed
  const ingredientNeeds: Record<string, number> = {};

  for (const item of items) {
    const recipe = await Recipe.findOne({
      ...tenantScope(tenantId, { menu_item_id: item.menu_item_id }),
      include: [RecipeItem],
    });

    if (!recipe) continue;

    const recipeItems = (recipe as any).RecipeItems || [];

    for (const rItem of recipeItems) {
      const totalNeeded = rItem.quantity * item.quantity;
      ingredientNeeds[rItem.ingredient_id] =
        (ingredientNeeds[rItem.ingredient_id] || 0) + totalNeeded;
    }
  }

  // 2. Check against current stock
  for (const [ingredientId, amountNeeded] of Object.entries(ingredientNeeds)) {
    // SECURE FIX: Include tenant_id in lookup
    const ingredient = await Ingredient.findOne(
      tenantScope(tenantId, { id: ingredientId }),
    );

    if (!ingredient || ingredient.current_stock < amountNeeded) {
      throw new ApiError(
        400,
        `Insufficient stock for ingredient: ${ingredient?.name || ingredientId}`,
      );
    }
  }

  return ingredientNeeds;
};

/**
 * Deducts stock for a confirmed order.
 * MUST be called within an existing transaction.
 */
export const deductStockForOrder = async (
  tenantId: string,
  orderId: string,
  items: { menu_item_id: string; quantity: number }[],
  transaction: Transaction,
) => {
  const ingredientNeeds: Record<string, number> = {};

  for (const item of items) {
    const recipe = await Recipe.findOne({
      ...tenantScope(tenantId, { menu_item_id: item.menu_item_id }),
      include: [RecipeItem],
      transaction,
    });

    if (!recipe) continue;
    const recipeItems = (recipe as any).RecipeItems || [];

    for (const rItem of recipeItems) {
      const totalNeeded = rItem.quantity * item.quantity;
      ingredientNeeds[rItem.ingredient_id] =
        (ingredientNeeds[rItem.ingredient_id] || 0) + totalNeeded;
    }
  }

  for (const [ingredientId, amountNeeded] of Object.entries(ingredientNeeds)) {
    // SECURE FIX: Include tenant_id in lookup
    const ingredient = await Ingredient.findOne({
      ...tenantScope(tenantId, { id: ingredientId }),
      transaction,
    });

    if (!ingredient)
      throw new ApiError(500, "Ingredient missing during deduction");

    const newStock = ingredient.current_stock - amountNeeded;
    if (newStock < 0) {
      throw new ApiError(
        400,
        `Insufficient stock for ${ingredient.name} during checkout processing`,
      );
    }

    await ingredient.update({ current_stock: newStock }, { transaction });

    await StockTransaction.create(
      {
        tenant_id: tenantId,
        ingredient_id: ingredientId,
        quantity_change: -amountNeeded,
        type: "usage",
        reference_id: orderId,
        reason: "Order Checkout",
      },
      { transaction },
    );
  }
};
