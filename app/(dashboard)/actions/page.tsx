import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { DeleteSafetyActionButton } from "@/modules/actions/components/delete-safety-action-button";
import { actionStatusLabels, actionTypeLabels } from "@/modules/actions/schemas/safety-action.schema";

export default async function ActionsPage() {
  await requirePermission(PERMISSIONS.ACTIONS_MANAGE);
  const actions = await prisma.safetyAction.findMany({
    where: { deletedAt: null },
    orderBy: { dueDate: "asc" },
    include: {
      incidentReport: { select: { code: true } },
      assignee: { select: { name: true } }
    }
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Acciones correctivas y preventivas</h1>
          <p className="text-sm text-muted-foreground">Seguimiento de acciones CAPA asociadas a reportes institucionales.</p>
        </div>
        <Button asChild>
          <Link href="/actions/new">
            <Plus className="h-4 w-4" />
            Nueva accion
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Acciones registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {actions.length === 0 ? (
            <EmptyState message="Aun no hay acciones correctivas o preventivas registradas." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="border-b text-left text-muted-foreground">
                  <tr>
                    <th className="py-3 font-medium">Accion</th>
                    <th className="py-3 font-medium">Tipo</th>
                    <th className="py-3 font-medium">Estado</th>
                    <th className="py-3 font-medium">Incidente</th>
                    <th className="py-3 font-medium">Responsable</th>
                    <th className="py-3 font-medium">Fecha limite</th>
                    <th className="py-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {actions.map((action) => (
                    <tr key={action.id}>
                      <td className="py-3 font-medium">{action.title}</td>
                      <td className="py-3">{actionTypeLabels[action.type]}</td>
                      <td className="py-3">
                        <Badge variant="secondary">{actionStatusLabels[action.status]}</Badge>
                      </td>
                      <td className="py-3">{action.incidentReport.code}</td>
                      <td className="py-3">{action.assignee?.name ?? "Sin responsable"}</td>
                      <td className="py-3">{new Intl.DateTimeFormat("es-CO").format(action.dueDate)}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/actions/${action.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                              Editar
                            </Link>
                          </Button>
                          <DeleteSafetyActionButton actionId={action.id} />
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
    </div>
  );
}
