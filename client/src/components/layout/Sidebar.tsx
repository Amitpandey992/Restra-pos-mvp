import {
  LayoutDashboard,
  ShoppingCart,
  Armchair,
  Package,
  MenuSquare,
  CreditCard,
  BarChart3,
  BedDouble,
  Settings,
  PlusCircle,
  Utensils,
  Users,
} from "lucide-react";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["OWNER", "CASHIER", "SUPER_ADMIN"],
  },
  {
    label: "Orders (POS)",
    icon: ShoppingCart,
    path: "/orders",
    roles: ["OWNER", "WAITER", "CASHIER", "SUPER_ADMIN"],
  },
  {
    label: "Tables",
    icon: Armchair,
    path: "/tables",
    roles: ["OWNER", "WAITER", "CASHIER", "SUPER_ADMIN"],
  },
  {
    label: "Inventory",
    icon: Package,
    path: "/inventory",
    roles: ["OWNER", "CASHIER", "SUPER_ADMIN"],
  },
  {
    label: "Menu",
    icon: MenuSquare,
    path: "/menu",
    roles: ["OWNER", "WAITER", "CASHIER", "SUPER_ADMIN"],
  },
  {
    label: "Payments",
    icon: CreditCard,
    path: "/payments",
    roles: ["OWNER", "CASHIER", "SUPER_ADMIN"],
  },
  {
    label: "Reports",
    icon: BarChart3,
    path: "/reports",
    roles: ["OWNER", "CASHIER", "SUPER_ADMIN"],
  },
  {
    label: "Rooms",
    icon: BedDouble,
    path: "/rooms",
    roles: ["OWNER", "WAITER", "CASHIER", "SUPER_ADMIN"],
  },
  {
    label: "Team",
    icon: Users,
    path: "/team",
    roles: ["OWNER", "SUPER_ADMIN"],
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
    roles: ["OWNER", "SUPER_ADMIN"],
  },
];

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const location = useLocation();
  const { user } = useAuth();
  const userRole = user?.Role?.name;

  const filteredNavItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(userRole),
  );

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-white/10 flex flex-col h-full z-40 transition-all duration-500 lg:static lg:translate-x-0 w-72",
        isOpen
          ? "translate-x-0 shadow-2xl"
          : "-translate-x-full lg:translate-x-0",
      )}
    >
      <div className="p-6 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-display font-bold text-slate-800 dark:text-white leading-tight">
              The Golden Bistro
            </h1>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Restaurant POS
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className="relative flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-colors group overflow-hidden"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-2xl border border-primary/20"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon
                className={clsx(
                  "w-5 h-5 relative z-10 transition-colors",
                  isActive ? "text-primary" : "text-slate-400 group-hover:text-primary"
                )}
              />
              <span className={clsx(
                "relative z-10 transition-colors",
                isActive ? "text-primary font-bold" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
