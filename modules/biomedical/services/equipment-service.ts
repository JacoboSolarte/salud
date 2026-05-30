import { prisma } from "@/lib/prisma";
import { EquipmentInput } from "@/modules/biomedical/schemas/equipment.schema";

function toDateInput(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export async function getEquipmentForEdit(id: string): Promise<EquipmentInput | null> {
  const equipment = await prisma.biomedicalEquipment.findFirst({
    where: { id, deletedAt: null }
  });

  if (!equipment) return null;

  return {
    name: equipment.name,
    brand: equipment.brand ?? "",
    model: equipment.model ?? "",
    serial: equipment.serial ?? "",
    manufacturer: equipment.manufacturer ?? "",
    manufactureYear: equipment.manufactureYear ?? undefined,
    location: equipment.location,
    status: equipment.status,
    areaId: equipment.areaId ?? "",
    lastMaintenanceAt: toDateInput(equipment.lastMaintenanceAt),
    nextMaintenanceAt: toDateInput(equipment.nextMaintenanceAt)
  };
}

export async function getAreaOptions() {
  return prisma.area.findMany({
    where: { active: true, deletedAt: null },
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  });
}
