"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { PERMISSIONS } from "@/config/permissions";
import { prisma } from "@/lib/prisma";
import { safetyActionSchema } from "@/modules/actions/schemas/safety-action.schema";

async function requireActionPermission() {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, message: "La sesion expiro. Inicie sesion nuevamente." };
  if (!session.user.permissions.includes(PERMISSIONS.ACTIONS_MANAGE)) {
    return { ok: false as const, message: "No tiene permiso para gestionar acciones." };
  }
  return { ok: true as const, userId: session.user.id };
}

function nullableString(value?: string) {
  return value?.trim() ? value.trim() : null;
}

export async function createSafetyAction(input: unknown) {
  const permission = await requireActionPermission();
  if (!permission.ok) return permission;

  const parsed = safetyActionSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return { ok: false, message: firstError ?? "Revise los campos obligatorios." };
  }

  const data = parsed.data;
  const action = await prisma.safetyAction.create({
    data: {
      incidentReportId: data.incidentReportId,
      type: data.type,
      title: data.title,
      description: data.description,
      status: data.status,
      dueDate: new Date(data.dueDate),
      assigneeId: nullableString(data.assigneeId),
      evidenceNotes: nullableString(data.evidenceNotes),
      createdById: permission.userId
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: permission.userId,
      action: "safetyAction.create",
      entity: "SafetyAction",
      entityId: action.id
    }
  });

  revalidatePath("/actions");
  return { ok: true, message: "Accion creada correctamente.", id: action.id };
}

export async function updateSafetyAction(id: string, input: unknown) {
  const permission = await requireActionPermission();
  if (!permission.ok) return permission;

  const parsed = safetyActionSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return { ok: false, message: firstError ?? "Revise los campos obligatorios." };
  }

  const data = parsed.data;
  await prisma.safetyAction.update({
    where: { id },
    data: {
      incidentReportId: data.incidentReportId,
      type: data.type,
      title: data.title,
      description: data.description,
      status: data.status,
      dueDate: new Date(data.dueDate),
      assigneeId: nullableString(data.assigneeId),
      evidenceNotes: nullableString(data.evidenceNotes),
      completedAt: data.status === "COMPLETED" ? new Date() : null
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: permission.userId,
      action: "safetyAction.update",
      entity: "SafetyAction",
      entityId: id
    }
  });

  revalidatePath("/actions");
  revalidatePath(`/actions/${id}/edit`);
  return { ok: true, message: "Accion actualizada correctamente.", id };
}

export async function deleteSafetyAction(id: string) {
  const permission = await requireActionPermission();
  if (!permission.ok) return permission;

  await prisma.$transaction([
    prisma.safetyAction.update({ where: { id }, data: { deletedAt: new Date() } }),
    prisma.auditLog.create({
      data: {
        userId: permission.userId,
        action: "safetyAction.delete",
        entity: "SafetyAction",
        entityId: id
      }
    })
  ]);

  revalidatePath("/actions");
  return { ok: true, message: "Accion eliminada correctamente." };
}
