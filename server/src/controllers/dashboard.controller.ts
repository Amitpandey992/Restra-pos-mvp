import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import Order from "../models/Order";
import Table from "../models/Table";
import Ingredient from "../models/Ingredient";
import OrderItem from "../models/OrderItem";
import MenuItem from "../models/MenuItem";
import { Op } from "sequelize";
import sequelize from "../config/database";
import { tenantScope } from "../utils/tenantSecurity";

export const getDashboardStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 1. Today's Sales & Orders
    const todayOrders = await Order.findAll({
      ...tenantScope(tenantId, {
        createdAt: { [Op.between]: [todayStart, todayEnd] },
        status: { [Op.ne]: "cancelled" },
      }),
      attributes: [
        [sequelize.fn("SUM", sequelize.col("total_amount")), "totalSales"],
        [sequelize.fn("COUNT", sequelize.col("id")), "totalOrders"],
      ],
    });

    let totalSales = 0;
    let totalOrdersCount = 0;

    if (todayOrders && todayOrders.length > 0) {
      const stats = (todayOrders[0] as any).dataValues;
      totalSales = Number(stats.totalSales || 0);
      totalOrdersCount = Number(stats.totalOrders || 0);
    }

    // 2. Active Tables
    const activeTables = await Table.count(
      tenantScope(tenantId, { status: "occupied" }),
    );
    const totalTables = await Table.count(tenantScope(tenantId));

    // 3. Low Stock Alerts
    const lowStockCount = await Ingredient.count(
      tenantScope(tenantId, {
        current_stock: { [Op.lte]: sequelize.col("min_stock_level") },
      }),
    );

    res.status(200).json(
      new ApiResponse(
        200,
        {
          sales: totalSales,
          orders: totalOrdersCount,
          activeTables: `${activeTables}/${totalTables}`,
          lowStock: lowStockCount,
        },
        "Dashboard stats fetched",
      ),
    );
  },
);

export const getTopSellingItems = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;

    const topItems = await OrderItem.findAll({
      attributes: [
        "menu_item_id",
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantity"],
        [
          sequelize.literal(
            "SUM(`OrderItem`.`quantity` * `OrderItem`.`price`)",
          ),
          "totalRevenue",
        ],
      ],
      include: [
        {
          model: Order,
          attributes: [],
          required: true,
          where: tenantScope(tenantId, { status: "completed" }).where,
        },
        {
          model: MenuItem,
          attributes: ["name", "image_url", "description"],
        },
      ],
      group: ["menu_item_id", "MenuItem.id"],
      order: [[sequelize.literal("totalQuantity"), "DESC"]],
      limit: 5,
    });

    res.status(200).json(new ApiResponse(200, topItems, "Top items fetched"));
  },
);

export const getSalesChart = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenantId = req.user.tenantId;
    const days = 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const salesData = await Order.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("SUM", sequelize.col("total_amount")), "sales"],
      ],
      ...tenantScope(tenantId, {
        createdAt: { [Op.gte]: startDate },
        status: "completed",
      }),
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
    });

    res
      .status(200)
      .json(new ApiResponse(200, salesData, "Sales chart fetched"));
  },
);
