import { Clock, Menu, Search, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NotificationDropdown from "../common/NotificationDropdown";
import GlobalSearch from "../common/GlobalSearch";

const Topbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { user } = useAuth();
  
  return (
    <header className="h-20 flex items-center justify-between px-6 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-md border-b border-slate-200/50 dark:border-white/10 z-30 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block flex-1 max-w-md">
          <GlobalSearch />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-slate-100/50 dark:bg-white/5 rounded-full border border-slate-200/50 dark:border-white/5">
          <Clock className="text-primary w-4 h-4" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider">
            {user?.Role?.name || "STAFF"}
          </span>
        </div>

        <NotificationDropdown />

        <div className="h-8 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden xl:block">
            <p className="text-sm font-bold text-slate-800 dark:text-white leading-none group-hover:text-primary transition-colors">
              {user?.full_name || "User"}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-xl bg-cover bg-center border border-slate-200 dark:border-white/10 group-hover:border-primary shadow-sm transition-all group-hover:shadow-glow"
            style={{ backgroundImage: `url('https://ui-avatars.com/api/?name=${user?.full_name || "U"}&background=random')` }}
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
