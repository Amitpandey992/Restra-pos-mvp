import { useState } from "react";
import { X, Upload, Check } from "lucide-react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { getInventoryItems } from "../../api/inventoryApi";

const CreateMenuItemModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "main_course",
    type: "veg",
    image: null,
    ingredients: [],
  });
  const [preview, setPreview] = useState(null);

  const { data: ingredientsData } = useQuery({
    queryKey: ["inventory-list"],
    queryFn: () => getInventoryItems({ limit: 100 }), // Fetch enough for selection
    enabled: isOpen,
  });

  const ingredientsList = ingredientsData?.data?.items || [];

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientToggle = (id) => {
    setFormData((prev) => {
      const exists = prev.ingredients.includes(id);
      if (exists) {
        return {
          ...prev,
          ingredients: prev.ingredients.filter((i) => i !== id),
        };
      } else {
        return { ...prev, ingredients: [...prev.ingredients, id] };
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("description", formData.description.trim());
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("type", formData.type);
    data.append("ingredients", JSON.stringify(formData.ingredients));

    if (formData.image) {
      data.append("image", formData.image);
    }

    onSubmit(data);
  };
  // ... rest of component until form fields ...
  // after Description div
  <div className="col-span-2">
    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
      Select Ingredients
    </label>
    <div className="max-h-40 overflow-y-auto p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 grid grid-cols-2 gap-2">
      {ingredientsList.length === 0 ? (
        <p className="text-xs text-slate-400 col-span-2 text-center py-2">
          No ingredients found in inventory.
        </p>
      ) : (
        ingredientsList.map((ing) => (
          <label
            key={ing.id}
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <input
              type="checkbox"
              checked={formData.ingredients.includes(ing.id)}
              onChange={() => handleIngredientToggle(ing.id)}
              className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span
              className="text-sm text-slate-700 dark:text-slate-300 truncate"
              title={ing.name}
            >
              {ing.name}{" "}
              <span className="text-xs text-slate-400">
                ({ing.recipe_unit || ing.unit})
              </span>
            </span>
          </label>
        ))
      )}
    </div>
    <p className="text-xs text-slate-500 mt-1">
      Selected: {formData.ingredients.length} ingredients
    </p>
  </div>;
  // ... existing closing tags

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-primary/10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Add New Item
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <form
            id="create-item-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Image Upload */}
            <div className="flex justify-center mb-6">
              <label className="relative cursor-pointer group">
                <div
                  className={clsx(
                    "w-32 h-32 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors",
                    preview
                      ? "border-primary"
                      : "border-slate-300 dark:border-slate-700 hover:border-primary/50",
                  )}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-xs font-bold uppercase">
                        Upload
                      </span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Item Name
                </label>
                <input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="e.g. Butter Chicken"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Price (₹)
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  onWheel={(e) => e.target.blur()}
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                  <option value="drink">Drink</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="starters">Starters</option>
                  <option value="main_course">Main Course</option>
                  <option value="desserts">Desserts</option>
                  <option value="drinks">Drinks</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  placeholder="Brief description of the item..."
                ></textarea>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Ingredients
                </label>
                <div className="max-h-40 overflow-y-auto p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 grid grid-cols-2 gap-2">
                  {ingredientsList.length === 0 ? (
                    <p className="text-xs text-slate-400 col-span-2 text-center py-2">
                      No ingredients found in inventory.
                    </p>
                  ) : (
                    ingredientsList.map((ing) => (
                      <label
                        key={ing.id}
                        className="flex items-center gap-2 cursor-pointer p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.ingredients.includes(ing.id)}
                          onChange={() => handleIngredientToggle(ing.id)}
                          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span
                          className="text-sm text-slate-700 dark:text-slate-300 truncate"
                          title={ing.name}
                        >
                          {ing.name}{" "}
                          <span className="text-xs text-slate-400">
                            ({ing.recipe_unit || ing.unit})
                          </span>
                        </span>
                      </label>
                    ))
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Selected: {formData.ingredients.length} ingredients
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary/10 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2.5 rounded-lg font-bold text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-item-form"
            disabled={isLoading}
            className={clsx(
              "px-5 py-2.5 rounded-lg font-bold text-white shadow-lg shadow-primary/20 transition-all flex items-center gap-2",
              isLoading
                ? "bg-primary/70 cursor-wait"
                : "bg-primary hover:bg-primary-600 hover:-translate-y-0.5",
            )}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Create Item
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMenuItemModal;
