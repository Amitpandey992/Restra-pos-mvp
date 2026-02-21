import React from "react";
import { Plus, Edit } from "lucide-react";

const RecentActivity = () => {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold leading-tight tracking-tight mb-6 text-slate-800 dark:text-white">
        Recent Adjustments
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-primary/5 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center">
            <div className="bg-emerald-100 dark:bg-emerald-900/20 p-2 rounded-full text-emerald-600 dark:text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div className="w-[1.5px] bg-primary/10 h-full mt-1"></div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-slate-800 dark:text-white font-semibold">
              Stock Added: Tomato (+5 kg)
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              2 hours ago • Updated by Chef Mario
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-primary/5 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center">
            <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full text-amber-600 dark:text-amber-400">
              <Edit className="w-5 h-5" />
            </div>
            <div className="w-[1.5px] bg-primary/10 h-full mt-1"></div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-slate-800 dark:text-white font-semibold">
              Stock Adjusted: Flour (-1 kg)
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              5 hours ago • Daily consumption log
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
