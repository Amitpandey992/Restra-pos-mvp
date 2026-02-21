import React from "react";
import clsx from "clsx";
import { Banknote, CreditCard, QrCode } from "lucide-react";

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-lg px-2 text-slate-900 dark:text-white">
        Select Payment Method
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cash */}
        <button
          onClick={() => onSelect("cash")}
          className={clsx(
            "flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all group relative",
            selectedMethod === "cash"
              ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
              : "border-primary/10 bg-white dark:bg-slate-800 hover:border-primary/40 hover:bg-primary/5 dark:hover:bg-slate-700",
          )}
        >
          <div
            className={clsx(
              "w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
              selectedMethod === "cash"
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary",
            )}
          >
            <Banknote className="w-6 h-6" />
          </div>
          <span className="font-bold text-lg text-slate-800 dark:text-white">
            Cash
          </span>
        </button>

        {/* UPI */}
        <button
          onClick={() => onSelect("upi")}
          className={clsx(
            "flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all relative group",
            selectedMethod === "upi"
              ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
              : "border-primary/10 bg-white dark:bg-slate-800 hover:border-primary/40 hover:bg-primary/5 dark:hover:bg-slate-700",
          )}
        >
          <div className="absolute -top-3 right-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Popular
          </div>
          <div
            className={clsx(
              "w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
              selectedMethod === "upi"
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary",
            )}
          >
            <QrCode className="w-6 h-6" />
          </div>
          <span className="font-bold text-lg text-slate-800 dark:text-white">
            UPI
          </span>
        </button>

        {/* Card */}
        <button
          onClick={() => onSelect("card")}
          className={clsx(
            "flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all group relative",
            selectedMethod === "card"
              ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
              : "border-primary/10 bg-white dark:bg-slate-800 hover:border-primary/40 hover:bg-primary/5 dark:hover:bg-slate-700",
          )}
        >
          <div
            className={clsx(
              "w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
              selectedMethod === "card"
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary",
            )}
          >
            <CreditCard className="w-6 h-6" />
          </div>
          <span className="font-bold text-lg text-slate-800 dark:text-white">
            Card
          </span>
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
