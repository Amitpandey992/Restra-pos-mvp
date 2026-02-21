import React from "react";
import { Archive, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getInventoryItems } from "../../api/inventoryApi";
import { useNavigate } from "react-router-dom";

const LowStockAlerts = () => {
  const navigate = useNavigate();
  const { data: inventoryResponse, isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => getInventoryItems({ limit: 100 }), // Fetch enough to filter
  });

  const allItems = inventoryResponse?.data?.items || [];
  const lowStockItems = allItems
    .filter((item) => item.current_stock <= item.min_stock_level)
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/5 shadow-sm overflow-hidden mt-8">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-red-50/50 dark:bg-red-950/10">
        <h2 className="text-sm font-bold text-red-600 flex items-center gap-2 uppercase tracking-tight">
          <AlertCircle className="w-4 h-4" />
          Critical Inventory
        </h2>
        <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
          {lowStockItems.length}
        </span>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {isLoading ? (
          <div className="p-4 text-center text-xs text-slate-400">
            Loading...
          </div>
        ) : lowStockItems.length === 0 ? (
          <div className="p-4 text-center text-xs text-emerald-500 font-bold">
            All Stock Levels Optimal
          </div>
        ) : (
          lowStockItems.map((item, i) => (
            <div
              key={i}
              className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  {item.name}
                </p>
                <p className="text-xs text-slate-500">
                  Min: {item.min_stock_level} {item.recipe_unit || item.unit}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-red-600">
                  {item.current_stock} {item.recipe_unit || item.unit} left
                </p>
                <button
                  onClick={() => navigate("/inventory")} // Go to inventory page to adjust
                  className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold mt-1 hover:bg-primary hover:text-white transition-colors"
                >
                  Refill
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LowStockAlerts;
