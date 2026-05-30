import Link from "next/link";
import { Download } from "lucide-react";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default async function ReportsPage() {
  await requirePermission(PERMISSIONS.REPORTS_EXPORT);
  const [incidents, equipment, actions, indicators] = await Promise.all([
    prisma.incidentReport.count({ where: { deletedAt: null } }),
    prisma.biomedicalEquipment.count({ where: { deletedAt: null } }),
    prisma.safetyAction.count({ where: { deletedAt: null } }),
    prisma.indicator.findMany({ orderBy: { updatedAt: "desc" } })
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Reportes e indicadores</h1>
          <p className="text-sm text-muted-foreground">Consolidado institucional para seguimiento y toma de decisiones.</p>
        </div>
        <Button asChild>
          <Link href="/api/reports/incidents">
            <Download className="h-4 w-4" />
            Exportar incidentes CSV
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Incidentes disponibles" value={incidents} />
        <SummaryCard title="Equipos disponibles" value={equipment} />
        <SummaryCard title="Acciones disponibles" value={actions} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Indicadores calculados</CardTitle>
        </CardHeader>
        <CardContent>
          {indicators.length === 0 ? (
            <EmptyState message="Aun no hay indicadores historicos almacenados." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="border-b text-left text-muted-foreground">
                  <tr>
                    <th className="py-3 font-medium">Indicador</th>
                    <th className="py-3 font-medium">Valor</th>
                    <th className="py-3 font-medium">Periodo inicial</th>
                    <th className="py-3 font-medium">Periodo final</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {indicators.map((indicator) => (
                    <tr key={indicator.id}>
                      <td className="py-3 font-medium">{indicator.name}</td>
                      <td className="py-3">{indicator.value.toString()}</td>
                      <td className="py-3">{new Intl.DateTimeFormat("es-CO").format(indicator.periodStart)}</td>
                      <td className="py-3">{new Intl.DateTimeFormat("es-CO").format(indicator.periodEnd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-2 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
