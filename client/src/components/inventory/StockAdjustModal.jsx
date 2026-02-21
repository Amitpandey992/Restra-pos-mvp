import React, { useState } from "react";
import Modal from "../common/Modal";

const StockAdjustModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  ingredient,
  mode,
}) => {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState(
    mode === "restock" ? "Manual Restock" : "Manual Adjustment",
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ingredientId: ingredient.id,
      quantity: parseFloat(quantity),
      type: mode === "restock" ? "purchase" : "adjustment",
      reason,
    });
  };

  if (!ingredient) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === "restock"
          ? `Restock ${ingredient.name}`
          : `Adjust Stock: ${ingredient.name}`
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-slate-500 mb-4">
            Current Stock:{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {ingredient.current_stock} {ingredient.recipe_unit}
            </span>
          </p>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            {mode === "restock"
              ? `Quantity to Add (in ${ingredient.purchase_unit || ingredient.unit})`
              : `Adjustment Quantity (in ${ingredient.purchase_unit || ingredient.unit}, use negative to decrease)`}
          </label>
          <input
            type="number"
            step="any"
            required
            autoFocus
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            Reason
          </label>
          <input
            type="text"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-5 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !quantity}
            className="flex-1 px-5 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-lg shadow-primary/20"
          >
            {isLoading
              ? "Processing..."
              : mode === "restock"
                ? "Confirm Restock"
                : "Confirm Adjustment"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StockAdjustModal;
