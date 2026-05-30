import { Activity, AlarmClock, CheckCircle2, ClipboardList } from "lucide-react";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/authz";
import { KpiCard } from "@/modules/dashboard/components/kpi-card";
import { DashboardCharts } from "@/modules/dashboard/components/dashboard-charts";
import { getDashboardMetrics } from "@/modules/dashboard/services/dashboard-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  await requirePermission(PERMISSIONS.DASHBOARD_READ);
  const metrics = await getDashboardMetrics();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-normal">Centro de control institucional</h1>
        <p className="text-sm text-muted-foreground">
          Gestion de incidentes, eventos adversos, tecnovigilancia y acciones de mejora.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total incidentes"
          value={metrics.kpis.totalIncidents.toString()}
          detail={metrics.kpis.totalIncidentsDetail}
          icon={ClipboardList}
        />
        <KpiCard
          title="En analisis"
          value={metrics.kpis.inAnalysis.toString()}
          detail={metrics.kpis.inAnalysisDetail}
          icon={Activity}
        />
        <KpiCard
          title="Cierre promedio"
          value={metrics.kpis.averageClosureDays === null ? "Sin datos" : `${metrics.kpis.averageClosureDays.toFixed(1)} dias`}
          detail={metrics.kpis.averageClosureDetail}
          icon={AlarmClock}
        />
        <KpiCard
          title="Cumplimiento CAPA"
          value={metrics.kpis.capaCompliance === null ? "Sin datos" : `${metrics.kpis.capaCompliance}%`}
          detail={metrics.kpis.capaComplianceDetail}
          icon={CheckCircle2}
        />
      </div>
      <DashboardCharts monthly={metrics.monthly} outcomes={metrics.outcomes} />
      <Card>
        <CardHeader>
          <CardTitle>Casos recientes</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b text-left text-muted-foreground">
              <tr>
                <th className="py-3 font-medium">Codigo</th>
                <th className="py-3 font-medium">Tipo</th>
                <th className="py-3 font-medium">Area</th>
                <th className="py-3 font-medium">Estado</th>
                <th className="py-3 font-medium">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {metrics.recentIncidents.map((row) => (
                <tr key={row.id}>
                  <td className="py-3 font-medium">{row.code}</td>
                  <td className="py-3">{row.type}</td>
                  <td className="py-3">{row.area}</td>
                  <td className="py-3">
                    <Badge variant="secondary">{row.status}</Badge>
                  </td>
                  <td className="py-3">{row.responsible}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {metrics.recentIncidents.length === 0 ? (
            <div className="mt-4 rounded-md border bg-background p-6 text-center text-sm text-muted-foreground">
              No hay reportes registrados todavia.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
