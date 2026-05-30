"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { PERMISSIONS } from "@/config/permissions";
import { prisma } from "@/lib/prisma";
import { equipmentSchema } from "@/modules/biomedical/schemas/equipment.schema";

function nullableString(value?: string) {
  return value?.trim() ? value.trim() : null;
}

function nullableDate(value?: string) {
  return value ? new Date(value) : null;
}

async function requireBiomedicalPermission() {
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false as const, message: "La sesion expiro. Inicie sesion nuevamente." };
  }

  if (!session.user.permissions.includes(PERMISSIONS.BIOMEDICAL_MANAGE)) {
    return { ok: false as const, message: "No tiene permiso para gestionar equipos biomedicos." };
  }

  return { ok: true as const, userId: session.user.id };
}

export async function createEquipment(input: unknown) {
  const permission = await requireBiomedicalPermission();
  if (!permission.ok) return permission;

  const parsed = equipmentSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return { ok: false, message: firstError ?? "Revise los campos obligatorios." };
  }

  const data = parsed.data;

  try {
    const equipment = await prisma.biomedicalEquipment.create({
      data: {
        name: data.name,
        brand: nullableString(data.brand),
        model: nullableString(data.model),
        serial: nullableString(data.serial),
        manufacturer: nullableString(data.manufacturer),
        manufactureYear: data.manufactureYear,
        location: data.location,
        status: data.status,
        lastMaintenanceAt: nullableDate(data.lastMaintenanceAt),
        nextMaintenanceAt: nullableDate(data.nextMaintenanceAt),
        areaId: nullableString(data.areaId)
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: permission.userId,
        action: "biomedical.create",
        entity: "BiomedicalEquipment",
        entityId: equipment.id,
        metadata: { name: equipment.name, serial: equipment.serial }
      }
    });

    revalidatePath("/biomedical");
    return { ok: true, message: "Equipo biomedico creado correctamente.", id: equipment.id };
  } catch (error) {
    console.error("biomedical.create.failed", error);
    return { ok: false, message: "No fue posible crear el equipo. Verifique que la serie no exista previamente." };
  }
}

export async function updateEquipment(equipmentId: string, input: unknown) {
  const permission = await requireBiomedicalPermission();
  if (!permission.ok) return permission;

  const parsed = equipmentSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return { ok: false, message: firstError ?? "Revise los campos obligatorios." };
  }

  const data = parsed.data;

  try {
    const equipment = await prisma.biomedicalEquipment.update({
      where: { id: equipmentId },
      data: {
        name: data.name,
        brand: nullableString(data.brand),
        model: nullableString(data.model),
        serial: nullableString(data.serial),
        manufacturer: nullableString(data.manufacturer),
        manufactureYear: data.manufactureYear,
        location: data.location,
        status: data.status,
        lastMaintenanceAt: nullableDate(data.lastMaintenanceAt),
        nextMaintenanceAt: nullableDate(data.nextMaintenanceAt),
        areaId: nullableString(data.areaId)
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: permission.userId,
        action: "biomedical.update",
        entity: "BiomedicalEquipment",
        entityId: equipment.id,
        metadata: { name: equipment.name, serial: equipment.serial }
      }
    });

    revalidatePath("/biomedical");
    revalidatePath(`/biomedical/${equipmentId}/edit`);
    return { ok: true, message: "Equipo biomedico actualizado correctamente.", id: equipment.id };
  } catch (error) {
    console.error("biomedical.update.failed", error);
    return { ok: false, message: "No fue posible actualizar el equipo. Verifique que la serie no este duplicada." };
  }
}

export async function deleteEquipment(equipmentId: string) {
  const permission = await requireBiomedicalPermission();
  if (!permission.ok) return permission;

  const equipment = await prisma.biomedicalEquipment.findFirst({
    where: { id: equipmentId, deletedAt: null },
    select: { id: true, name: true, serial: true }
  });

  if (!equipment) {
    return { ok: false, message: "No se encontro el equipo o ya fue eliminado." };
  }

  await prisma.$transaction([
    prisma.biomedicalEquipment.update({
      where: { id: equipmentId },
      data: { deletedAt: new Date() }
    }),
    prisma.auditLog.create({
      data: {
        userId: permission.userId,
        action: "biomedical.delete",
        entity: "BiomedicalEquipment",
        entityId: equipmentId,
        metadata: { name: equipment.name, serial: equipment.serial }
      }
    })
  ]);

  revalidatePath("/biomedical");
  return { ok: true, message: "Equipo biomedico eliminado correctamente." };
}
