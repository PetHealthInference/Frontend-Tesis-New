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
    <div className="space-y-7">
      <section className="grid gap-5 md:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              className="group rounded-lg border border-slate-100 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,0.09)]"
              key={action.title}
              to={action.to}
            >
              <div className="flex items-center gap-5">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-violet-50 text-[#4635D3]">
                  <Icon size={32} strokeWidth={1.9} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-extrabold text-[#172554]">{action.title}</span>
                  <span className="mt-1 block text-sm font-medium text-slate-500">{action.description}</span>
                </span>
                <ChevronRight className="text-slate-400 transition group-hover:translate-x-1" size={24} />
              </div>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;
          const isDanger = item.tone === "danger";

          return (
            <Card className="p-6" key={item.label}>
              <div className="flex items-center gap-5">
                <span
                  className={
                    isDanger
                      ? "grid h-[74px] w-[74px] shrink-0 place-items-center rounded-full bg-red-50 text-red-600"
                      : "grid h-[74px] w-[74px] shrink-0 place-items-center rounded-full bg-violet-50 text-[#4635D3]"
                  }
                >
                  <Icon size={31} strokeWidth={1.9} />
                </span>
                <div>
                  <h3 className="text-base font-extrabold leading-5 text-[#172554]">{item.label}</h3>
                  <p className="mt-2 text-3xl font-extrabold leading-none text-[#4635D3]">{item.value}</p>
                  <p className={isDanger ? "mt-2 text-sm font-semibold text-red-500" : "mt-2 text-sm font-semibold text-emerald-600"}>
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

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <PanelHeader title="Ultimas evaluaciones clinicas" to="/evaluations" />
          <DataTable
            columns={["Paciente", "Especie / Raza", "Fecha de evaluacion", "Resultado sugerido", "Riesgo", "Accion"]}
            rows={dashboard.recentEvaluations}
            renderRow={(row: RecentEvaluation) => (
              <tr key={row.id}>
                <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-700">{row.patient}</td>
                <td className="min-w-36 px-5 py-4">{row.speciesBreed}</td>
                <td className="whitespace-nowrap px-5 py-4">{row.date}</td>
                <td className="min-w-40 px-5 py-4">{row.result}</td>
                <td className="whitespace-nowrap px-5 py-4">
                  <StatusBadge risk={row.risk} />
                </td>
                <td className="px-5 py-4">
                  <Button aria-label={`Ver evaluacion de ${row.patient}`} className="h-9 w-9 p-0" variant="secondary">
                    <Eye size={17} />
                  </Button>
                </td>
              </tr>
            )}
          />
        </Card>

        <Card>
          <PanelHeader title="Pacientes recientes" to="/patients" />
          <DataTable
            columns={["Paciente", "Especie / Raza", "Propietario", "Ultima evaluacion", "Accion"]}
            rows={dashboard.recentPatients}
            renderRow={(row: RecentPatient) => (
              <tr key={row.id}>
                <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-700">{row.patient}</td>
                <td className="min-w-36 px-5 py-4">{row.speciesBreed}</td>
                <td className="whitespace-nowrap px-5 py-4">{row.owner}</td>
                <td className="min-w-36 px-5 py-4">{row.lastEvaluation}</td>
                <td className="px-5 py-4">
                  <Button variant="secondary">Ver detalle</Button>
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
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
      <h2 className="text-lg font-extrabold text-[#172554]">{title}</h2>
      <Link className="text-sm font-extrabold text-[#4635D3] hover:text-[#3026A6]" to={to}>
        Ver todas
      </Link>
    </div>
  );
}
