import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Tenant from "./Tenant";
import Table from "./Table";
import User from "./User";

import OrderItem from "./OrderItem";

interface OrderAttributes {
  id: string;
  tenant_id: string;
  table_id?: string;
  status: "pending" | "preparing" | "served" | "completed" | "cancelled";
  total_amount: number;
  payment_status: "pending" | "paid" | "partially_paid";
  payment_method?: "cash" | "card" | "upi" | "split";
  created_by: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: string;
  public tenant_id!: string;
  public table_id!: string;
  public status!:
    | "pending"
    | "preparing"
    | "served"
    | "completed"
    | "cancelled";
  public total_amount!: number;
  public payment_status!: "pending" | "paid" | "partially_paid";
  public payment_method!: "cash" | "card" | "upi" | "split";
  public created_by!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public OrderItems?: OrderItem[];
}

Order.init(
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
    table_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Table, // Ensure Table is imported or string reference works if using 'tables'
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "preparing",
        "served",
        "completed",
        "cancelled",
      ),
      defaultValue: "pending",
    },
    total_amount: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "partially_paid"),
      defaultValue: "pending",
    },
    payment_method: {
      type: DataTypes.ENUM("cash", "card", "upi", "split"),
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "orders",
  },
);

export default Order;
