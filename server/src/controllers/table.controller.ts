import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import Table from "../models/Table";
import Order from "../models/Order";
import { ApiError } from "../utils/ApiError";
import { tenantScope } from "../utils/tenantSecurity";
import { Op } from "sequelize";

export const createTable = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, capacity, location } = req.body;
    const tenant_id = req.user.tenantId;

    const table = await Table.create({
      name,
      capacity,
      location,
      tenant_id,
      status: "available",
    });

    res
      .status(201)
      .json(new ApiResponse(201, table, "Table created successfully"));
  },
);

export const getTables = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const tenant_id = req.user.tenantId;
    const { page = 1, limit = 50 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Table.findAndCountAll({
      ...tenantScope(tenant_id),
      include: [
        {
          model: Order,
          required: false,
          where: {
            status: {
              [Op.notIn]: ["completed", "cancelled"],
            },
          },
          limit: 1, // Only need one active order
        },
      ],
      distinct: true, // Important for correct count with include
      limit: Number(limit),
      offset,
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          total: count,
          items: rows,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
        "Tables fetched",
      ),
    );
  },
);

export const updateTable = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const tenant_id = req.user.tenantId;

    const table = await Table.findOne(tenantScope(tenant_id, { id }));

    if (!table) {
      throw new ApiError(404, "Table not found");
    }

    await table.update(req.body);

    res.status(200).json(new ApiResponse(200, table, "Table updated"));
  },
);

export const deleteTable = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const tenant_id = req.user.tenantId;

    const table = await Table.findOne(tenantScope(tenant_id, { id }));

    if (!table) {
      throw new ApiError(404, "Table not found");
    }

    await table.destroy();

    res.status(200).json(new ApiResponse(200, null, "Table deleted"));
  },
);
