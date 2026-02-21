import React from "react";
import { Armchair, CheckCircle, Info } from "lucide-react";
import clsx from "clsx";

const ActiveTables = () => {
  const tables = [
    { id: "T-01", size: "4P", status: "occupied" },
    { id: "T-02", size: "2P", status: "occupied" },
    { id: "T-03", size: "2P", status: "available" },
    { id: "T-04", size: "6P", status: "billing" },
    { id: "T-05", size: "4P", status: "occupied" },
    { id: "T-06", size: "2P", status: "available" },
    { id: "T-07", size: "2P", status: "occupied" },
    { id: "T-08", size: "8P", status: "occupied" },
    { id: "T-09", size: "4P", status: "available" },
    { id: "T-10", size: "2P", status: "available" },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case "available":
        return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 dark:hover:bg-emerald-900/30";
      case "occupied":
        return "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20";
      case "billing":
        return "bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/20";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/5 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Armchair className="text-primary w-5 h-5" />
          Table Status Overview
        </h2>
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full text-[10px] font-bold uppercase transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/10 cursor-default">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
            Available
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full text-[10px] font-bold uppercase transition-colors hover:bg-primary/10 cursor-default">
            <span className="w-2 h-2 rounded-full bg-primary"></span> Occupied
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full text-[10px] font-bold uppercase transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/10 cursor-default">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Billing
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={clsx(
              "aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300",
              getStatusStyles(table.status),
            )}
          >
            <span className="text-xs font-bold opacity-70">{table.id}</span>
            <span className="text-lg font-bold">{table.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveTables;
