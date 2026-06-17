import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[#F5F7FB] lg:flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
        {isDashboard ? (
          <Topbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        ) : (
          <button
            className="mb-5 rounded-lg border border-slate-200 bg-white p-2 text-[#3026A6] shadow-sm lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
        )}
        <Outlet />
      </main>
    </div>
  );
}
