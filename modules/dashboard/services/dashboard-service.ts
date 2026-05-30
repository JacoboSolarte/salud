import { subMonths } from "date-fns";
import { IncidentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { incidentStatusLabels, incidentTypeLabels } from "@/modules/incidents/types/labels";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("es-CO", { month: "short" }).format(date).replace(".", "");
}

function percentageChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? "Sin variacion mensual" : "Sin base mensual previa";
  const value = ((current - previous) / previous) * 100;
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(0)}% frente al mes anterior`;
}

export async function getDashboardMetrics() {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const previousMonthStart = startOfMonth(subMonths(now, 1));
  const previousMonthEnd = endOfMonth(subMonths(now, 1));

  const [
    totalIncidents,
    currentMonthIncidents,
    previousMonthIncidents,
    inAnalysis,
    closedIncidents,
    completedActions,
    totalActions,
    recentIncidents,
    outcomes
  ] = await Promise.all([
    prisma.incidentReport.count({ where: { deletedAt: null } }),
    prisma.incidentReport.count({ where: { deletedAt: null, createdAt: { gte: currentMonthStart } } }),
    prisma.incidentReport.count({
      where: { deletedAt: null, createdAt: { gte: previousMonthStart, lte: previousMonthEnd } }
    }),
    prisma.incidentReport.count({ where: { deletedAt: null, status: IncidentStatus.IN_ANALYSIS } }),
    prisma.incidentReport.findMany({
      where: { deletedAt: null, status: IncidentStatus.CLOSED, closedAt: { not: null } },
      select: { createdAt: true, closedAt: true }
    }),
    prisma.safetyAction.count({ where: { deletedAt: null, status: "COMPLETED" } }),
    prisma.safetyAction.count({ where: { deletedAt: null } }),
    prisma.incidentReport.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        area: { select: { name: true } },
        reportedBy: { select: { name: true } }
      }
    }),
    prisma.incidentOutcome.groupBy({
      by: ["label"],
      _count: { _all: true }
    })
  ]);

  const averageClosureDays =
    closedIncidents.length === 0
      ? null
      : closedIncidents.reduce((total, incident) => {
          const closedAt = incident.closedAt ?? incident.createdAt;
          return total + (closedAt.getTime() - incident.createdAt.getTime()) / 86_400_000;
        }, 0) / closedIncidents.length;

  const monthly = await Promise.all(
    Array.from({ length: 6 }).map(async (_, index) => {
      const date = startOfMonth(subMonths(now, 5 - index));
      const count = await prisma.incidentReport.count({
        where: {
          deletedAt: null,
          createdAt: {
            gte: date,
            lte: endOfMonth(date)
          }
        }
      });

      return {
        month: monthLabel(date),
        incidentes: count
      };
    })
  );

  return {
    kpis: {
      totalIncidents,
      totalIncidentsDetail: percentageChange(currentMonthIncidents, previousMonthIncidents),
      inAnalysis,
      inAnalysisDetail: inAnalysis === 1 ? "Caso pendiente de analisis" : "Casos pendientes de analisis",
      averageClosureDays,
      averageClosureDetail: closedIncidents.length === 0 ? "Sin casos cerrados aun" : "Promedio calculado sobre casos cerrados",
      capaCompliance: totalActions === 0 ? null : Math.round((completedActions / totalActions) * 100),
      capaComplianceDetail: totalActions === 0 ? "Sin acciones registradas" : `${completedActions} de ${totalActions} acciones completadas`
    },
    monthly,
    outcomes: outcomes.map((outcome) => ({
      name: outcome.label,
      value: outcome._count._all
    })),
    recentIncidents: recentIncidents.map((incident) => ({
      id: incident.id,
      code: incident.code,
      type: incidentTypeLabels[incident.type],
      area: incident.area?.name ?? "Sin area asignada",
      status: incidentStatusLabels[incident.status],
      responsible: incident.reportedBy.name
    }))
  };
}
