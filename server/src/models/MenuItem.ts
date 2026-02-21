import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Tenant from "./Tenant";

interface MenuItemAttributes {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  price: number;
  category: "starters" | "main_course" | "desserts" | "drinks";
  type: "veg" | "non-veg" | "drink";
  status: "available" | "unavailable";
  image_url?: string;
  ingredients?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface MenuItemCreationAttributes extends Optional<
  MenuItemAttributes,
  "id"
> {}

class MenuItem
  extends Model<MenuItemAttributes, MenuItemCreationAttributes>
  implements MenuItemAttributes
{
  public id!: string;
  public tenant_id!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public category!: "starters" | "main_course" | "desserts" | "drinks";
  public type!: "veg" | "non-veg" | "drink";
  public status!: "available" | "unavailable";
  public image_url!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MenuItem.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("veg", "non-veg", "drink"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("available", "unavailable"),
      defaultValue: "available",
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "menu_items",
  },
);

export default MenuItem;
