import { Search, Clock, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NotificationDropdown from "../common/NotificationDropdown";
import GlobalSearch from "../common/GlobalSearch";

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  return (
    <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 bg-white dark:bg-slate-900 border-b border-primary/10 z-[60] sticky top-0">
      <div className="flex items-center gap-3 md:gap-6 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:block flex-1 max-w-sm">
          <GlobalSearch />
        </div>
        <div className="sm:hidden flex-1">
          {/* Mobile Search Button could go here or just show GlobalSearch simplified */}
          <GlobalSearch />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
          <Clock className="text-primary w-5 h-5" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] md:text-xs font-bold text-primary uppercase whitespace-nowrap">
            {user.Role.name}
          </span>
        </div>

        <NotificationDropdown />

        <div className="h-8 md:h-10 w-px bg-slate-200 dark:bg-slate-700 mx-1 md:mx-2 hidden sm:block"></div>

        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
          <div className="text-right hidden xl:block">
            <p className="text-sm font-bold text-slate-800 dark:text-white leading-none group-hover:text-primary transition-colors">
              {user.full_name}
            </p>
          </div>
          <div
            className="size-8 md:size-10 rounded-full bg-cover bg-center border-2 border-primary/20 group-hover:border-primary transition-colors shrink-0"
            style={{
              backgroundImage: `url('https://ui-avatars.com/api/?name=${user.full_name}&background=random')`,
            }}
          ></div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
