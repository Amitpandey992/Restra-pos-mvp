import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Utensils,
  Lock,
  Mail,
  EyeOff,
  Eye,
  ArrowRight,
  ChefHat,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
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
              Welcome back to your dashboard.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-12">
              Sign in to manage your restaurant's operations, inventory, and
              staff with real-time insights.
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
              Sign in
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Enter your email and password to access your account.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="admin@restaurant.com"
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
                  type={visible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {visible ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary"
                />
                <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-primary font-bold hover:text-primary-600 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-glow disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-white dark:border-slate-400 dark:border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>
                  Sign In{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Demo User Selection block - simplified */}
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-center mb-4">
                Demo Accounts
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("owner@gmail.com");
                    setPassword("password123");
                  }}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2"
                >
                  <ChefHat className="w-4 h-4 text-primary" /> Owner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("staff@gmail.com");
                    setPassword("password123");
                  }}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2"
                >
                  <Utensils className="w-4 h-4 text-violet-500" /> Staff
                </button>
              </div>
            </div>

            <p className="text-center text-sm font-medium text-slate-500 mt-8">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-bold hover:text-primary-600 transition-colors"
              >
                Create Business Account
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
