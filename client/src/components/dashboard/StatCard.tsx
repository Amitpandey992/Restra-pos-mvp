import React from "react";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color?: "emerald" | "blue" | "amber" | "red";
  isProgress?: boolean;
}

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = "emerald",
  isProgress = false,
}: StatCardProps) => {
  const colorStyles = {
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      badge: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-500",
      badge: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    },
    red: {
      bg: "bg-red-500/10",
      text: "text-red-500",
      badge: "bg-red-500/10 text-red-500 border-red-500/20",
    },
  };

  const currentStyle = colorStyles[color];

  return (
    <div className="glass-card p-6 rounded-3xl transition-transform hover:-translate-y-1 duration-300">
      <div className="flex items-center justify-between mb-4">
        <div
          className={clsx(
            "w-12 h-12 rounded-2xl flex items-center justify-center",
            currentStyle.bg,
            currentStyle.text,
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <span
            className={clsx(
              "text-xs font-semibold px-2.5 py-1 rounded-full border",
              currentStyle.badge,
            )}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
        {title}
      </p>
      <h3 className="text-3xl font-display font-bold text-slate-800 dark:text-white">
        {value}
      </h3>
      {isProgress && (
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
          <div className="bg-amber-500 h-full w-[85%] rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
