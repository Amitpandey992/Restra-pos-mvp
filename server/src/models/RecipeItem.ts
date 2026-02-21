import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Recipe from "./Recipe";
import Ingredient from "./Ingredient";

interface RecipeItemAttributes {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number; // Qty per 1 unit of Menu Item
  createdAt?: Date;
  updatedAt?: Date;
}

interface RecipeItemCreationAttributes extends Optional<
  RecipeItemAttributes,
  "id"
> {}

class RecipeItem
  extends Model<RecipeItemAttributes, RecipeItemCreationAttributes>
  implements RecipeItemAttributes
{
  public id!: string;
  public recipe_id!: string;
  public ingredient_id!: string;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RecipeItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    recipe_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Recipe,
        key: "id",
      },
    },
    ingredient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Ingredient,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "recipe_items",
  },
);

export default RecipeItem;
