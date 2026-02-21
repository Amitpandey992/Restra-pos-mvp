import sequelize from "../config/database";
import Recipe from "../models/Recipe";
import RecipeItem from "../models/RecipeItem";
import { ApiError } from "../utils/ApiError";
import Ingredient from "../models/Ingredient";
import MenuItem from "../models/MenuItem";

import { tenantScope } from "../utils/tenantSecurity";

export const createRecipe = async (tenantId: string, data: any) => {
  const transaction = await sequelize.transaction();
  try {
    // Check if recipe exists for this menu item? A menu item can have only one recipe for now (1:1 relationship in models, but models said hasOne/belongsTo, let's check).
    // MenuItem hasOne Recipe.
    const existing = await Recipe.findOne({
      ...tenantScope(tenantId, { menu_item_id: data.menu_item_id }),
      transaction,
    });
    if (existing) {
      throw new ApiError(400, "Recipe already exists for this Menu Item");
    }

    const recipe = await Recipe.create(
      {
        tenant_id: tenantId,
        menu_item_id: data.menu_item_id,
        name: data.name,
        instructions: data.instructions,
      },
      { transaction },
    );

    if (data.items && data.items.length > 0) {
      const recipeItems = data.items.map((item: any) => ({
        recipe_id: recipe.id,
        ingredient_id: item.ingredient_id,
        quantity: item.quantity,
      }));
      await RecipeItem.bulkCreate(recipeItems, { transaction });
    }

    await transaction.commit();
    return await getRecipeById(tenantId, recipe.id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getRecipes = async (tenantId: string, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await Recipe.findAndCountAll({
    ...tenantScope(tenantId),
    include: [
      { model: MenuItem, attributes: ["name"] },
      { model: RecipeItem, include: [Ingredient] },
    ],
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

export const getRecipeById = async (tenantId: string, id: string) => {
  const recipe = await Recipe.findOne({
    ...tenantScope(tenantId, { id }),
    include: [
      { model: MenuItem, attributes: ["name", "id"] },
      {
        model: RecipeItem,
        include: [
          {
            model: Ingredient,
            attributes: [
              "name",
              "unit",
              "purchase_unit",
              "recipe_unit",
              "conversion_factor",
              "cost_per_unit",
            ],
          },
        ],
      },
    ],
  });
  if (!recipe) throw new ApiError(404, "Recipe not found");
  return recipe;
};

export const updateRecipe = async (tenantId: string, id: string, data: any) => {
  const transaction = await sequelize.transaction();
  try {
    const recipe = await Recipe.findOne({
      ...tenantScope(tenantId, { id }),
      transaction,
    });
    if (!recipe) throw new ApiError(404, "Recipe not found");

    await recipe.update(
      { name: data.name, instructions: data.instructions },
      { transaction },
    );

    if (data.items) {
      // Replace items strategy: Delete all and recreate
      await RecipeItem.destroy({ where: { recipe_id: id }, transaction });

      const recipeItems = data.items.map((item: any) => ({
        recipe_id: id,
        ingredient_id: item.ingredient_id,
        quantity: item.quantity,
      }));
      await RecipeItem.bulkCreate(recipeItems, { transaction });
    }

    await transaction.commit();
    return await getRecipeById(tenantId, id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const deleteRecipe = async (tenantId: string, id: string) => {
  const recipe = await Recipe.findOne(tenantScope(tenantId, { id }));
  if (!recipe) throw new ApiError(404, "Recipe not found");
  await recipe.destroy();
  return { message: "Recipe deleted" };
};
