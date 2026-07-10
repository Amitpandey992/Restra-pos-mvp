import { Sequelize } from "sequelize";
import { config } from "./config";

const sequelize = new Sequelize(
  config.db.name!,
  config.db.user!,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    logging: config.env === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection to database has been established successfully.");
    // Sync models (in development, alter: true is safer than force: true)
    if (config.env === "development") {
      await sequelize.sync({ alter: true });
      console.log("✅ Database synchronized");
    }
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
};

export default sequelize;
