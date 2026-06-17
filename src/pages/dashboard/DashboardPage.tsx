import { ChevronRight, ClipboardPlus, Eye, PawPrint, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { DataTable } from "../../components/common/DataTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { dashboardService } from "../../services/dashboard.service";
import type { DashboardData, QuickAction, RecentEvaluation, RecentPatient, SummaryCard } from "../../types/dashboard";

const quickActions: QuickAction[] = [
  {
    title: "Nuevo propietario",
    description: "Registrar un nuevo propietario",
    to: "/owners",
    icon: UserPlus,
  },
  {
    title: "Nuevo paciente",
    description: "Registrar un nuevo paciente",
    to: "/patients",
    icon: PawPrint,
  },
  {
    title: "Nueva evaluacion",
    description: "Crear una nueva evaluacion",
    to: "/evaluations",
    icon: ClipboardPlus,
  },
];

const initialDashboard: DashboardData = {
  recentEvaluations: [],
  recentPatients: [],
};

export function DashboardPage() {
  const [summary, setSummary] = useState<SummaryCard[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData>(initialDashboard);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      const [summaryData, dashboardData] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getDashboard(),
      ]);

      if (isMounted) {
        setSummary(summaryData);
        setDashboard(dashboardData);
        setIsLoading(false);
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              className="group rounded-lg border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,0.09)]"
              key={action.title}
              to={action.to}
            >
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-violet-50 text-[#4635D3]">
                  <Icon size={25} strokeWidth={1.9} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-extrabold text-[#172554]">{action.title}</span>
                  <span className="mt-1 block text-sm font-medium text-slate-500">{action.description}</span>
                </span>
                <ChevronRight className="text-slate-400 transition group-hover:translate-x-1" size={20} />
              </div>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;
          const isDanger = item.tone === "danger";

          return (
            <Card className="p-4" key={item.label}>
              <div className="flex items-center gap-4">
                <span
                  className={
                    isDanger
                      ? "grid h-14 w-14 shrink-0 place-items-center rounded-full bg-red-50 text-red-600"
                      : "grid h-14 w-14 shrink-0 place-items-center rounded-full bg-violet-50 text-[#4635D3]"
                  }
                >
                  <Icon size={24} strokeWidth={1.9} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold leading-5 text-[#172554]">{item.label}</h3>
                  <p className="mt-1 text-2xl font-extrabold leading-none text-[#4635D3]">{item.value}</p>
                  <p className={isDanger ? "mt-1 text-xs font-semibold text-red-500" : "mt-1 text-xs font-semibold text-emerald-600"}>
                    {item.change}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      {isLoading ? (
        <Card className="p-6 text-sm font-semibold text-slate-500">Cargando resumen clinico...</Card>
      ) : null}

      <section className="grid gap-5 2xl:grid-cols-2">
        <Card>
          <PanelHeader title="Ultimas evaluaciones clinicas" to="/evaluations" />
          <DataTable
            compact
            columns={["Paciente", "Especie / Raza", "Fecha", "Resultado", "Riesgo", "Accion"]}
            emptyMessage="Aun no hay evaluaciones clinicas registradas."
            rows={dashboard.recentEvaluations}
            renderRow={(row: RecentEvaluation) => (
              <tr key={row.id}>
                <td className="whitespace-nowrap px-3 py-3 font-bold text-slate-700">{row.patient}</td>
                <td className="max-w-[150px] truncate px-3 py-3">{row.speciesBreed}</td>
                <td className="whitespace-nowrap px-3 py-3">{row.date}</td>
                <td className="max-w-[180px] truncate px-3 py-3">{row.result}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  <StatusBadge risk={row.risk} />
                </td>
                <td className="px-3 py-3">
                  <Button aria-label={`Ver evaluacion de ${row.patient}`} className="h-8 w-8 p-0" variant="secondary">
                    <Eye size={15} />
                  </Button>
                </td>
              </tr>
            )}
          />
        </Card>

        <Card>
          <PanelHeader title="Pacientes recientes" to="/patients" />
          <DataTable
            compact
            columns={["Paciente", "Especie / Raza", "Propietario", "Ult. evaluacion", "Accion"]}
            emptyMessage="Aun no hay pacientes registrados."
            rows={dashboard.recentPatients}
            renderRow={(row: RecentPatient) => (
              <tr key={row.id}>
                <td className="whitespace-nowrap px-3 py-3 font-bold text-slate-700">{row.patient}</td>
                <td className="max-w-[150px] truncate px-3 py-3">{row.speciesBreed}</td>
                <td className="max-w-[140px] truncate px-3 py-3">{row.owner}</td>
                <td className="whitespace-nowrap px-3 py-3">{row.lastEvaluation}</td>
                <td className="px-3 py-3">
                  <Button className="h-8 px-3 text-xs" variant="secondary">Ver detalle</Button>
                </td>
              </tr>
            )}
          />
        </Card>
      </section>
    </div>
  );
}

function PanelHeader({ title, to }: { title: string; to: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
      <h2 className="text-base font-extrabold text-[#172554]">{title}</h2>
      <Link className="text-sm font-extrabold text-[#4635D3] hover:text-[#3026A6]" to={to}>
        Ver todas
      </Link>
    </div>
  );
}
