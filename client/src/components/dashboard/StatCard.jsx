import React from "react";
import clsx from "clsx";
import {
  TrendingUp,
  ShoppingBag,
  Loader,
  AlertTriangle,
  CreditCard,
  BarChart2,
  Grid,
  AlertCircle,
} from "lucide-react";

const StatCard = ({ title, value, change, icon: Icon, color, isProgress }) => {
  const colorStyles = {
    emerald: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-600 dark:text-emerald-400",
      badge: "bg-emerald-50 text-emerald-600",
    },
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
      badge: "bg-blue-50 text-blue-600",
    },
    amber: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-600 dark:text-amber-400",
      badge: "bg-slate-50 text-slate-500", // For "60% Full" text
    },
    red: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400",
      badge: "bg-red-50 text-red-600",
    },
  };

  const currentStyle = colorStyles[color] || colorStyles.emerald;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={clsx("p-2 rounded-lg", currentStyle.bg, currentStyle.text)}
        >
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <span
            className={clsx(
              "text-xs font-bold px-2 py-1 rounded-full",
              currentStyle.badge,
            )}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
        {title}
      </p>
      <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
        {value}
      </h3>
      {isProgress && (
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
          <div className="bg-amber-500 h-full w-[60%]"></div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
