import Link from "next/link";
import { ClipboardPlus } from "lucide-react";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/authz";
import { getIncidentList } from "@/modules/incidents/services/incident-service";
import { IncidentsTable } from "@/modules/incidents/components/incidents-table";
import { Button } from "@/components/ui/button";

export default async function IncidentsPage() {
  await requirePermission(PERMISSIONS.INCIDENTS_READ);
  const incidents = await getIncidentList();

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Gestion de incidentes y eventos adversos</h1>
          <p className="text-sm text-muted-foreground">
            Consulta los reportes radicados, su estado actual y la informacion clinica principal.
          </p>
        </div>
        <Button asChild>
          <Link href="/incidents/new">
            <ClipboardPlus className="h-4 w-4" />
            Nuevo reporte
          </Link>
        </Button>
      </div>
      <IncidentsTable incidents={incidents} />
    </div>
  );
}
