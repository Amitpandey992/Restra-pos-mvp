import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/authApi";
import { getPlans } from "../api/planApi";
import toast from "react-hot-toast";
import {
  Utensils,
  Building2,
  User,
  Mail,
  Lock,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import clsx from "clsx";

const Signup = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [formData, setFormData] = useState({
    tenant: {
      name: "",
      address: "",
      phone: "",
      plan_id: "",
    },
    user: {
      full_name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getPlans();
        const activePlans = response.data || [];
        setPlans(activePlans);
        if (activePlans.length > 0) {
          setFormData((prev) => ({
            ...prev,
            tenant: { ...prev.tenant, plan_id: activePlans[0].id },
          }));
        }
      } catch (error) {
        toast.error("Failed to load plans");
      }
    };
    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success("Account created! Please verify your email.");
      navigate("/verify-otp", { state: { email: formData.user.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-primary/10 flex flex-col md:flex-row">
        {/* Sidebar Info */}
        <div className="bg-primary p-8 text-white md:w-1/3 flex flex-col justify-center">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-primary-100 text-sm leading-relaxed mb-6">
            Join thousands of restaurants managing their business with
            TastyBytes.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" /> Inventory
              Management
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" /> Order Tracking
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" /> Staff Roles
            </li>
          </ul>
        </div>

        {/* Signup Form */}
        <div className="p-8 md:flex-1">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
            Create Your Business Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tenant Section */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Company Details
                </label>
              </div>
              <div className="col-span-2 relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  required
                  placeholder="Restaurant Name"
                  value={formData.tenant.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tenant: { ...formData.tenant, name: e.target.value },
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Owner Details
                </label>
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  required
                  placeholder="Full Name"
                  value={formData.user.full_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      user: { ...formData.user, full_name: e.target.value },
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={formData.user.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      user: { ...formData.user, email: e.target.value },
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="col-span-2 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={passwordVisible ? "text" : "password"}
                  required
                  placeholder="Strong Password"
                  value={formData.user.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      user: { ...formData.user, password: e.target.value },
                    })
                  }
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {passwordVisible ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Select Plan
                </label>
                <select
                  value={formData.tenant.plan_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tenant: { ...formData.tenant, plan_id: e.target.value },
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - ₹{plan.price}/mo
                    </option>
                  ))}
                </select>
              </div> */}
            </div>

            <button
              type="submit"
              disabled={loading || plans.length === 0}
              className="w-full py-4 bg-primary hover:bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
            >
              {loading ? "Creating Account..." : "Create Tenant Account"}
            </button>

            <p className="text-center text-sm text-slate-500 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
