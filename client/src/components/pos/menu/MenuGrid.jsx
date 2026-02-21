import React, { useMemo } from "react";
import MenuItemCard from "./MenuItemCard";

const MenuGrid = ({ category, searchQuery, items, onAddToOrder }) => {
  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, searchQuery, items]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 content-start scroll-smooth">
      {filteredItems.map((item) => (
        <MenuItemCard key={item.id} item={item} onAddToOrder={onAddToOrder} />
      ))}
      {filteredItems.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center text-slate-400 py-12">
          <span className="text-4xl text-slate-200 dark:text-slate-700">
            :(
          </span>
          <p className="mt-4 font-medium">No items found</p>
        </div>
      )}
    </div>
  );
};

export default MenuGrid;
