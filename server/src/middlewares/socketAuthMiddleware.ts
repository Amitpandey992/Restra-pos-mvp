import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { ApiError } from "../utils/ApiError";

interface AuthenticatedSocket extends Socket {
  user?: any;
}

export const socketAuthMiddleware = (
  socket: AuthenticatedSocket,
  next: (err?: any) => void,
) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new ApiError(401, "Authentication error: Token required"));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new ApiError(401, "Authentication error: Invalid Token"));
  }
};
