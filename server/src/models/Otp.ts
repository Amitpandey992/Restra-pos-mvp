import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcryptjs";

interface OtpAttributes {
  id: string;
  email: string;
  otp_hash: string;
  expires_at: Date;
  attempts: number;
  last_resend_at?: Date;
}

interface OtpCreationAttributes extends Optional<
  OtpAttributes,
  "id" | "last_resend_at"
> {}

class Otp
  extends Model<OtpAttributes, OtpCreationAttributes>
  implements OtpAttributes
{
  public id!: string;
  public email!: string;
  public otp_hash!: string;
  public expires_at!: Date;
  public attempts!: number;
  public last_resend_at!: Date;

  public async isOtpMatch(otp: string): Promise<boolean> {
    return await bcrypt.compare(otp, this.otp_hash);
  }
}

Otp.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_resend_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "otps",
    timestamps: true,
  },
);

export default Otp;
