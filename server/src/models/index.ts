import Tenant from "./Tenant";
import Plan from "./Plan";
import Role from "./Role";
import User from "./User";
import Table from "./Table";
import MenuItem from "./MenuItem";
import Order from "./Order";
import OrderItem from "./OrderItem";
import Ingredient from "./Ingredient";
import Recipe from "./Recipe";
import RecipeItem from "./RecipeItem";
import StockTransaction from "./StockTransaction";

import Notification from "./Notification";
import Otp from "./Otp";

// ... existing imports

// Notification & Tenant
Notification.belongsTo(Tenant, { foreignKey: "tenant_id" });
Tenant.hasMany(Notification, { foreignKey: "tenant_id" });

// Notification & User
Notification.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Notification, { foreignKey: "user_id" });

Tenant.belongsTo(Plan, { foreignKey: "plan_id" });
Plan.hasMany(Tenant, { foreignKey: "plan_id" });

// User & Role
User.belongsTo(Role, { foreignKey: "role_id" });
Role.hasMany(User, { foreignKey: "role_id" });

// User & Tenant
User.belongsTo(Tenant, { foreignKey: "tenant_id" });
Tenant.hasMany(User, { foreignKey: "tenant_id" });

// Table & Tenant
Table.belongsTo(Tenant, { foreignKey: "tenant_id" });
Tenant.hasMany(Table, { foreignKey: "tenant_id" });

// MenuItem & Tenant
MenuItem.belongsTo(Tenant, { foreignKey: "tenant_id" });
Tenant.hasMany(MenuItem, { foreignKey: "tenant_id" });

// Order & Tenant
Order.belongsTo(Tenant, { foreignKey: "tenant_id" });
Tenant.hasMany(Order, { foreignKey: "tenant_id" });

// Order & User
Order.belongsTo(User, { foreignKey: "created_by" });
User.hasMany(Order, { foreignKey: "created_by" });

// Order & Table
Order.belongsTo(Table, { foreignKey: "table_id" });
Table.hasMany(Order, { foreignKey: "table_id" });

// Order & OrderItem
Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

// OrderItem & MenuItem
OrderItem.belongsTo(MenuItem, { foreignKey: "menu_item_id" });
MenuItem.hasMany(OrderItem, { foreignKey: "menu_item_id" });

// Inventory System Associations

// Ingredient & Tenant
Ingredient.belongsTo(Tenant, { foreignKey: "tenant_id" });
Tenant.hasMany(Ingredient, { foreignKey: "tenant_id" });

// Ingredient & MenuItem (For display/allergens, separate from Recipe)
Ingredient.belongsToMany(MenuItem, {
  through: "menu_item_ingredients",
  foreignKey: "ingredient_id",
  timestamps: false,
});
MenuItem.belongsToMany(Ingredient, {
  through: "menu_item_ingredients",
  foreignKey: "menu_item_id",
  timestamps: false,
});

// StockTransaction & Ingredient
StockTransaction.belongsTo(Ingredient, { foreignKey: "ingredient_id" });
Ingredient.hasMany(StockTransaction, { foreignKey: "ingredient_id" });

// Recipe & MenuItem
Recipe.belongsTo(MenuItem, { foreignKey: "menu_item_id" });
MenuItem.hasOne(Recipe, { foreignKey: "menu_item_id" });

// Recipe & RecipeItem
Recipe.hasMany(RecipeItem, { foreignKey: "recipe_id" });
RecipeItem.belongsTo(Recipe, { foreignKey: "recipe_id" });

// RecipeItem & Ingredient
RecipeItem.belongsTo(Ingredient, { foreignKey: "ingredient_id" });
Ingredient.hasMany(RecipeItem, { foreignKey: "ingredient_id" });

const models = {
  Tenant,
  Plan,
  Role,
  User,
  Table,
  MenuItem,
  Order,
  OrderItem,
  Ingredient,
  Recipe,
  RecipeItem,
  StockTransaction,
  Notification,
  Otp,
};

export default models;
