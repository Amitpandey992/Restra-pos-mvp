import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTables } from "../api/tableApi";
import TableFilters from "../components/tables/TableFilters";
import {
  Plus,
  Settings,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const Tables = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const {
    data: tablesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    onError: (err) => {
      toast.error("Failed to load tables");
    },
  });

  const tables =
    tablesResponse?.data?.items?.map((table) => {
      const activeOrder =
        table.Orders && table.Orders.length > 0 ? table.Orders[0] : null;

      // Calculate time elapsed
      let timeElapsed = "";
      if (activeOrder && activeOrder.createdAt) {
        const start = new Date(activeOrder.createdAt);
        const now = new Date();
        const diffMs = now - start;
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);
        timeElapsed = `${diffHrs}h ${diffMins}m`;
      }

      return {
        ...table,
        status: activeOrder ? "occupied" : table.status, // Override status if active order exists (double check)
        // Actually backend should handle status updates, but let's trust table.status mostly.
        // However, if table.status is occupied, activeOrder should be there.
        orderTotal: activeOrder ? activeOrder.total_amount : 0,
        time: timeElapsed,
        guests: table.capacity, // Using capacity as proxy for guests for now
        orderId: activeOrder ? activeOrder.id : null,
      };
    }) || [];

  const filteredTables =
    activeFilter === "all"
      ? tables
      : tables.filter((t) => t.status === activeFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-emerald-500";
      case "occupied":
        return "bg-red-500";
      case "cleaning":
        return "bg-amber-500";
      default:
        return "bg-slate-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-slate-500">
        <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
        <p className="text-lg font-semibold">Failed to load floor plan</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen">
      <main className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-[1600px] mx-auto w-full">
        {/* Breadcrumbs & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] md:text-sm uppercase tracking-wider font-bold">
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-primary">Floor Plan</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-800 dark:text-white">
              Overview
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button className="flex-1 sm:flex-none flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
              <Plus className="w-4 h-4" />
              <span>Add Table</span>
            </button>
            <button className="flex h-11 items-center justify-center gap-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 md:px-6 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Settings className="w-5 h-5" />
              <span className="hidden sm:inline">Layout</span>
            </button>
            <button
              onClick={() => refetch()}
              className="flex h-11 items-center justify-center p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <TableFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Table Grid */}
        {tables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="border-2 border-dashed border-slate-300 rounded-full p-6 mb-4">
              <Settings className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-medium">No tables found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 md:gap-6 pb-24">
            {filteredTables.map((table) => (
              <div
                key={table.id}
                className={`group flex flex-col bg-white dark:bg-slate-800 border-2 rounded-2xl p-5 md:p-6 hover:shadow-2xl transition-all text-left h-full min-h-[160px] cursor-pointer relative overflow-hidden
                        ${table.status === "available" ? "border-emerald-500/10 hover:border-emerald-500" : ""}
                        ${table.status === "occupied" ? "border-red-500/10 hover:border-red-500" : ""}
                        ${table.status === "cleaning" ? "border-amber-500/10 hover:border-amber-500" : ""}
                    `}
              >
                <div className="flex justify-between items-start mb-4 w-full relative z-10">
                  <span className="text-lg font-bold text-slate-800 dark:text-white truncate pr-2">
                    {table.name}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0
                            ${table.status === "available" ? "bg-emerald-500/10 text-emerald-600" : ""}
                            ${table.status === "occupied" ? "bg-red-500/10 text-red-600" : ""}
                            ${table.status === "cleaning" ? "bg-amber-500/10 text-amber-600" : ""}
                        `}
                  >
                    {table.status}
                  </span>
                </div>

                <div className="mt-auto w-full relative z-10">
                  {table.status === "available" && (
                    <>
                      <p className="text-slate-400 text-xs font-bold mb-2">
                        Capacity: {table.capacity} Seats
                      </p>
                      <button className="text-primary text-sm font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        OPEN ORDER <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  {table.status === "occupied" && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1">
                          Active Now
                        </p>
                        <p className="text-slate-800 dark:text-white text-sm font-bold truncate">
                          {table.time} • ₹{table.orderTotal}
                        </p>
                      </div>
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {[...Array(Math.min(table.guests, 3))].map((_, i) => (
                          <div
                            key={i}
                            className="size-7 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 bg-cover bg-center"
                            style={{
                              backgroundImage: `url('https://i.pravatar.cc/100?u=${table.id}-${i}')`,
                            }}
                          />
                        ))}
                        {table.guests > 3 && (
                          <div className="size-7 rounded-full border-2 border-white dark:border-slate-800 bg-primary text-[10px] flex items-center justify-center font-bold text-white shrink-0">
                            +{table.guests - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {table.status === "cleaning" && (
                    <div className="flex items-center gap-3 py-1">
                      <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-amber-600 dark:text-amber-500 text-xs font-bold uppercase tracking-wider">
                        Cleaning...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Legend */}
      <footer className="fixed bottom-0 left-0 right-0 lg:left-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-20">
        <div className="px-4 md:px-8 py-3 md:py-4 flex flex-wrap items-center justify-between gap-4 max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-2 shrink-0">
              <div className="size-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
              <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
                Available
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="size-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></div>
              <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
                Occupied
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="size-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></div>
              <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
                Cleaning
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <p>
              Efficiency:{" "}
              <span className="text-primary">
                {Math.round(
                  (tables.filter((t) => t.status === "occupied").length /
                    (tables.length || 1)) *
                    100,
                )}
                %
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Tables;
