import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcryptjs";

interface UserAttributes {
  id: string;
  full_name: string;
  email: string;
  password?: string;
  role_id: string;
  tenant_id: string | null; // Nullable for Platform admins
  is_active: boolean;
  is_verified: boolean;
  created_by?: string;
  last_login?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public full_name!: string;
  public email!: string;
  public password!: string;
  public role_id!: string;
  public tenant_id!: string | null;
  public is_active!: boolean;
  public is_verified!: boolean;
  public created_by!: string;
  public last_login!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly Role?: any;
  public readonly Tenant?: any;

  // Helper method for checking password
  public async isPasswordMatch(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false, // Enforced for tenant isolation
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true, // Optional for those registered directly
    },
    last_login: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: "users",
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  },
);

export default User;
