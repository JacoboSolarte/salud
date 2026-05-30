import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PERMISSIONS } from "@/config/permissions";
import { prisma } from "@/lib/prisma";
import { incidentStatusLabels, incidentTypeLabels } from "@/modules/incidents/types/labels";

export const runtime = "nodejs";

function csvCell(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.permissions.includes(PERMISSIONS.REPORTS_EXPORT)) {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  const incidents = await prisma.incidentReport.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      area: { select: { name: true } },
      service: { select: { name: true } },
      reportedBy: { select: { name: true, email: true } },
      deviceInfo: { select: { genericName: true, brand: true, modelReference: true } },
      reporterInfo: { select: { name: true, profession: true, email: true } },
      outcomes: { select: { label: true } }
    }
  });

  const header = [
    "Codigo",
    "Tipo",
    "Estado",
    "Fecha notificacion",
    "Fecha evento",
    "Institucion",
    "Ciudad",
    "Departamento",
    "Area",
    "Servicio",
    "Dispositivo",
    "Desenlaces",
    "Reportante",
    "Cargo reportante",
    "Usuario registra"
  ];

  const rows = incidents.map((incident) => [
    incident.code,
    incidentTypeLabels[incident.type],
    incidentStatusLabels[incident.status],
    incident.notificationDate.toISOString().slice(0, 10),
    incident.eventDate.toISOString().slice(0, 10),
    incident.institutionName,
    incident.city,
    incident.department,
    incident.area?.name,
    incident.service?.name,
    incident.deviceInfo?.genericName,
    incident.outcomes.map((outcome) => outcome.label).join("; "),
    incident.reporterInfo?.name,
    incident.reporterInfo?.profession,
    incident.reportedBy.name
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="incidentes-${new Date().toISOString().slice(0, 10)}.csv"`
    }
  });
}
