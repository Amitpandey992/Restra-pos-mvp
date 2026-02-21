import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface NotificationAttributes {
  id: string;
  tenant_id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  is_read: boolean;
  link?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NotificationCreationAttributes extends Optional<
  NotificationAttributes,
  "id" | "is_read"
> {}

class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: string;
  public tenant_id!: string;
  public user_id!: string;
  public title!: string;
  public message!: string;
  public type!: "info" | "success" | "warning" | "error";
  public is_read!: boolean;
  public link?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("info", "success", "warning", "error"),
      defaultValue: "info",
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "notifications",
  },
);

export default Notification;
