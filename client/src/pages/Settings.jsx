import { useQuery } from "@tanstack/react-query";
import { getUserProfile, logout } from "../api/authApi";
import { User, Mail, Shield, LogOut, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Settings = () => {
  const navigate = useNavigate();
  const {
    data: userResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    retry: 1,
  });

  const user = userResponse?.data;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <p className="mb-4">Failed to load profile.</p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-primary text-white rounded-lg font-bold"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark min-h-screen">
      <header className="px-6 lg:px-40 py-8 border-b border-primary/10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Settings & Profile
        </h1>
        <p className="text-slate-500">Manage your account and preferences</p>
      </header>

      <main className="flex-1 px-6 lg:px-40 py-8">
        <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/10 overflow-hidden">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-6">
            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-slate-500">{user.email}</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Role
                </p>
                <p className="font-medium text-slate-900 dark:text-white capitalize">
                  {user.role}
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                  <Building className="w-3 h-3" /> Tenant ID
                </p>
                <p
                  className="font-mono text-sm text-slate-900 dark:text-white truncate"
                  title={user.tenantId}
                >
                  {user.tenantId}
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
