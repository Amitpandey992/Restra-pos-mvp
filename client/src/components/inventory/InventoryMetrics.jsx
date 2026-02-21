import React from "react";
import clsx from "clsx";
import { ListChecks, AlertTriangle, AlertCircle } from "lucide-react";

const MetricCard = ({ title, value, change, trend, icon: Icon, color }) => {
  const colorStyles = {
    primary: { bg: "bg-primary/10", text: "text-primary" },
    amber: {
      bg: "bg-amber-100 dark:bg-amber-900/20",
      text: "text-amber-600 dark:text-amber-500",
    },
    red: {
      bg: "bg-red-100 dark:bg-red-900/20",
      text: "text-red-600 dark:text-red-500",
    },
  };

  const style = colorStyles[color] || colorStyles.primary;
  const isPositive = trend === "up";

  return (
    <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-primary/5">
      <div className="flex items-center gap-3">
        <div className={clsx("p-2 rounded-full", style.bg)}>
          <Icon className={clsx("w-6 h-6", style.text)} />
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {title}
        </p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-slate-900 dark:text-white text-3xl font-bold">
          {value}
        </p>
        <span
          className={clsx(
            "text-sm font-semibold",
            isPositive ? "text-emerald-600" : "text-red-600",
          )}
        >
          {change}
        </span>
      </div>
    </div>
  );
};

const InventoryMetrics = ({ total = 0, low = 0, outOfStock = 0 }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <MetricCard
        title="Total Items"
        value={total}
        change="+2%"
        trend="up"
        icon={ListChecks}
        color="primary"
      />
      <MetricCard
        title="Low Stock Items"
        value={low}
        change="+1%"
        trend="up"
        icon={AlertTriangle}
        color="amber"
      />
      <MetricCard
        title="Out of Stock"
        value={outOfStock}
        change="-5%"
        trend="down"
        icon={AlertCircle}
        color="red"
      />
    </div>
  );
};

export default InventoryMetrics;
