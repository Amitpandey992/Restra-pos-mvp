import React, { useState } from "react";
import Modal from "../common/Modal";

const IngredientModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    purchase_unit: "Kg",
    recipe_unit: "Grams",
    conversion_factor: "1000",
    min_stock_level: "1000",
    cost_per_unit: "0",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      conversion_factor: parseFloat(formData.conversion_factor),
      min_stock_level: parseFloat(formData.min_stock_level),
      cost_per_unit: parseFloat(formData.cost_per_unit),
      current_stock: 0,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Ingredient">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            Ingredient Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="e.g. Chicken Breast"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              Purchase Unit
            </label>
            <input
              type="text"
              required
              value={formData.purchase_unit}
              onChange={(e) =>
                setFormData({ ...formData, purchase_unit: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="e.g. Kg, Box"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              Recipe Unit
            </label>
            <input
              type="text"
              required
              value={formData.recipe_unit}
              onChange={(e) =>
                setFormData({ ...formData, recipe_unit: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="e.g. Grams, Pcs"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
            Conversion Factor (How many {formData.recipe_unit || "recipe units"}{" "}
            in 1 {formData.purchase_unit || "purchase unit"}?)
          </label>
          <input
            type="number"
            step="any"
            required
            value={formData.conversion_factor}
            onChange={(e) =>
              setFormData({ ...formData, conversion_factor: e.target.value })
            }
            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              Min Stock Level ({formData.recipe_unit})
            </label>
            <input
              type="number"
              step="any"
              required
              value={formData.min_stock_level}
              onChange={(e) =>
                setFormData({ ...formData, min_stock_level: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              Cost Per {formData.purchase_unit}
            </label>
            <input
              type="number"
              step="any"
              required
              value={formData.cost_per_unit}
              onChange={(e) =>
                setFormData({ ...formData, cost_per_unit: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
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
            disabled={isLoading}
            className="flex-1 px-5 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-lg shadow-primary/20"
          >
            {isLoading ? "Saving..." : "Add Ingredient"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default IngredientModal;
