import React, { useState } from "react";
import clsx from "clsx";
import { Filter, Download, Plus, Settings } from "lucide-react";

const Badge = ({ status }) => {
  switch (status) {
    case "In Stock":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          In Stock
        </span>
      );
    case "Low Stock":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
          Low Stock
        </span>
      );
    case "Out of Stock":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
          Out of Stock
        </span>
      );
    default:
      return null;
  }
};

const InventoryTable = ({ ingredients = [], onAddStock, onAdjustStock }) => {
  const getItemStatus = (item) => {
    if (item.current_stock <= 0) return "Out of Stock";
    if (item.current_stock <= item.min_stock_level) return "Low Stock";
    return "In Stock";
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-primary/5 flex justify-between items-center bg-white dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Ingredient Inventory
        </h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/10 text-sm font-medium text-slate-500 hover:bg-primary/5 dark:text-slate-400">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/10 text-sm font-medium text-slate-500 hover:bg-primary/5 dark:text-slate-400">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary/5 dark:bg-slate-800/50 text-primary dark:text-primary/90 text-sm font-semibold border-b border-primary/5">
              <th className="px-6 py-4 whitespace-nowrap">Ingredient</th>
              <th className="px-6 py-4 whitespace-nowrap">Current Stock</th>
              <th className="px-6 py-4 whitespace-nowrap">Min Stock</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">
                Status
              </th>
              <th className="px-6 py-4 whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5 dark:divide-slate-800">
            {ingredients.map((item) => {
              const status = getItemStatus(item);
              return (
                <tr
                  key={item.id}
                  className={clsx(
                    "hover:bg-primary/5 dark:hover:bg-slate-800/60 transition-colors group",
                    status === "Out of Stock"
                      ? "bg-red-50/20 hover:bg-red-50/50 dark:bg-red-900/5 dark:hover:bg-red-900/10"
                      : "",
                  )}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={clsx(
                          "size-10 rounded-full flex items-center justify-center transition-colors group-hover:bg-white dark:group-hover:bg-slate-800",
                          status === "Out of Stock"
                            ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-primary/5 text-primary",
                        )}
                      >
                        <span className="font-bold text-lg">
                          {(item.name || "I").charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-white font-semibold text-base">
                          {item.name}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">
                          {item.category || "General"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    className={clsx(
                      "px-6 py-5 font-bold text-base",
                      status === "Out of Stock"
                        ? "text-red-600"
                        : "text-slate-900 dark:text-white",
                    )}
                  >
                    {item.current_stock} {item.recipe_unit || item.unit}
                  </td>
                  <td className="px-6 py-5 text-slate-500 dark:text-slate-400 font-medium">
                    {item.min_stock_level} {item.recipe_unit || item.unit}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <Badge status={status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                      <button
                        onClick={() => onAddStock && onAddStock(item)}
                        className="h-9 px-4 rounded-full bg-primary/10 text-primary text-sm font-bold hover:bg-primary hover:text-white dark:hover:text-white transition-all"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => onAdjustStock && onAdjustStock(item)}
                        className="h-9 px-4 rounded-full border border-primary/10 text-slate-500 dark:text-slate-400 text-sm font-bold hover:bg-primary/5 transition-all"
                      >
                        Adjust
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-primary/5 flex items-center justify-between text-slate-500 dark:text-slate-400 text-sm font-medium">
        <p>Showing 4 of 124 ingredients</p>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-full border border-primary/10 hover:bg-primary/5 disabled:opacity-50 transition-colors"
            disabled
          >
            Previous
          </button>
          <button className="px-4 py-2 rounded-full border border-primary/10 hover:bg-primary/5 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
