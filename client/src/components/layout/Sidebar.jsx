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

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
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

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const userRole = user?.Role?.name;

  // Filter nav items based on user role
  const filteredNavItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(userRole),
  );

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-primary/10 flex flex-col h-full z-30 transition-all duration-300 lg:static lg:translate-x-0 w-72",
        isOpen
          ? "translate-x-0 shadow-2xl"
          : "-translate-x-full lg:translate-x-0",
      )}
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
            <Utensils className="w-6 h-6" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="font-bold text-slate-800 dark:text-white leading-tight truncate">
              The Golden Bistro
            </h1>
            <span className="text-xs font-medium text-primary uppercase tracking-wider truncate">
              Restaurant POS
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4 no-scrollbar">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-full font-medium transition-all group",
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-primary/5 hover:text-primary",
              )}
            >
              <item.icon
                className={clsx(
                  "w-6 h-6 shrink-0",
                  isActive ? "text-white" : "text-current",
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
