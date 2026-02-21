import React, { useMemo } from "react";
import {
  Trash2,
  ShoppingCart,
  Printer,
  Ticket,
  ArrowRight,
} from "lucide-react";
import CartItem from "./CartItem";
import clsx from "clsx";

const OrderCart = ({
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  // Calculate totals
  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.qty, 0),
    [items],
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <aside className="w-80 2xl:w-96 border-l border-primary/10 bg-white dark:bg-slate-900 flex flex-col shadow-2xl z-30 h-full fixed right-0 top-0 bottom-0 lg:static">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Current Order
          </h2>
        </div>
        <button
          onClick={onClearCart}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
          title="Clear All"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
            <ShoppingCart className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium">Cart is empty</p>
            <p className="text-xs">Select items to start an order</p>
          </div>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQty={onUpdateQty}
              onRemove={onRemoveItem}
            />
          ))
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="space-y-3">
          <div className="flex justify-between text-slate-500 dark:text-slate-400 text-sm font-medium">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500 dark:text-slate-400 text-sm font-medium">
            <span>Tax (8%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-700 dashed"></div>
          <div className="flex justify-between font-bold text-xl pt-1 text-slate-800 dark:text-white">
            <span>Total</span>
            <span className="text-primary">₹{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <button className="flex items-center justify-center gap-2 border border-primary/20 text-primary font-bold py-3 rounded-xl hover:bg-primary/5 active:scale-95 transition-all text-sm">
            <Printer className="w-4 h-4" />
            Receipt
          </button>
          <button className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all text-sm">
            <Ticket className="w-4 h-4" />
            Promo
          </button>
        </div>

        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full bg-primary text-white font-bold text-lg py-5 rounded-2xl shadow-lg shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          Checkout
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </aside>
  );
};

export default OrderCart;
