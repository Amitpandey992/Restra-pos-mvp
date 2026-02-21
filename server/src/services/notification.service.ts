import { Server } from "socket.io";
import Notification from "../models/Notification";
import User from "../models/User";
import { Op } from "sequelize";

export const notifyUsers = async (
  io: Server,
  tenantId: string,
  payload: {
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    link?: string;
    role?: string; // Opt: Send to specific role (e.g. only WAITER)
  },
) => {
  try {
    // 1. Find Recipients
    const where: any = {
      tenant_id: tenantId,
      is_active: true,
    };

    // If role specified, filter by role
    // Need to join Role model ideally
    // For MVP, just send to all users in tenant for simplicity
    // Or fetch users with that role

    // Actually, let's fetch ALL users in tenant for now (or filter by role if needed)
    // A robust system would filter by permissions.
    const users = await User.findAll({
      where,
      attributes: ["id"],
    });

    if (!users.length) return;

    // 2. Create Notifications in DB
    const notificationsData = users.map((user) => ({
      tenant_id: tenantId,
      user_id: user.id,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      link: payload.link,
      is_read: false,
    }));

    await Notification.bulkCreate(notificationsData);

    // 3. Emit Real-time Event
    // We can emit to 'tenantId' room, but frontend needs to filter?
    // Or we emit generic 'notification:new' and let frontend fetch?
    // "notification:new" implies "Hey, check your inbox".
    io.to(tenantId).emit("notification:new", {
      title: payload.title,
      message: payload.message,
      type: payload.type,
    });
  } catch (error) {
    console.error("Notification Error:", error);
  }
};
