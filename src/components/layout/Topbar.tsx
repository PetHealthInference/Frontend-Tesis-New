import { Calendar, ChevronDown, Menu } from "lucide-react";
import type { User } from "../../types/user";

type TopbarProps = {
  currentUser: User | null;
  onOpenSidebar: () => void;
};

function formatCurrentDate() {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function getFirstName(fullName?: string) {
  return fullName?.trim().split(/\s+/)[0] ?? "Usuario";
}

export function Topbar({ currentUser, onOpenSidebar }: TopbarProps) {
  const roleName = currentUser?.role?.name?.toLowerCase();
  const title = roleName === "veterinario" ? "Dr." : "";
  const greetingName = [title, getFirstName(currentUser?.full_name)].filter(Boolean).join(" ");

  return (
    <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <button
          className="mt-1 rounded-lg border border-slate-200 bg-white p-2 text-[#3026A6] shadow-sm lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-normal text-[#172554]">Hola, {greetingName}!</h1>
        </div>
      </div>

      <button className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 shadow-sm">
        <Calendar size={19} />
        <span className="capitalize">{formatCurrentDate()}</span>
        <ChevronDown size={18} />
      </button>
    </header>
  );
}
