import React, { useState } from "react";
import MenuManagerItem from "../components/menu/MenuManagerItem";
import { getMenuItems, createMenuItem } from "../api/menuApi";
import { Search, Plus, Filter, Utensils } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import CreateMenuItemModal from "../components/menu/CreateMenuItemModal";

const Menu = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: menuResponse, isLoading } = useQuery({
    queryKey: ["menuItems"],
    queryFn: () => getMenuItems({ limit: 1000 }),
  });

  const menuItems = menuResponse?.data?.items || [];

  const createItemMutation = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      toast.success("Item added successfully");
      queryClient.invalidateQueries(["menuItems"]);
      setIsCreateModalOpen(false);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to add item"),
  });

  const handleAddItem = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateItem = (formData) => {
    createItemMutation.mutate(formData);
  };

  const filteredItems = menuItems.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "drink") return false; // Basic filtering logic for now
    return item.type === (activeTab === "nonveg" ? "non-veg" : activeTab);
  });

  const totalItems = menuItems.length;
  const availableItems = menuItems.filter((i) => i.is_available).length;
  const soldOutItems = totalItems - availableItems;

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-primary/10 px-4 md:px-8 py-4 flex items-center justify-between max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-800 dark:text-white truncate">
            Menu Manager
          </h1>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={handleAddItem}
            className="hidden sm:flex items-center justify-center gap-2 rounded-full h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Item</span>
          </button>
          <div className="border-l border-primary/10 h-8 mx-1 hidden sm:block"></div>
          <div
            className="size-9 md:size-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center border-2 border-primary/10 shrink-0"
            style={{
              backgroundImage:
                "url(https://ui-avatars.com/api/?name=Menu&background=primary&color=fff)",
            }}
          ></div>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-[1600px] mx-auto w-full">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6 md:gap-8">
          {/* Search and Filters */}
          <div className="flex flex-col gap-6 bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl shadow-sm border border-primary/10">
            <div className="w-full relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
              <input
                className="w-full h-12 md:h-14 pl-12 pr-4 rounded-xl border-none bg-background-light dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 text-base transition-all"
                placeholder="Search items, ingredients or prices..."
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex gap-2.5 overflow-x-auto pb-2 -mb-2 no-scrollbar w-full sm:w-auto">
                {[
                  { id: "all", label: "All Items" },
                  { id: "veg", label: "Pure Veg" },
                  { id: "nonveg", label: "Non-Veg" },
                  { id: "drink", label: "Beverages" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex h-11 shrink-0 items-center justify-center px-6 rounded-full text-xs md:text-sm font-bold tracking-tight uppercase transition-all
                                    ${
                                      activeTab === tab.id
                                        ? "bg-primary text-white shadow-xl shadow-primary/20 active:scale-95"
                                        : "bg-background-light dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-primary/5 hover:text-primary"
                                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="hidden lg:flex items-center gap-2.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Filter className="w-4 h-4" />
                <span>
                  Sort: <span className="text-primary">Most Recent</span>
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items List */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Active Menu{" "}
                <span className="text-slate-400 font-normal text-sm ml-2">
                  ({filteredItems.length} Items)
                </span>
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {filteredItems.map((item) => (
                  <MenuManagerItem key={item.id} item={item} />
                ))}

                {filteredItems.length === 0 && (
                  <div className="py-12 text-center text-slate-400">
                    <p>No items found in this category.</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Statistics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-primary/10 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Items
              </span>
              <span className="text-2xl font-black text-slate-800 dark:text-white">
                {totalItems}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-primary/10 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Available
              </span>
              <span className="text-2xl font-black text-emerald-600">
                {availableItems}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-primary/10 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Sold Out
              </span>
              <span className="text-2xl font-black text-red-500">
                {soldOutItems}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-primary/10 shadow-sm flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Updates Today
              </span>
              <span className="text-2xl font-black text-primary">0</span>
            </div>
          </div>
        </div>
      </main>

      {/* FAB Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="size-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <CreateMenuItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateItem}
        isLoading={createItemMutation.isPending}
      />
    </div>
  );
};

export default Menu;
