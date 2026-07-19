import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/authApi";
import { getPlans } from "../api/planApi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Utensils,
  Building2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ChefHat,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [formData, setFormData] = useState({
    tenant: {
      name: "",
    },
    user: {
      full_name: "",
      email: "",
      password: "",
    },
  });

  // useEffect(() => {
  //   const fetchPlans = async () => {
  //     try {
  //       const response = await getPlans();
  //       const activePlans = response.data || [];
  //       setPlans(activePlans);
  //       if (activePlans.length > 0) {
  //         setFormData((prev) => ({
  //           ...prev,
  //           tenant: { ...prev.tenant, plan_id: activePlans[0].id },
  //         }));
  //       }
  //     } catch (error) {
  //       toast.error("Failed to load plans");
  //     }
  //   };
  //   fetchPlans();
  // }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await register(formData);
      toast.success("OTP sent successfully. Check your email.");
      navigate("/verify-otp", { state: { email: formData.user.email } });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-[#09090b] flex overflow-hidden selection:bg-primary/30">
      {/* Decorative Background for Mobile */}
      <div className="absolute inset-0 pointer-events-none lg:hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-violet-600/20 rounded-full blur-[100px]" />
      </div>

      {/* Left Panel: Branding & Features (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px]" />

        <div className="p-12 relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white shadow-glow">
            <ChefHat size={28} />
          </div>
          <span className="font-display font-bold text-2xl text-white tracking-tight">
            Restora
          </span>
        </div>

        <div className="p-12 relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight mb-6">
              Start building your restaurant's future.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-12">
              Join thousands of visionary restaurateurs using Restora to
              streamline operations, delight customers, and scale effortlessly.
            </p>

            <div className="space-y-6">
              {[
                { icon: Sparkles, text: "AI-Powered Analytics & Insights" },
                { icon: CheckCircle2, text: "Real-time Multi-location Sync" },
                { icon: Lock, text: "Enterprise-grade Security" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-center gap-4 text-slate-300"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <item.icon size={16} className="text-primary" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="p-12 relative z-10">
          <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
            <span>© {new Date().getFullYear()} Restora</span>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md glass-card lg:bg-transparent lg:border-none lg:shadow-none rounded-3xl p-8 lg:p-0"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white shadow-glow">
              <ChefHat size={28} />
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-display font-bold mb-2">
              Create an account
            </h2>
          </div>

          {/* Stepper */}
          {/* <div className="flex items-center gap-2 mb-8">
            <div
              className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"} transition-colors duration-300`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"} transition-colors duration-300`}
            />
          </div> */}

          <form onSubmit={handleSubmit}>
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Restaurant Name
                </label>
                <div className="relative group">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    required
                    placeholder="e.g. The Golden Bistro"
                    value={formData.tenant.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tenant: {
                          ...formData.tenant,
                          name: e.target.value,
                        },
                      })
                    }
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    required
                    placeholder="John Doe"
                    value={formData.user.full_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        user: {
                          ...formData.user,
                          full_name: e.target.value,
                        },
                      })
                    }
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.user.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        user: { ...formData.user, email: e.target.value },
                      })
                    }
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input
                    type={passwordVisible ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.user.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        user: {
                          ...formData.user,
                          password: e.target.value,
                        },
                      })
                    }
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {passwordVisible ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-primary hover:bg-primary-600 text-white font-bold rounded-xl shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                  onClick={() => {}}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            <p className="text-center text-sm font-medium text-slate-500 mt-8">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary-600 transition-colors"
              >
                Log in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
