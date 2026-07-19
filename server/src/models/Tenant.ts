import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface TenantAttributes {
  id: string; // This is the tenant_id
  name: string;
  plan_id: string | null; // FK to Plan
  subscription_end_date: Date;
  settings: any; // { currency: 'USD', logo: '...' }
  is_active: boolean; // Subscription active?
  createdAt?: Date;
  updatedAt?: Date;
}

interface TenantCreationAttributes extends Optional<TenantAttributes, "id"> {}

class Tenant
  extends Model<TenantAttributes, TenantCreationAttributes>
  implements TenantAttributes
{
  public id!: string;
  public name!: string;
  public plan_id!: string | null;
  public subscription_end_date!: Date;
  public settings!: any;
  public is_active!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Tenant.init(
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
    plan_id: {
      type: DataTypes.UUID,
      allowNull: true, // Initially might be trial
    },
    subscription_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    settings: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: "Settings like currency, timezone, logo",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Is subscription active?",
    },
  },
  {
    sequelize,
    tableName: "tenants",
  },
);

export default Tenant;
