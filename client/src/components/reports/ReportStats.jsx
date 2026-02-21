import React from "react";
import clsx from "clsx";
import {
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  RotateCcw,
} from "lucide-react";

const ReportMetricCard = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  iconColor,
}) => {
  const isPositive = trend === "up";

  return (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-900 border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">
          {title}
        </p>
        <Icon className={clsx("w-6 h-6", iconColor)} />
      </div>
      <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">
        {value}
      </p>
      <div className="flex items-center gap-1 mt-1">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-emerald-500" />
        ) : (
          <TrendingDown className="w-4 h-4 text-rose-500" />
        )}
        <p
          className={clsx(
            "text-sm font-bold",
            isPositive ? "text-emerald-500" : "text-rose-500",
          )}
        >
          {change}
        </p>
      </div>
    </div>
  );
};

const ReportStats = ({ stats = {} }) => {
  const orders = Number(stats.orders) || 0;
  const sales = Number(stats.sales) || 0;
  const avgOrderValue = orders > 0 ? (sales / orders).toFixed(2) : "0.00";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ReportMetricCard
        title="Order Count"
        value={orders}
        change="Today"
        trend="up"
        icon={ShoppingBag}
        iconColor="text-primary"
      />
      <ReportMetricCard
        title="Avg Order Value"
        value={`₹${avgOrderValue}`}
        change="Calculated"
        trend="up"
        icon={CreditCard}
        iconColor="text-primary"
      />
      <ReportMetricCard
        title="Total Revenue"
        value={`₹${sales.toFixed(2)}`}
        change="Today"
        trend="up"
        icon={DollarSign}
        iconColor="text-emerald-500"
      />
      <ReportMetricCard
        title="Active Tables"
        value={stats.activeTables || "0/0"}
        change="Current occupancy"
        trend="neutral"
        icon={RotateCcw}
        iconColor="text-amber-500"
      />
    </div>
  );
};

export default ReportStats;
