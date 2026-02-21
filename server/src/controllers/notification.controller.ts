import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import Notification from "../models/Notification";
import { ApiError } from "../utils/ApiError";

export const getNotifications = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;
    const { page = 1, limit = 20, unreadOnly } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {
      tenant_id: tenantId,
      user_id: userId,
    };

    if (unreadOnly === "true") {
      where.is_read = false;
    }

    const { count, rows } = await Notification.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    // Also get unread count
    const unreadCount = await Notification.count({
      where: {
        tenant_id: tenantId,
        user_id: userId,
        is_read: false,
      },
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          total: count,
          items: rows,
          unreadCount,
          page: Number(page),
          totalPages: Math.ceil(count / Number(limit)),
        },
        "Notifications fetched",
      ),
    );
  },
);

export const markAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: { id, tenant_id: tenantId, user_id: userId },
    });

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    notification.is_read = true;
    await notification.save();

    res.status(200).json(new ApiResponse(200, null, "Marked as read"));
  },
);

export const markAllAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const userId = req.user.id;

    await Notification.update(
      { is_read: true },
      {
        where: {
          tenant_id: tenantId,
          user_id: userId,
          is_read: false,
        },
      },
    );

    res.status(200).json(new ApiResponse(200, null, "All marked as read"));
  },
);
