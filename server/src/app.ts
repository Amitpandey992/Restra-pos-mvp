import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { ApiError } from "./utils/ApiError";
import { requestLogger } from "./middlewares/requestLogger";
import "./models";
import { Server } from "socket.io";
import http from "http";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust in production
    methods: ["GET", "POST"],
  },
});

// Make io accessible in routes
app.set("io", io);

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(requestLogger);
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

// Socket.io connection handler
import { socketAuthMiddleware } from "./middlewares/socketAuthMiddleware";

io.use((socket, next) => {
  socketAuthMiddleware(socket as any, next);
});

io.on("connection", (socket: any) => {
  console.log("Client connected:", socket.id);

  // Automatically join tenant room based on authenticated user
  if (socket.user && socket.user.tenantId) {
    const tenantId = socket.user.tenantId;
    socket.join(tenantId);
    console.log(
      `Socket ${socket.id} (User: ${socket.user.sub}) auto-joined tenant: ${tenantId}`,
    );
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Routes
app.use("/api/v1", routes);

// 404
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, "Not found"));
});

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app, httpServer, io };
export default app;
