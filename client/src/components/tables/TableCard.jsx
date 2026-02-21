import React from "react";
import clsx from "clsx";

const STATUS_CONFIG = {
  available: {
    color: "status-available",
    label: "Available",
    styles: {
      border: "border-status-available/20 hover:border-status-available",
      badge: "bg-status-available/10 text-status-available",
      text: "text-status-available",
    },
  },
  occupied: {
    color: "status-occupied",
    label: "Occupied",
    styles: {
      border: "border-status-occupied/20 hover:border-status-occupied",
      badge: "bg-status-occupied/10 text-status-occupied",
      text: "text-status-occupied",
    },
  },
  cleaning: {
    color: "status-cleaning",
    label: "Cleaning",
    styles: {
      border: "border-status-cleaning/20 hover:border-status-cleaning",
      badge: "bg-status-cleaning/10 text-status-cleaning",
      text: "text-status-cleaning",
    },
  },
};

const TableCard = ({ table, onSelect }) => {
  const { id, name, status, capacity, guests, time, orderTotal, eta } = table;
  const config = STATUS_CONFIG[status];

  return (
    <button
      onClick={() => onSelect(table)}
      className={clsx(
        "group flex flex-col bg-white dark:bg-slate-800 border-2 rounded-xl p-6 hover:shadow-xl transition-all text-left h-full min-h-[160px]",
        config.styles.border,
      )}
    >
      <div className="flex justify-between items-start mb-4 w-full">
        <span className="text-3xl font-black text-slate-800 dark:text-white">
          {name}
        </span>
        <span
          className={clsx(
            "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
            config.styles.badge,
          )}
        >
          {config.label}
        </span>
      </div>

      <div className="mt-auto w-full">
        {status === "available" && (
          <>
            <p className="text-slate-400 text-xs font-medium mb-1">
              Capacity: {capacity} Seats
            </p>
            <p className="text-primary text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open Order
            </p>
          </>
        )}

        {status === "occupied" && (
          <>
            <p className="text-slate-400 text-xs font-medium mb-1">
              Time: {time} • ₹{orderTotal}
            </p>
            <div className="flex -space-x-2">
              {/* Guest Avatars */}
              {[...Array(Math.min(guests, 2))].map((_, i) => (
                <div
                  key={i}
                  className="size-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200"
                />
              ))}
              {guests > 2 && (
                <div className="size-6 rounded-full border-2 border-white dark:border-slate-800 bg-primary/20 text-[10px] flex items-center justify-center font-bold text-primary">
                  +{guests - 2}
                </div>
              )}
            </div>
          </>
        )}

        {status === "cleaning" && (
          <div className="flex items-center gap-2">
            {/* Spinner using pure CSS/Tailwind */}
            <div
              className={clsx(
                "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin",
                config.styles.text,
              )}
            ></div>
            <p className="text-slate-400 text-xs font-medium italic">
              Estimated: {eta}
            </p>
          </div>
        )}
      </div>
    </button>
  );
};

export default TableCard;
