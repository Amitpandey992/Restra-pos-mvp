import React from "react";
import { Activity, BarChart2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSalesChart } from "../../api/dashboardApi";

const DailyVolumeChart = () => {
  const { data: chartResponse, isLoading } = useQuery({
    queryKey: ["salesChart"],
    queryFn: getSalesChart,
  });

  const rawData = chartResponse?.data || [];

  // Fill missing days for last 7 days
  const data = [];
  const today = new Date();
  const maxVal = Math.max(...rawData.map((d) => Number(d.sales)), 1);

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const found = rawData.find((item) => item.date === dateStr); // Backend returns date string YYYY-MM-DD usually from fn('DATE')

    data.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      sales: found ? Number(found.sales) : 0,
      date: dateStr,
    });
  }

  // Recalculate maxVal based on processed data to be sure
  const chartMax = Math.max(...data.map((d) => d.sales), 100); // Minimum scale

  return (
    <div className="bg-primary text-white p-6 rounded-xl shadow-lg shadow-primary/20">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Daily Volume
      </h2>
      <div className="space-y-4">
        {isLoading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between h-32 gap-2">
              {data.map((item, index) => {
                const heightPercent = Math.max(
                  (item.sales / chartMax) * 100,
                  5,
                ); // Min 5% height
                return (
                  <div
                    key={index}
                    className="flex-1 bg-white/20 rounded-t-lg hover:bg-white/30 transition-colors relative group"
                    style={{ height: `${heightPercent}%` }}
                    title={`₹${item.sales}`}
                  >
                    {/* Tooltip on hover could go here, but using title for simple MVP */}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-70">
              {data.map((item, index) => (
                <span key={index}>{item.day}</span>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
        <div>
          <p className="text-xs opacity-80">Total Sales (7d)</p>
          <p className="text-lg font-bold">
            ₹{data.reduce((acc, curr) => acc + curr.sales, 0).toFixed(2)}
          </p>
        </div>
        <BarChart2 className="w-8 h-8 opacity-30" />
      </div>
    </div>
  );
};

export default DailyVolumeChart;
