import React, { useState } from "react";
import clsx from "clsx";
import { Edit2, Trash2 } from "lucide-react";

const MenuManagerItem = ({ item }) => {
  const [isAvailable, setIsAvailable] = useState(item.status === "available");

  const handleToggle = () => setIsAvailable(!isAvailable);

  const typeConfig = {
    veg: {
      color: "bg-green-500",
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-700",
      label: "Veg",
    },
    nonveg: {
      color: "bg-red-500",
      bg: "bg-red-50",
      border: "border-red-100",
      text: "text-red-700",
      label: "Non-Veg",
    },
    drink: {
      color: "bg-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700",
      label: "Drink",
    },
  };

  const typeStyle = typeConfig[item.type] || typeConfig.veg;

  return (
    <div className="group flex flex-col md:flex-row items-center gap-6 bg-white dark:bg-slate-900 p-5 rounded-xl border border-primary/10 hover:border-primary/30 transition-all shadow-sm">
      {/* Image & Type Indicator */}
      <div className="relative size-24 shrink-0 overflow-hidden rounded-lg">
        <img
          className={clsx(
            "w-full h-full object-cover",
            !isAvailable && "grayscale opacity-60",
          )}
          src={item.image_url}
          alt={item.name}
        />
        <div
          className={clsx(
            "absolute top-1 right-1 size-3 rounded-full border-2 border-white dark:border-slate-900 shadow-sm",
            typeStyle.color,
          )}
          title={typeStyle.label}
        ></div>
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/60 px-2 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div
        className={clsx(
          "flex flex-1 flex-col gap-1 text-center md:text-left",
          !isAvailable && "opacity-60",
        )}
      >
        <div className="flex items-center justify-center md:justify-start gap-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {item.name}
          </h3>
          <span
            className={clsx(
              "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border",
              typeStyle.bg,
              typeStyle.text,
              typeStyle.border,
            )}
          >
            {typeStyle.label}
          </span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-1">
          {item.description}
        </p>
        <div className="flex items-center justify-center md:justify-start gap-3 mt-1">
          <span className="text-primary font-bold text-lg">
            ₹{item.price.toFixed(2)}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md capitalize">
            {item.category.replace("_", " ")}
          </span>
        </div>
        {item.Ingredients && item.Ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 justify-center md:justify-start">
            {item.Ingredients.map((ing) => (
              <span
                key={ing.id}
                className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 rounded-full"
              >
                {ing.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-row md:flex-col items-center gap-4 md:gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-primary/10 md:pl-6 w-full md:w-auto justify-between md:justify-center">
        <div className="flex flex-col items-center md:items-end gap-1">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
            Status
          </span>
          <label
            className="relative flex h-7 w-12 cursor-pointer items-center rounded-full border-none bg-primary p-1 transition-colors data-[checked=false]:bg-slate-300 dark:data-[checked=false]:bg-slate-700"
            data-checked={isAvailable}
            onClick={handleToggle}
          >
            <div
              className={clsx(
                "h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                isAvailable ? "translate-x-5" : "translate-x-0",
              )}
            ></div>
          </label>
          <span
            className={clsx(
              "text-[10px] font-medium",
              isAvailable
                ? "text-primary"
                : "text-slate-500 dark:text-slate-400",
            )}
          >
            {isAvailable ? "Available" : "Sold Out"}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:bg-background-light dark:hover:bg-slate-800 rounded-full transition-colors hover:text-primary">
            <Edit2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-full transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuManagerItem;
