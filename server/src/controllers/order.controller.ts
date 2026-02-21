import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import MenuItem from "../models/MenuItem";
import Table from "../models/Table";
import sequelize from "../config/database";
import * as inventoryService from "../modules/inventory/inventory.service";

import { tenantScope } from "../utils/tenantSecurity";
import { notifyUsers } from "../services/notification.service";

export const createOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { table_id, items } = req.body;
    const tenant_id = req.user.tenantId;
    const user_id = req.user.sub;

    const transaction = await sequelize.transaction();

    try {
      // 1. Calculate Total and Validate Items
      let total_amount = 0;
      const orderItemsData = [];

      for (const item of items) {
        // Secure lookup: Ensure menu item belongs to tenant
        const menuItem = await MenuItem.findOne(
          tenantScope(tenant_id, { id: item.menu_item_id }),
        );

        if (!menuItem) {
          throw new ApiError(400, `Menu Item ${item.menu_item_id} not found`);
        }

        total_amount += menuItem.price * item.quantity;
        orderItemsData.push({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price: menuItem.price,
          notes: item.notes,
          status: "pending",
        });
      }

      // 2. Validate Table Ownership
      if (table_id) {
        const table = await Table.findOne(
          tenantScope(tenant_id, { id: table_id }),
        );
        if (!table) {
          throw new ApiError(404, "Table not found");
        }
      }

      // 3. Create Order
      const order = await Order.create(
        {
          tenant_id,
          table_id,
          created_by: user_id,
          status: "pending",
          payment_status: "pending",
          total_amount,
        },
        { transaction },
      );

      // 4. Create Order Items
      for (const itemData of orderItemsData) {
        await OrderItem.create(
          {
            order_id: order.id,
            ...itemData,
            status: "pending",
          },
          { transaction },
        );
      }

      // 5. Update Table Status
      if (table_id) {
        await Table.update(
          { status: "occupied" },
          { where: { id: table_id, tenant_id }, transaction }, // Strict Tenant Check
        );
      }

      await transaction.commit();

      // Fetch full order with items
      const fullOrder = await Order.findOne({
        where: { id: order.id, tenant_id },
        include: [OrderItem],
      });

      // Real-time notification
      const io = req.app.get("io");
      if (io) {
        io.to(tenant_id).emit("order:new", fullOrder);
        if (table_id) {
          io.to(tenant_id).emit("table:update", {
            tableId: table_id,
            status: "occupied",
          });
        }

        // Create persistent key notifications
        await notifyUsers(io, tenant_id, {
          title: "New Order",
          message: `Order #${fullOrder!.id.slice(0, 8)} created`,
          type: "info",
          link: `/orders?orderId=${fullOrder!.id}`,
        });
      }

      res
        .status(201)
        .json(new ApiResponse(201, fullOrder, "Order created successfully"));
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  },
);

export const getOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const tenant_id = req.user.tenantId;

    const order = await Order.findOne({
      where: { id, tenant_id },
      include: [{ model: OrderItem, include: [MenuItem] }, { model: Table }],
    });

    if (!order) throw new ApiError(404, "Order not found");

    res.status(200).json(new ApiResponse(200, order, "Order fetched"));
  },
);

export const getOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenant_id = req.user.tenantId;
    const { status, table_id, page = 1, limit = 20 } = req.query;

    const where: any = { tenant_id };
    if (status) where.status = status;
    if (table_id) where.table_id = table_id;

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Order.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      include: [{ model: OrderItem, include: [MenuItem] }, { model: Table }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          total: count,
          orders: rows,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        "Orders fetched",
      ),
    );
  },
);

export const updateOrderStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const tenant_id = req.user.tenantId;

    const order = await Order.findOne({ where: { id, tenant_id } });
    if (!order) throw new ApiError(404, "Order not found");

    if (status) order.status = status;
    await order.save();

    const io = req.app.get("io");
    if (io) {
      io.to(tenant_id).emit("order:update", order);
    }

    res.status(200).json(new ApiResponse(200, order, "Order updated"));
  },
);

export const checkoutOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { payment_method } = req.body;
    const tenant_id = req.user.tenantId;

    const transaction = await sequelize.transaction();

    try {
      const order = await Order.findOne({
        where: { id: id as string, tenant_id },
      });
      if (!order) throw new ApiError(404, "Order not found");

      // Update Order
      order.status = "completed";
      order.payment_status = "paid";
      order.payment_method = payment_method || "cash";
      await order.save({ transaction });

      // Update Table
      if (order.table_id) {
        await Table.update(
          { status: "available" },
          { where: { id: order.table_id }, transaction },
        );
      }

      // Deduct Inventory Stock
      const orderWithItems = await Order.findOne({
        where: { id, tenant_id },
        include: [OrderItem],
        transaction,
      });

      if (orderWithItems && (orderWithItems as any).OrderItems) {
        const items = (orderWithItems as any).OrderItems.map((item: any) => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
        }));

        await inventoryService.deductStockForOrder(
          tenant_id,
          id as string,
          items,
          transaction,
        );
      }

      await transaction.commit();

      const io = req.app.get("io");
      if (io) {
        io.to(tenant_id).emit("order:update", order);
        if (order.table_id) {
          io.to(tenant_id).emit("table:update", {
            tableId: order.table_id,
            status: "available",
          });
        }
        io.to(tenant_id).emit("inventory:update", {});
      }

      res.status(200).json(new ApiResponse(200, order, "Order checked out"));
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  },
);
