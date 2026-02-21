import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Tenant from "./Tenant";

interface TableAttributes {
  id: string;
  tenant_id: string;
  name: string;
  capacity: number;
  status: "available" | "occupied" | "reserved";
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TableCreationAttributes extends Optional<TableAttributes, "id"> {}

class Table
  extends Model<TableAttributes, TableCreationAttributes>
  implements TableAttributes
{
  public id!: string;
  public tenant_id!: string;
  public name!: string;
  public capacity!: number;
  public status!: "available" | "occupied" | "reserved";
  public location!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Table.init(
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
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 4,
    },
    status: {
      type: DataTypes.ENUM("available", "occupied", "reserved"),
      defaultValue: "available",
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "tables",
  },
);

export default Table;
