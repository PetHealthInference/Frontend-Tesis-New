import { ChevronDown, PawPrint, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { routes } from "../../config/routes";
import type { User } from "../../types/user";
import { cn } from "../../utils/cn";

type SidebarProps = {
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
};

function formatRole(role?: string) {
  if (!role) {
    return "Usuario";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
}

function getInitials(fullName?: string) {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean) ?? [];
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
  return initials || "U";
}

export function Sidebar({ currentUser, isOpen, onClose }: SidebarProps) {
  const fullName = currentUser?.full_name ?? "Usuario autenticado";
  const roleName = formatRole(currentUser?.role?.name);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/35 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col bg-gradient-to-b from-[#3026A6] to-[#281C91] text-white shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-8 py-8">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#3026A6]">
              <PawPrint size={29} fill="currentColor" />
            </span>
            <span className="text-2xl font-extrabold tracking-tight">VetClinic</span>
          </div>
          <button className="rounded-lg p-2 hover:bg-white/10 lg:hidden" onClick={onClose} aria-label="Cerrar menu">
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-5">
          {routes.map((route) => {
            const Icon = route.icon;

            return (
              <NavLink
                end={route.path === "/"}
                key={route.path}
                to={route.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex min-h-14 items-center gap-4 rounded-lg px-5 text-base font-semibold text-white/82 transition hover:bg-white/10 hover:text-white",
                    isActive && "bg-white/14 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                  )
                }
              >
                <Icon size={25} strokeWidth={1.9} />
                <span>{route.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-5">
          <button className="flex w-full items-center gap-4 rounded-lg p-3 text-left transition hover:bg-white/10">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-sm font-extrabold text-[#3026A6]">
              {getInitials(fullName)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-bold">{fullName}</span>
              <span className="block text-sm text-white/72">{roleName}</span>
            </span>
            <ChevronDown size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}
