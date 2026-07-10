import { Sequelize } from "sequelize";
import { config } from "./config";

const sequelize = new Sequelize(
  config.db.name!,
  config.db.user!,
  config.db.password,
  {
    host: config.db.host,
    port: Number(config.db.port),
    dialect: "mysql",

    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
      },
    },

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
    console.log("✅ Connected to TiDB");

    if (config.env === "development") {
      await sequelize.sync();
      console.log("✅ Database synchronized");
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default sequelize;
