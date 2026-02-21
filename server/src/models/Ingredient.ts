import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Tenant from "./Tenant";

interface IngredientAttributes {
  id: string;
  tenant_id: string;
  name: string;
  unit: string; // The base unit, keeping for backward compatibility if needed temporarily
  purchase_unit: string; // e.g., 'Kg', 'Liter', 'Pack'
  recipe_unit: string; // e.g., 'Gram', 'Milliliter', 'Piece'
  conversion_factor: number; // e.g., 1 Kg = 1000 Grams (conversion factor = 1000)
  cost_per_unit: number; // Cost per purchase_unit
  current_stock: number; // Stored in recipe_unit
  min_stock_level: number; // Stored in recipe_unit
  createdAt?: Date;
  updatedAt?: Date;
}

interface IngredientCreationAttributes extends Optional<
  IngredientAttributes,
  "id"
> {}

class Ingredient
  extends Model<IngredientAttributes, IngredientCreationAttributes>
  implements IngredientAttributes
{
  public id!: string;
  public tenant_id!: string;
  public name!: string;
  public unit!: string; // Deprecate later
  public purchase_unit!: string;
  public recipe_unit!: string;
  public conversion_factor!: number;
  public cost_per_unit!: number;
  public current_stock!: number;
  public min_stock_level!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Ingredient.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Tenant,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., 'kg', 'l', 'pcs' -- Keeping for now but making true to not break old things if they insert without it while migrating
      defaultValue: "pcs",
    },
    purchase_unit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pcs", // e.g., 'Kg'
    },
    recipe_unit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pcs", // e.g., 'Grams'
    },
    conversion_factor: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1, // e.g., 1000
    },
    cost_per_unit: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0, // Cost per purchase unit
    },
    current_stock: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0, // Current stock in recipe units
    },
    min_stock_level: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0, // Minimum stock in recipe units
    },
  },
  {
    sequelize,
    tableName: "ingredients",
    indexes: [
      {
        fields: ["tenant_id"],
      },
    ],
  },
);

export default Ingredient;
