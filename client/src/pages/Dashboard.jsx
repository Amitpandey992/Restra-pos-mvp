import React from "react";
import StatCard from "../components/dashboard/StatCard";
import TopSellingItems from "../components/dashboard/TopSellingItems";
import DailyVolumeChart from "../components/dashboard/DailyVolumeChart";
import LowStockAlerts from "../components/dashboard/LowStockAlerts";
import ActiveTables from "../components/dashboard/ActiveTables";
import { CreditCard, Receipt, Grid, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../api/dashboardApi";

const Dashboard = () => {
  const { data: statsResponse, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  const stats = statsResponse?.data || {
    sales: 0,
    orders: 0,
    activeTables: "0/0",
    lowStock: 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <>
      <main className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Today Sales"
            value={`₹${Number(stats.sales).toFixed(2)}`}
            change="+0%"
            icon={CreditCard}
            color="emerald"
          />
          <StatCard
            title="Total Orders"
            value={stats.orders}
            change="Today"
            icon={Receipt}
            color="blue"
          />
          <StatCard
            title="Active Tables"
            value={stats.activeTables}
            change="Occupied"
            icon={Grid}
            color="amber"
            isProgress={false}
          />
          <StatCard
            title="Low Stock Alerts"
            value={stats.lowStock}
            change="Urgent"
            icon={AlertTriangle}
            color="red"
          />
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          {/* Top Selling Items (Span 2) */}
          <div className="xl:col-span-2">
            <TopSellingItems />
          </div>

          {/* Side Widgets (Span 1) */}
          <div className="xl:col-span-1 flex flex-col gap-6 md:gap-8">
            <DailyVolumeChart />
            <LowStockAlerts />
          </div>
        </div>

        {/* Active Tables Grid */}
        <div className="pb-12">
          <ActiveTables />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
