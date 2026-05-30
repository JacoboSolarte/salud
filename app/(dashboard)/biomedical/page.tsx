import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { DeleteEquipmentButton } from "@/modules/biomedical/components/delete-equipment-button";
import { equipmentStatusLabels } from "@/modules/biomedical/schemas/equipment.schema";

export default async function BiomedicalPage() {
  await requirePermission(PERMISSIONS.BIOMEDICAL_MANAGE);
  const equipment = await prisma.biomedicalEquipment.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
    include: {
      area: { select: { name: true } },
      _count: { select: { incidents: true, maintenances: true } }
    }
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Gestion biomedica y tecnovigilancia</h1>
          <p className="text-sm text-muted-foreground">Inventario biomedico, incidentes asociados y mantenimientos.</p>
        </div>
        <Button asChild>
          <Link href="/biomedical/new">
            <Plus className="h-4 w-4" />
            Nuevo equipo
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Equipos biomedicos</CardTitle>
        </CardHeader>
        <CardContent>
          {equipment.length === 0 ? (
            <EmptyState message="Aun no hay equipos biomedicos registrados." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-sm">
                <thead className="border-b text-left text-muted-foreground">
                  <tr>
                    <th className="py-3 font-medium">Equipo</th>
                    <th className="py-3 font-medium">Marca</th>
                    <th className="py-3 font-medium">Modelo</th>
                    <th className="py-3 font-medium">Serie</th>
                    <th className="py-3 font-medium">Ubicacion</th>
                    <th className="py-3 font-medium">Area</th>
                    <th className="py-3 font-medium">Estado</th>
                    <th className="py-3 font-medium">Incidentes</th>
                    <th className="py-3 font-medium">Mantenimientos</th>
                    <th className="py-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {equipment.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-medium">{item.name}</td>
                      <td className="py-3">{item.brand ?? "Sin marca"}</td>
                      <td className="py-3">{item.model ?? "Sin modelo"}</td>
                      <td className="py-3">{item.serial ?? "Sin serie"}</td>
                      <td className="py-3">{item.location}</td>
                      <td className="py-3">{item.area?.name ?? "Sin area"}</td>
                      <td className="py-3">
                        <Badge variant="secondary">{equipmentStatusLabels[item.status]}</Badge>
                      </td>
                      <td className="py-3">{item._count.incidents}</td>
                      <td className="py-3">{item._count.maintenances}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/biomedical/${item.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                              Editar
                            </Link>
                          </Button>
                          <DeleteEquipmentButton equipmentId={item.id} name={item.name} />
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
