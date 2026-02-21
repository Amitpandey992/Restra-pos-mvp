import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getSalesChart } from "../../api/dashboardApi";

const SalesChart = () => {
  const { data: chartResponse, isLoading } = useQuery({
    queryKey: ["salesChart"],
    queryFn: getSalesChart,
  });

  const rawData = chartResponse?.data || [];

  // Fill missing days for last 7 days
  const data = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const found = rawData.find((item) => item.date === dateStr);

    data.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      sales: found ? Number(found.sales) : 0,
      date: dateStr,
    });
  }

  const maxVal = Math.max(...data.map((d) => d.sales), 100);
  const width = 500;
  const height = 150;
  const stepX = width / (data.length - 1 || 1);

  // Create points for polyline
  const points = data
    .map((d, i) => {
      const x = i * stepX;
      const y = height - (d.sales / maxVal) * height; // Invert Y
      return `${x},${y}`;
    })
    .join(" ");

  // Create area path
  const areaPath = `M0,${height} ${points
    .split(" ")
    .map((p) => `L${p}`)
    .join(" ")} L${width},${height} Z`;

  return (
    <div className="lg:col-span-2 flex flex-col gap-6 rounded-xl p-8 bg-white dark:bg-slate-900 border border-primary/10 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Daily Sales
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Revenue trends over the last 7 days
          </p>
        </div>
        <button className="text-primary hover:bg-primary/5 p-2 rounded-full transition-colors">
          More
        </button>
      </div>

      <div className="relative h-[300px] w-full mt-4 flex flex-col justify-end">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <svg
              className="w-full h-[80%]"
              preserveAspectRatio="none"
              viewBox={`0 0 ${width} ${height}`}
            >
              <defs>
                <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop
                    offset="0%"
                    stopColor="#4051b5"
                    stopOpacity="0.2"
                  ></stop>
                  <stop
                    offset="100%"
                    stopColor="#4051b5"
                    stopOpacity="0"
                  ></stop>
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#gradient)"></path>
              <polyline
                points={points}
                fill="none"
                stroke="#4051b5"
                strokeLinecap="round"
                strokeWidth="4"
              ></polyline>
              {data.map((d, i) => (
                <circle
                  key={i}
                  cx={i * stepX}
                  cy={height - (d.sales / maxVal) * height}
                  fill="#4051b5"
                  r="4"
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </svg>
            <div className="flex justify-between mt-4 px-2">
              {data.map((item, i) => (
                <span
                  key={i}
                  className="text-xs font-bold text-slate-400 uppercase"
                >
                  {item.day}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SalesChart;
