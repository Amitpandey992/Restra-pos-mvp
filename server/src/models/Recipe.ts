import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Tenant from "./Tenant";
import MenuItem from "./MenuItem";

interface RecipeAttributes {
  id: string;
  tenant_id: string;
  menu_item_id: string;
  name?: string;
  instructions?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RecipeCreationAttributes extends Optional<RecipeAttributes, "id"> {}

class Recipe
  extends Model<RecipeAttributes, RecipeCreationAttributes>
  implements RecipeAttributes
{
  public id!: string;
  public tenant_id!: string;
  public menu_item_id!: string;
  public name?: string;
  public instructions?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Recipe.init(
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
    menu_item_id: {
      type: DataTypes.UUID, // Link directly to MenuItem
      allowNull: false,
      references: {
        model: MenuItem,
        key: "id",
      },
      unique: true, // One recipe per menu item for v1
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "recipes",
    indexes: [{ fields: ["tenant_id"] }, { fields: ["menu_item_id"] }],
  },
);

export default Recipe;
