import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface PlanAttributes {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  features: any; // { room_booking: boolean, ... }
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PlanCreationAttributes extends Optional<PlanAttributes, "id"> {}

class Plan
  extends Model<PlanAttributes, PlanCreationAttributes>
  implements PlanAttributes
{
  public id!: string;
  public name!: string;
  public price!: number;
  public duration_days!: number;
  public features!: any;
  public is_active!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Plan.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    duration_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: "Manage feature flags like ROOM_BOOKING",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "plans",
  },
);

export default Plan;
