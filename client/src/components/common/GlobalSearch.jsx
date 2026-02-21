import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Utensils,
  Users,
  Layout,
  Receipt,
  X,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchGlobal } from "../../api/searchApi";
import clsx from "clsx";

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        handleSearch();
      } else {
        setResults(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await searchGlobal(query);
      setResults(response.data);
      setIsOpen(true);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (path) => {
    setIsOpen(false);
    setQuery("");
    navigate(path);
  };

  const hasResults =
    results &&
    (results.users.length > 0 ||
      results.tables.length > 0 ||
      results.items.length > 0 ||
      results.orders.length > 0);

  return (
    <div className="relative max-w-md w-full" ref={dropdownRef}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
      <input
        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2.5 pl-12 pr-10 focus:ring-2 focus:ring-primary/50 text-sm outline-none transition-all placeholder:text-slate-400 dark:text-white"
        placeholder="Search orders, tables, staff, or menu..."
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-[70] max-h-[480px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {!results && isLoading && (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm">Searching...</p>
            </div>
          )}

          {results && !hasResults && !isLoading && (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          )}

          {results && hasResults && (
            <div className="p-2 space-y-4">
              {/* Menu Items */}
              {results.items.length > 0 && (
                <section>
                  <h4 className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Utensils className="w-3 h-3" /> Menu Items
                  </h4>
                  <div className="mt-1 space-y-1">
                    {results.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(`/menu`)} // Navigate to menu page
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group"
                      >
                        <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Utensils className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-primary transition-colors">
                            {item.name}
                          </p>
                          <p className="text-xs text-emerald-500 font-medium">
                            ₹{item.price}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Tables */}
              {results.tables.length > 0 && (
                <section>
                  <h4 className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Layout className="w-3 h-3" /> Tables
                  </h4>
                  <div className="mt-1 space-y-1">
                    {results.tables.map((table) => (
                      <button
                        key={table.id}
                        onClick={() => handleItemClick(`/tables`)}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group"
                      >
                        <div
                          className={clsx(
                            "size-10 rounded-lg flex items-center justify-center shrink-0",
                            table.status === "available"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-red-100 text-red-600",
                          )}
                        >
                          <Layout className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-primary transition-colors">
                            {table.name}
                          </p>
                          <p className="text-[10px] font-medium uppercase tracking-wider opacity-70">
                            {table.status}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Staff */}
              {results.users.length > 0 && (
                <section>
                  <h4 className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-3 h-3" /> Team Members
                  </h4>
                  <div className="mt-1 space-y-1">
                    {results.users.map((userResult) => (
                      <button
                        key={userResult.id}
                        onClick={() => handleItemClick(`/team`)}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group"
                      >
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Users className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-primary transition-colors">
                            {userResult.full_name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {userResult.email}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Orders */}
              {results.orders.length > 0 && (
                <section>
                  <h4 className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Receipt className="w-3 h-3" /> Orders
                  </h4>
                  <div className="mt-1 space-y-1">
                    {results.orders.map((order) => (
                      <button
                        key={order.id}
                        onClick={() =>
                          handleItemClick(`/payments?orderId=${order.id}`)
                        }
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group"
                      >
                        <div className="size-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-primary transition-colors">
                            Order #{order.id.substring(0, 8)}
                          </p>
                          <p className="text-xs text-slate-500">
                            ₹{order.total_amount} •{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
