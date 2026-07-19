import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { getPlans } from "../api/planApi";
import toast from "react-hot-toast";
import { CheckCircle2, ArrowRight, Sparkles, ChefHat } from "lucide-react";
import { createRazorpayOrder, verifyPayment } from "../api/paymentApi";

export default function SelectPlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const email = location.state?.email;

  useEffect(() => {
    // If no email, redirect back to signup
    if (!email) {
      navigate("/signup");
      return;
    }

    const fetchPlans = async () => {
      try {
        const response = await getPlans();
        const activePlans = response.data || [];
        setPlans(activePlans);
        if (activePlans.length > 0) {
          setSelectedPlanId(activePlans[0].id);
        }
      } catch (error) {
        toast.error("Failed to load subscription plans");
      }
    };
    fetchPlans();
  }, [email, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleContinue = async () => {
    if (!selectedPlanId) {
      toast.error("Please select a plan to continue.");
      return;
    }

    setLoading(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      const orderResponse = await createRazorpayOrder(email, selectedPlanId);
      const { orderId, amount, currency, restaurantName } = orderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "Restora SaaS",
        description: `Subscription for ${restaurantName}`,
        order_id: orderId,
        handler: async function (response: any) {
          setLoading(true);
          try {
            await verifyPayment({
              email,
              planId: selectedPlanId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful! Plan activated.");
            navigate("/dashboard");
          } catch (error) {
            toast.error("Payment verification failed. Contact support.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          email: email,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#09090b] flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-primary/30">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      <div className="w-full max-w-5xl relative z-10 flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white shadow-glow">
              <ChefHat size={36} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Choose your perfect plan
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Unlock the full potential of your restaurant with our tailored
            solutions. Upgrade or downgrade at any time.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        {plans.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12"
          >
            {plans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              // Add recommended flag for middle plan or specific plan as a UI enhancement
              const isRecommended =
                plan.name.toLowerCase() === "pro" ||
                plan.name.toLowerCase() === "premium";

              return (
                <motion.div
                  key={plan.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`
                    relative cursor-pointer rounded-3xl p-8 transition-all duration-300
                    ${
                      isSelected
                        ? "bg-gradient-to-b from-primary/10 to-transparent border-2 border-primary shadow-glow"
                        : "bg-white dark:bg-[#121215] border-2 border-transparent hover:border-primary/50 shadow-soft dark:shadow-none"
                    }
                  `}
                >
                  {isRecommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-violet-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                      <Sparkles size={12} /> RECOMMENDED
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {plan.description || "Best for growing businesses"}
                      </p>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white"
                      >
                        <CheckCircle2 size={16} />
                      </motion.div>
                    )}
                  </div>

                  <div className="mb-8 flex items-baseline">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      ₹{plan.price}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 ml-2 font-medium">
                      / month
                    </span>
                  </div>

                  <div className="space-y-4 mb-8">
                    {/* Fallback mock features if plan.features object is not fully detailed */}
                    {[
                      `${plan.features?.tables || "Unlimited"} Tables`,
                      `${plan.features?.items || "Unlimited"} Menu Items`,
                      "Real-time analytics",
                      "24/7 Priority Support",
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? "bg-primary/20 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}
                        >
                          <CheckCircle2 size={12} />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="w-full flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full max-w-md"
        >
          <button
            onClick={handleContinue}
            disabled={!selectedPlanId || loading}
            className="w-full py-4 bg-primary hover:bg-primary-600 text-white font-bold rounded-2xl shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group text-lg"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Continue to Verification
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-4">
            You can always change your plan later in settings.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
