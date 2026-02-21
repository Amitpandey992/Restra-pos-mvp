import React, { useMemo } from "react";
import { Trash2, Minus, Plus, X } from "lucide-react";
import clsx from "clsx";
const CartItem = ({ item, onUpdateQty, onRemove }) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-50/50 dark:bg-slate-800/10 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">
            {item.name}
          </h4>
          {item.notes && (
            <p className="text-xs text-slate-500 italic mt-0.5">{item.notes}</p>
          )}
        </div>
        <p className="font-bold text-primary">
          ₹{(item.price * item.qty).toFixed(2)}
        </p>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-sm">
          <button
            onClick={() => onUpdateQty(item.id, -1)}
            disabled={item.qty <= 1}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-bold text-sm w-8 text-center tabular-nums">
            {item.qty}
          </span>
          <button
            onClick={() => onUpdateQty(item.id, 1)}
            className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white shadow-sm hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
