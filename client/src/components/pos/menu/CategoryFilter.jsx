import React from "react";
import clsx from "clsx";
import {
  Utensils,
  Coffee,
  Beer,
  IceCream,
  Salad,
  AlignJustify,
} from "lucide-react";

const defaultCategories = [
  { id: "all", label: "All Items", icon: AlignJustify },
  { id: "starters", label: "Starters", icon: Utensils },
  { id: "mains", label: "Burgers & Mains", icon: Utensils },
  { id: "salads", label: "Salads", icon: Salad },
  { id: "drinks", label: "Drinks", icon: Beer },
  { id: "desserts", label: "Desserts", icon: IceCream },
];

const CategoryFilter = ({
  activeCategory,
  onSelectCategory,
  categories = defaultCategories,
}) => {
  return (
    <div className="px-8 py-4 bg-white dark:bg-slate-900 border-b border-primary/10 sticky top-0 z-10 w-full overflow-hidden">
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = cat.icon || AlignJustify;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={clsx(
                "whitespace-nowrap pb-2 text-sm font-bold transition-all border-b-2 flex items-center gap-2",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200",
              )}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
