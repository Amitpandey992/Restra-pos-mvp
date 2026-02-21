import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import User from "../models/User";
import Table from "../models/Table";
import MenuItem from "../models/MenuItem";
import Order from "../models/Order";
import { Op } from "sequelize";
import { tenantScope } from "../utils/tenantSecurity";

export const globalSearch = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { q } = req.query;
    const tenantId = req.user.tenantId;

    if (!q || typeof q !== "string") {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            users: [],
            tables: [],
            items: [],
            orders: [],
          },
          "Empty query",
        ),
      );
    }

    const searchQuery = `%${q}%`;

    // Parallel search across entities
    const [users, tables, items, orders] = await Promise.all([
      // 1. Search Staff
      User.findAll({
        ...tenantScope(tenantId, {
          [Op.or]: [
            { full_name: { [Op.like]: searchQuery } },
            { email: { [Op.like]: searchQuery } },
          ],
        }),
        limit: 5,
        attributes: ["id", "full_name", "email"],
      }),

      // 2. Search Tables
      Table.findAll({
        ...tenantScope(tenantId, {
          name: { [Op.like]: searchQuery },
        }),
        limit: 5,
        attributes: ["id", "name", "status"],
      }),

      // 3. Search Menu Items
      MenuItem.findAll({
        ...tenantScope(tenantId, {
          [Op.or]: [
            { name: { [Op.like]: searchQuery } },
            { description: { [Op.like]: searchQuery } },
          ],
        }),
        limit: 5,
        attributes: ["id", "name", "price", "image_url"],
      }),

      // 4. Search Orders (By ID)
      Order.findAll({
        ...tenantScope(tenantId, {
          id: { [Op.like]: searchQuery },
        }),
        limit: 5,
        attributes: ["id", "total_amount", "status", "createdAt"],
      }),
    ]);

    const results = {
      users,
      tables,
      items,
      orders,
    };

    res
      .status(200)
      .json(new ApiResponse(200, results, "Search results fetched"));
  },
);
