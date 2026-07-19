import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-[#09090b] text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-primary/30">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden lg:block">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full z-10">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 no-scrollbar scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full relative">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
