import app, { httpServer } from "./app";
import { config } from "./config/config";
import { connectDB } from "./config/database";

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(config.port, () => {
      // eslint-disable-next-line
      console.log(
        `✅ Server running on port ${config.port} in ${config.env} mode`,
      );
    });
  } catch (error) {
    // eslint-disable-next-line
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
