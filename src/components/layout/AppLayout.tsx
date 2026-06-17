import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { authService } from "../../services/auth.service";
import type { User } from "../../types/user";

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const location = useLocation();
  const isDashboard = location.pathname === "/";

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      try {
        const user = await authService.getCurrentUser();
        if (isMounted) {
          setCurrentUser(user);
        }
      } catch {
        if (isMounted) {
          setCurrentUser(null);
        }
      }
    }

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FB] lg:flex">
      <Sidebar currentUser={currentUser} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
        {isDashboard ? (
          <Topbar currentUser={currentUser} onOpenSidebar={() => setIsSidebarOpen(true)} />
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
