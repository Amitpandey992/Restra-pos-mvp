import React, { useMemo } from "react";
import clsx from "clsx";

const STATUS_FILTERS = [
  { id: "all", label: "All Tables", color: "bg-primary text-white" },
  {
    id: "available",
    label: "Available",
    color: "bg-status-available",
    count: 6,
  },
  { id: "occupied", label: "Occupied", color: "bg-status-occupied", count: 4 },
  { id: "cleaning", label: "Cleaning", color: "bg-status-cleaning", count: 2 },
];

const TableFilters = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      {STATUS_FILTERS.map((filter) => {
        const isActive = activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={clsx(
              "flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors border",
              isActive
                ? "bg-primary text-white border-primary"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/50",
            )}
          >
            {filter.id !== "all" && (
              <div className={clsx("size-2 rounded-full", filter.color)}></div>
            )}
            <span>{filter.label}</span>
            {filter.count && (
              <span
                className={clsx(
                  "px-2 py-0.5 rounded-full text-xs ml-1",
                  isActive ? "bg-white/20" : "bg-slate-100 dark:bg-slate-700",
                )}
              >
                {filter.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TableFilters;
