import React, { useState } from "react";
import ReportStats from "../components/reports/ReportStats";
import SalesChart from "../components/reports/SalesChart";
import { Calendar, Monitor, Smartphone, Watch, Headphones } from "lucide-react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getTopSellingItems } from "../api/dashboardApi";

const TopItems = ({ items = [] }) => {
  if (items.length === 0)
    return (
      <div className="p-8 bg-white dark:bg-slate-900 rounded-xl text-center text-slate-500">
        No top items data
      </div>
    );

  const maxSold = Math.max(...items.map((i) => i.totalQuantity), 1);

  return (
    <div className="flex flex-col gap-6 rounded-xl p-8 bg-white dark:bg-slate-900 border border-primary/10 shadow-sm">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          Top Items
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Highest performing products
        </p>
      </div>
      <div className="flex flex-col gap-6 mt-4">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-800 dark:text-white">
                {item.MenuItem?.name || "Unknown"}
              </span>
              <span className="text-primary">{item.totalQuantity} sold</span>
            </div>
            <div className="w-full bg-primary/5 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(item.totalQuantity / maxSold) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full py-3 rounded-full border border-primary/20 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all">
        View All Products
      </button>
    </div>
  );
};

const Reports = () => {
  const [timeframe, setTimeframe] = useState("Today");

  const { data: statsResponse, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats", timeframe],
    queryFn: getDashboardStats,
  });

  const { data: topItemsResponse, isLoading: itemsLoading } = useQuery({
    queryKey: ["topSellingItems", timeframe],
    queryFn: getTopSellingItems,
  });

  const stats = statsResponse?.data || {
    sales: 0,
    orders: 0,
    activeTables: "0/0",
    lowStock: 0,
  }; // sales, orders
  const topItems = topItemsResponse?.data || [];

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen">
      <main className="flex-1 px-4 md:px-8 py-6 md:py-8 gap-6 md:gap-8 max-w-[1600px] mx-auto w-full flex flex-col">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Data Insights
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider">
              Performance & Engagement
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex p-1 bg-white dark:bg-slate-900 rounded-full border border-primary/10 w-fit shadow-sm overflow-x-auto no-scrollbar">
            {["Today", "Yesterday", "Last 7 Days"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={clsx(
                  "h-10 px-4 md:px-6 rounded-full text-xs md:text-sm font-black transition-all whitespace-nowrap uppercase tracking-tight",
                  timeframe === t
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <ReportStats stats={stats} />

        {/* Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>
          <div className="lg:col-span-1">
            {itemsLoading ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 flex items-center justify-center border border-primary/5">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <TopItems items={topItems} />
            )}
          </div>
        </div>

        {/* Upsell Banner */}
        {/* <div className="rounded-2xl p-6 md:p-10 bg-primary text-white flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 overflow-hidden relative shadow-2xl shadow-primary/30">
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black leading-tight">
              Unlock deeper analytics
            </h3>
            <p className="text-white/80 mt-2 max-w-md font-medium text-sm md:text-base">
              Get advanced forecasting and customer segmentation tools to drive
              growth.
            </p>
            <button className="mt-8 px-10 py-4 bg-white text-primary rounded-full font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest">
              Upgrade to Premium
            </button>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none hidden md:block">
            <Calendar className="w-64 h-64 absolute -right-10 -bottom-10" />
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default Reports;
