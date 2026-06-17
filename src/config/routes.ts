import {
  BookOpen,
  ClipboardList,
  FileClock,
  Home,
  LineChart,
  PawPrint,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

export const routes = [
  { path: "/", label: "Inicio", icon: Home },
  { path: "/owners", label: "Propietarios", icon: Users },
  { path: "/patients", label: "Pacientes", icon: PawPrint },
  { path: "/evaluations", label: "Evaluaciones", icon: ClipboardList },
  { path: "/results", label: "Resultados", icon: LineChart },
  //{ path: "/activated-rules", label: "Reglas activadass", icon: ShieldCheck },
  { path: "/history", label: "Historial clinico", icon: FileClock },
  { path: "/knowledge", label: "Base de conocimiento", icon: BookOpen },
  { path: "/settings", label: "Configuracion", icon: Settings },
] as const;
