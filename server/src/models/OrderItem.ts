import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Order from "./Order";
import MenuItem from "./MenuItem";

interface OrderItemAttributes {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price: number;
  notes?: string;
  status: "pending" | "preparing" | "served";
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderItemCreationAttributes extends Optional<
  OrderItemAttributes,
  "id"
> {}

class OrderItem
  extends Model<OrderItemAttributes, OrderItemCreationAttributes>
  implements OrderItemAttributes
{
  public id!: string;
  public order_id!: string;
  public menu_item_id!: string;
  public quantity!: number;
  public price!: number;
  public notes!: string;
  public status!: "pending" | "preparing" | "served";

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
    },
    menu_item_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: MenuItem,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "preparing", "served"),
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    tableName: "order_items",
  },
);

export default OrderItem;
