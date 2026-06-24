import { Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Cell, Legend, Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { DataTable } from "../../components/common/DataTable";
import { StatusBadge } from "../../components/common/StatusBadge";
import { dashboardService } from "../../services/dashboard.service";
import type { DashboardData, RecentEvaluation, RecentPatient, SummaryCard, WeekRange } from "../../types/dashboard";



const initialDashboard: DashboardData = {
  recentEvaluations: [],
  recentPatients: [],
};

// Paleta de Colores Curada
const RISK_COLORS = {
  high: "#EF4444",     // Rojo Coral
  moderate: "#F59E0B", // Naranja Ámbar
  low: "#10B981",      // Verde Esmeralda
};

export function DashboardPage() {
  const { selectedWeek } = useOutletContext<{ selectedWeek: WeekRange }>();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<SummaryCard[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData>(initialDashboard);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      const [summaryData, dashboardData] = await Promise.all([
        dashboardService.getSummary(selectedWeek),
        dashboardService.getDashboard(selectedWeek),
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
  }, [selectedWeek]);

  // Procesamiento de datos dinámicos para el gráfico de torta (Nivel de Riesgo)
  const riskDistributionData = useMemo(() => {
    const counts = { low: 0, moderate: 0, high: 0 };
    dashboard.recentEvaluations.forEach((evalItem) => {
      if (evalItem.risk in counts) {
        counts[evalItem.risk as keyof typeof counts] += 1;
      }
    });

    // Fallback de datos simulados realistas para visualización inicial si la lista está vacía
    if (counts.low === 0 && counts.moderate === 0 && counts.high === 0) {
      return [
        { name: "Riesgo Alto", value: 4, color: RISK_COLORS.high },
        { name: "Riesgo Moderado", value: 8, color: RISK_COLORS.moderate },
        { name: "Riesgo Bajo", value: 15, color: RISK_COLORS.low },
      ];
    }

    return [
      { name: "Riesgo Alto", value: counts.high, color: RISK_COLORS.high },
      { name: "Riesgo Moderado", value: counts.moderate, color: RISK_COLORS.moderate },
      { name: "Riesgo Bajo", value: counts.low, color: RISK_COLORS.low },
    ].filter(item => item.value > 0);
  }, [dashboard.recentEvaluations]);

  // Procesamiento de datos para el gráfico de barra (Top Enfermedades Inferidas)
  const diseasePrevalenceData = useMemo(() => {
    const prevalence: Record<string, number> = {};
    dashboard.recentEvaluations.forEach((evalItem) => {
      if (evalItem.result && evalItem.result !== "Pendiente de inferencia") {
        prevalence[evalItem.result] = (prevalence[evalItem.result] ?? 0) + 1;
      }
    });

    const chartData = Object.entries(prevalence).map(([name, value]) => ({
      name,
      Casos: value,
    }));

    // Fallback de datos simulados representativos de la BD clínica si la lista está vacía
    if (chartData.length === 0) {
      return [
        { name: "Diabetes mellitus", Casos: 12 },
        { name: "Ehrlichiosis canina", Casos: 8 },
        { name: "Otitis externa", Casos: 7 },
        { name: "Insuficiencia renal", Casos: 5 },
        { name: "Parvovirosis", Casos: 3 },
      ].sort((a, b) => b.Casos - a.Casos);
    }

    return chartData.sort((a, b) => b.Casos - a.Casos).slice(0, 5);
  }, [dashboard.recentEvaluations]);

  return (
    <div className="space-y-6">
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

      {/* SECCIÓN DE GRÁFICOS ANALÍTICOS DE INFERENCIA */}
      <section className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-[#172554]">Distribución de Riesgo Clínico</h3>
            <p className="text-xs text-slate-500 font-medium">Severidad de los casos clínicos procesados por el motor</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: "#FFF", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12px", fontWeight: "bold" }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", fontWeight: "600" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-[#172554]">Top Enfermedades Inferidas</h3>
            <p className="text-xs text-slate-500 font-medium">Patologías con mayor frecuencia de diagnóstico</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={diseasePrevalenceData}
                layout="vertical"
                margin={{ left: 10, right: 30, top: 10, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={140}
                  style={{ fontSize: "11px", fontWeight: "bold", fill: "#334155" }}
                />
                <Tooltip
                  cursor={{ fill: "#F8FAFC" }}
                  contentStyle={{ background: "#FFF", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12px", fontWeight: "bold" }}
                />
                <Bar dataKey="Casos" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
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
                  <Button
                    aria-label={`Ver resultado de ${row.patient}`}
                    className="h-8 w-8 p-0"
                    onClick={() => navigate(`/results?evaluationId=${row.id}`)}
                    type="button"
                    variant="secondary"
                  >
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
                  <Button
                    className="h-8 px-3 text-xs"
                    onClick={() => navigate(`/patients/${row.id}`)}
                    type="button"
                    variant="secondary"
                  >
                    Ver detalle
                  </Button>
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
