import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Utensils, Lock, Mail, EyeOff, Eye } from "lucide-react";
import clsx from "clsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-primary/10">
        <div className="bg-primary p-6 md:p-8 text-center">
          <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <Utensils className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-primary-100 text-white text-sm md:text-base">
            Sign in to manage your restaurant
          </p>
        </div>

        <div className="p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="admin@restaurant.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={visible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setVisible(!visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"
                >
                  {visible ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-slate-600 dark:text-slate-400">
                  Remember me
                </span>
              </label>
              <a href="#" className="text-primary font-medium hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={clsx(
                "w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:translate-y-0",
                loading
                  ? "bg-primary/70 cursor-wait"
                  : "bg-primary hover:bg-primary-600",
              )}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className="p-6 md:p-8">
          {/* Add user and role selection - pre-filled for demo */}
          <div className="mb-4 md:mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Select User (Demo)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail(["[EMAIL_ADDRESS]", "[EMAIL_ADDRESS]"][Math.floor(Math.random() * 2)]);
                  setPassword("password123");
                  alert("Select a user and click Sign In");
                }}
                className="flex-1 py-2 px-4 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all text-sm"
              >
                Random User
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("owner@gmail.com");
                  setPassword("password123");
                }}
                className="flex-1 py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
              >
                Owner
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("staff@gmail.com");
                  setPassword("password123");
                }}
                className="flex-1 py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
              >
                Staff
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Pre-filled with demo accounts: <br />
              - Owner: [EMAIL_ADDRESS] | password123 <br />
              - Staff: [EMAIL_ADDRESS] | password123
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 text-center text-sm text-slate-500 border-t border-slate-100 dark:border-slate-800">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary font-bold cursor-pointer hover:underline"
          >
            Create Business Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
