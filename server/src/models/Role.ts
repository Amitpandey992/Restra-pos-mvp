import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface RoleAttributes {
  id: string;
  name: string;
  description: string;
  permissions: any; // { "MANAGE_USERS": true, ... }
  createdAt?: Date;
  updatedAt?: Date;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, "id"> {}

class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  public id!: string;
  public name!: string;
  public description!: string;
  public permissions!: any;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING, // SUPER_ADMIN, OWNER, CASHIER, WAITER
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    permissions: {
      type: DataTypes.JSON, // For RBAC
      defaultValue: {},
    },
  },
  {
    sequelize,
    tableName: "roles",
  },
);

export default Role;
