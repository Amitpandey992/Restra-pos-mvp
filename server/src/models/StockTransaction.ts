import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Ingredient from "./Ingredient";
import Tenant from "./Tenant";

interface StockTransactionAttributes {
  id: string;
  tenant_id: string;
  ingredient_id: string;
  quantity_change: number; // Positive (addition), Negative (deduction)
  type: "purchase" | "usage" | "adjustment" | "waste";
  reference_id?: string; // Order ID or Vendor Invoice ID
  reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StockTransactionCreationAttributes extends Optional<
  StockTransactionAttributes,
  "id"
> {}

class StockTransaction
  extends Model<StockTransactionAttributes, StockTransactionCreationAttributes>
  implements StockTransactionAttributes
{
  public id!: string;
  public tenant_id!: string;
  public ingredient_id!: string;
  public quantity_change!: number;
  public type!: "purchase" | "usage" | "adjustment" | "waste";
  public reference_id?: string;
  public reason?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

StockTransaction.init(
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
    ingredient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Ingredient,
        key: "id",
      },
    },
    quantity_change: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("purchase", "usage", "adjustment", "waste"),
      allowNull: false,
    },
    reference_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "stock_transactions",
    indexes: [
      { fields: ["tenant_id"] },
      { fields: ["ingredient_id"] },
      { fields: ["reference_id"] }, // Should index for lookup
    ],
  },
);

export default StockTransaction;
