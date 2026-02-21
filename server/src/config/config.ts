import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "restramvp_db",
    dialect: (process.env.DB_DIALECT || "mysql") as "mysql",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "default_secret_should_change",
    accessExpiration: "1d",
    refreshExpiration: "7d",
  },
  cors: {
    origin: "*",
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};
