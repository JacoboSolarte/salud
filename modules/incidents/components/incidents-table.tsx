import Link from "next/link";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteIncidentButton } from "@/modules/incidents/components/delete-incident-button";

export function IncidentsTable({
  incidents
}: {
  incidents: Array<{
    id: string;
    code: string;
    type: string;
    status: string;
    notificationDate: string;
    eventDate: string;
    area: string;
    service: string;
    reporter: string;
    device: string;
    outcomes: string;
  }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes registrados</CardTitle>
      </CardHeader>
      <CardContent>
        {incidents.length === 0 ? (
          <div className="rounded-md border bg-background p-8 text-center text-sm text-muted-foreground">
            Aun no hay incidentes o eventos adversos registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="border-b text-left text-muted-foreground">
                <tr>
                  <th className="py-3 font-medium">Codigo</th>
                  <th className="py-3 font-medium">Tipo</th>
                  <th className="py-3 font-medium">Estado</th>
                  <th className="py-3 font-medium">Notificacion</th>
                  <th className="py-3 font-medium">Evento</th>
                  <th className="py-3 font-medium">Area</th>
                  <th className="py-3 font-medium">Servicio</th>
                  <th className="py-3 font-medium">Dispositivo</th>
                  <th className="py-3 font-medium">Reportante</th>
                  <th className="py-3 font-medium">Desenlace</th>
                  <th className="py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td className="py-3 font-medium">{incident.code}</td>
                    <td className="py-3">{incident.type}</td>
                    <td className="py-3">
                      <Badge variant="secondary">{incident.status}</Badge>
                    </td>
                    <td className="py-3">{incident.notificationDate}</td>
                    <td className="py-3">{incident.eventDate}</td>
                    <td className="py-3">{incident.area}</td>
                    <td className="py-3">{incident.service}</td>
                    <td className="py-3">{incident.device}</td>
                    <td className="py-3">{incident.reporter}</td>
                    <td className="py-3">{incident.outcomes}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/incidents/${incident.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            Editar
                          </Link>
                        </Button>
                        <DeleteIncidentButton incidentId={incident.id} code={incident.code} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
