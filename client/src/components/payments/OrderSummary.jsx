import React from "react";
import { ShoppingBag } from "lucide-react";

const OrderSummary = ({ items, totals }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/10 overflow-hidden">
      <div className="p-6 border-b border-primary/5 dark:border-slate-800">
        <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
          <ShoppingBag className="w-5 h-5 text-primary" />
          Order Summary
        </h3>
      </div>

      <div className="p-6 flex flex-col gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center group">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <item.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white line-clamp-1">
                  {item.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.desc} • Qty: {item.qty}
                </p>
              </div>    
            </div>
            <p className="font-bold text-slate-800 dark:text-white">
              ₹{item.price.toFixed(2)}
            </p>
          </div>
        ))}

        <div className="mt-4 pt-4 border-t border-dashed border-primary/20 flex flex-col gap-2">
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Subtotal</span>
            <span>₹{totals.subtotal.toFixed(2)}</span>
          </div>
          {totals.shipping > 0 ? (
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Shipping</span>
              <span>₹{totals.shipping.toFixed(2)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Shipping</span>
              <span className="text-emerald-600 font-bold">Free</span>
            </div>
          )}
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Tax (est)</span>
            <span>₹{totals.tax.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 dark:bg-slate-800 p-6 flex justify-between items-center">
        <span className="text-lg font-bold text-slate-800 dark:text-white">
          Total Amount Due
        </span>
        <span className="text-4xl font-black text-primary">
          ₹{totals.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
