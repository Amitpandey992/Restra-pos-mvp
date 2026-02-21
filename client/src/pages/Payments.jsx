import React, { useState } from "react";
import OrderSummary from "../components/payments/OrderSummary";
import PaymentMethodSelector from "../components/payments/PaymentMethodSelector";
import { ArrowRight, Lock, Laptop, Cable } from "lucide-react";
import clsx from "clsx";

import { useSearchParams, useNavigate } from "react-router-dom";
import { getOrder, checkoutOrder } from "../api/orderApi";
import { Utensils } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Payments = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  const {
    data: orderResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
    onError: () => toast.error("Failed to load order details"),
  });

  const order = orderResponse?.data;

  const checkoutMutation = useMutation({
    mutationFn: (data) => checkoutOrder(orderId, data),
    onSuccess: () => {
      toast.success("Payment Successful!");
      navigate("/orders"); // Or receipt page
    },
    onError: (err) => {
      console.error("Payment failed", err);
      toast.error(err.response?.data?.message || "Payment failed");
    },
  });

  const handlePayment = () => {
    if (!selectedMethod || !orderId) return;
    checkoutMutation.mutate({ payment_method: selectedMethod });
  };

  if (isLoading)
    return (
      <div className="p-10 text-center flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  if (isError || !order)
    return (
      <div className="p-10 text-center text-red-500">
        Order not found or access denied
      </div>
    );

  const orderItems = (order.OrderItems || []).map((item) => ({
    name: item.MenuItem?.name || "Unknown Item",
    desc: item.MenuItem?.description || "",
    qty: item.quantity,
    price: (item.price || 0) * item.quantity, // item.price is unit price
    icon: Utensils,
  }));

  const subtotal = order.total_amount || 0;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const totals = {
    subtotal,
    shipping: 0,
    tax,
    total,
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen">
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Left Column: Checkout Details */}
          <div className="w-full lg:max-w-[640px] flex flex-col gap-8">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900 dark:text-white">
                Checkout
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Choose your preferred payment method to complete the purchase.
              </p>
            </div>

            <OrderSummary items={orderItems} totals={totals} />

            <PaymentMethodSelector
              selectedMethod={selectedMethod}
              onSelect={setSelectedMethod}
            />

            <button
              onClick={handlePayment}
              disabled={!selectedMethod || checkoutMutation.isPending}
              className={clsx(
                "w-full py-6 rounded-full text-xl font-black shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed",
                selectedMethod
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400",
              )}
            >
              {checkoutMutation.isPending ? "Processing..." : "Confirm Payment"}
              {!checkoutMutation.isPending && (
                <ArrowRight className="w-6 h-6" />
              )}
            </button>

            <p className="text-center text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Your payment information is encrypted and secure.
            </p>
          </div>

          {/* Right Column: Side Info */}
          <div className="hidden lg:flex w-full max-w-[340px] flex-col gap-6 sticky top-24">
            {/* Rewards Card */}
            <div className="bg-primary/10 p-8 rounded-xl border border-primary/20 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-primary font-black text-xl mb-2">
                  Member Rewards
                </h4>
                <p className="text-primary/80 text-sm mb-4">
                  You're earning {Math.floor(total * 10)} points with this
                  purchase! Redeem for future discounts.
                </p>
                <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-4/5 rounded-full"></div>
                </div>
                <p className="text-[10px] mt-2 font-bold text-primary/60 uppercase tracking-widest">
                  80% to next reward
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-primary/5 rounded-xl shadow-sm">
              <h4 className="font-bold mb-4 text-slate-900 dark:text-white">
                Why shop with us?
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="text-emerald-500 font-bold">✓</div>
                  <span>30-Day Money Back Guarantee</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="text-emerald-500 font-bold">✓</div>
                  <span>Free Express Shipping</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="text-emerald-500 font-bold">✓</div>
                  <span>24/7 Premium Support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payments;
