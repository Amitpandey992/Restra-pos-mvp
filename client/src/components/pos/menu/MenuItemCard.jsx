import React from "react";
import clsx from "clsx";
import { Plus } from "lucide-react";

const MenuItemCard = ({ item, onAddToOrder }) => {
  return (
    <button
      onClick={() => onAddToOrder(item)}
      className="group bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary transition-all text-left flex flex-col gap-3 active:scale-95 duration-200"
    >
      <div
        className="aspect-square w-full rounded-xl bg-slate-100 dark:bg-slate-800 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: `url('${item.image_url}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 p-2 rounded-full shadow-lg">
            <Plus className="text-primary w-6 h-6" />
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors text-sm line-clamp-1">
          {item.name}
        </h3>
        <p className="text-primary font-bold mt-1">₹{item.price.toFixed(2)}</p>
      </div>
    </button>
  );
};

export default MenuItemCard;
