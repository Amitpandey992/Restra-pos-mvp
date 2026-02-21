import React from "react";
import { TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTopSellingItems } from "../../api/dashboardApi";

const TopSellingItems = () => {
  const { data: topItemsResponse, isLoading } = useQuery({
    queryKey: ["topSellingItems"],
    queryFn: getTopSellingItems,
  });

  const items = topItemsResponse?.data || [];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/5 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <TrendingUp className="text-primary w-5 h-5" />
          Top Selling Items
        </h2>
      </div>
      <div className="p-6 flex-1 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-slate-500 text-sm">
            No sales data yet.
          </p>
        ) : (
          items.map((item, index) => (
            <div key={index} className="relative group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${item.MenuItem?.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=150&fit=crop"}')`,
                    }}
                  ></div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">
                      {item.MenuItem?.name || "Unknown Item"}
                    </p>
                    <p className="text-xs text-slate-500 italic">
                      {item.MenuItem?.description?.substring(0, 30)}...
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 dark:text-white">
                    {item.totalQuantity} Sold
                  </p>
                  <p className="text-xs text-emerald-500">
                    ₹{Number(item.totalRevenue).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-1000"
                  style={{
                    width: `${Math.min(100, (item.totalQuantity / (items[0]?.totalQuantity || 1)) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopSellingItems;
