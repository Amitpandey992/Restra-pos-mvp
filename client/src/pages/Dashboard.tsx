import React from "react";
import { motion } from "framer-motion";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.main 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-8 pb-12"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-slate-500 mt-1">Here's what's happening at your restaurant today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
            Export Report
          </button>
        </div>
      </motion.div>

      {/* KPI Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Today Sales"
          value={`₹${Number(stats.sales).toFixed(2)}`}
          change="+12.5%"
          icon={CreditCard}
          color="emerald"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders}
          change="+4.2%"
          icon={Receipt}
          color="blue"
        />
        <StatCard
          title="Active Tables"
          value={stats.activeTables}
          change="85%"
          icon={Grid}
          color="amber"
          isProgress={true}
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStock}
          change="Urgent"
          icon={AlertTriangle}
          color="red"
        />
      </motion.div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Top Selling Items (Span 2) */}
        <motion.div variants={itemVariants} className="xl:col-span-2 glass-card rounded-2xl overflow-hidden shadow-sm">
          <TopSellingItems />
        </motion.div>

        {/* Side Widgets (Span 1) */}
        <div className="xl:col-span-1 flex flex-col gap-6 md:gap-8">
          <motion.div variants={itemVariants} className="glass-card rounded-2xl overflow-hidden shadow-sm h-full">
            <DailyVolumeChart />
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card rounded-2xl overflow-hidden shadow-sm">
            <LowStockAlerts />
          </motion.div>
        </div>
      </div>

      {/* Active Tables Grid */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl overflow-hidden shadow-sm">
        <ActiveTables />
      </motion.div>
    </motion.main>
  );
};

export default Dashboard;
