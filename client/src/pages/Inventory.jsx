import React, { useState } from "react";
import InventoryMetrics from "../components/inventory/InventoryMetrics";
import InventoryTable from "../components/inventory/InventoryTable";
import { Search, Plus, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInventoryItems,
  addIngredient,
  adjustStock,
} from "../api/inventoryApi";
import IngredientModal from "../components/inventory/IngredientModal";
import StockAdjustModal from "../components/inventory/StockAdjustModal";
import toast from "react-hot-toast";

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [stockModal, setStockModal] = useState({
    isOpen: false,
    ingredient: null,
    mode: "restock",
  });
  const queryClient = useQueryClient();

  const {
    data: ingredientsResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["inventory", searchQuery],
    queryFn: () => getInventoryItems({ search: searchQuery, limit: 1000 }),
    onError: () => toast.error("Failed to load inventory"),
  });

  const ingredients = ingredientsResponse?.data?.items || [];

  const addIngredientMutation = useMutation({
    mutationFn: addIngredient,
    onSuccess: () => {
      toast.success("Ingredient added");
      queryClient.invalidateQueries(["inventory"]);
      setIsIngredientModalOpen(false);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to add ingredient"),
  });

  const adjustStockMutation = useMutation({
    mutationFn: adjustStock,
    onSuccess: () => {
      toast.success("Stock updated");
      queryClient.invalidateQueries(["inventory"]);
      setStockModal({ isOpen: false, ingredient: null, mode: "restock" });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update stock"),
  });

  // Calculate Metrics
  const totalItems = ingredients.length;
  const lowStockItems = ingredients.filter(
    (i) => i.current_stock <= i.min_stock_level && i.current_stock > 0,
  ).length;
  const outOfStockItems = ingredients.filter(
    (i) => i.current_stock <= 0,
  ).length;

  const handleAddIngredient = () => {
    setIsIngredientModalOpen(true);
  };

  const handleCreateIngredient = (data) => {
    addIngredientMutation.mutate(data);
  };

  const handleRestock = (item) => {
    setStockModal({ isOpen: true, ingredient: item, mode: "restock" });
  };

  const handleAdjust = (item) => {
    setStockModal({ isOpen: true, ingredient: item, mode: "adjust" });
  };

  const handleStockSubmit = (data) => {
    adjustStockMutation.mutate(data);
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen">
      {/* Search & Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 md:px-8 py-6 md:py-8 max-w-[1600px] mx-auto w-full">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white truncate">
            StockMaster
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-none bg-white dark:bg-slate-800 shadow-sm focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddIngredient}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>Add Items</span>
            </button>
            <button
              onClick={() => refetch()}
              className="flex items-center justify-center p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shrink-0"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 md:px-8 pb-20 max-w-[1600px] mx-auto w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InventoryMetrics
              total={totalItems}
              low={lowStockItems}
              outOfStock={outOfStockItems}
            />
            <div className="table-responsive">
              <InventoryTable
                ingredients={ingredients}
                onAddStock={handleRestock}
                onAdjustStock={handleAdjust}
              />
            </div>
          </div>
        )}
      </main>

      <IngredientModal
        isOpen={isIngredientModalOpen}
        onClose={() => setIsIngredientModalOpen(false)}
        onSubmit={handleCreateIngredient}
        isLoading={addIngredientMutation.isPending}
      />

      <StockAdjustModal
        isOpen={stockModal.isOpen}
        onClose={() => setStockModal({ ...stockModal, isOpen: false })}
        onSubmit={handleStockSubmit}
        isLoading={adjustStockMutation.isPending}
        ingredient={stockModal.ingredient}
        mode={stockModal.mode}
      />
    </div>
  );
};

export default Inventory;
