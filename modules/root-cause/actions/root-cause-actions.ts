"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { PERMISSIONS } from "@/config/permissions";
import { prisma } from "@/lib/prisma";
import { RootCauseInput, rootCauseSchema } from "@/modules/root-cause/schemas/root-cause.schema";

async function requireAnalyzePermission() {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, message: "La sesion expiro. Inicie sesion nuevamente." };
  if (!session.user.permissions.includes(PERMISSIONS.INCIDENTS_ANALYZE)) {
    return { ok: false as const, message: "No tiene permiso para gestionar causa raiz." };
  }
  return { ok: true as const, userId: session.user.id };
}

function buildIshikawa(input: RootCauseInput) {
  return [
    ["Personal", input.personal],
    ["Procesos", input.processes],
    ["Equipos", input.equipment],
    ["Entorno", input.environment],
    ["Materiales", input.materials]
  ]
    .filter(([, value]) => value?.trim())
    .map(([category, value]) => ({
      category: category ?? "",
      contributingFactors: value,
      description: value
    }));
}

function buildFiveWhys(input: RootCauseInput) {
  return [input.why1, input.why2, input.why3, input.why4, input.why5]
    .map((answer, index) => ({ answer, sequence: index + 1 }))
    .filter((why) => why.answer?.trim())
    .map((why) => ({
      sequence: why.sequence,
      question: `Por que ${why.sequence}?`,
      answer: why.answer ?? ""
    }));
}

export async function createRootCause(input: unknown) {
  const permission = await requireAnalyzePermission();
  if (!permission.ok) return permission;

  const parsed = rootCauseSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return { ok: false, message: firstError ?? "Revise los campos obligatorios." };
  }

  const data = parsed.data;
  const analysis = await prisma.rootCauseAnalysis.create({
    data: {
      incidentReportId: data.incidentReportId,
      title: data.title,
      conclusion: data.conclusion || null,
      createdById: permission.userId,
      ishikawaCategories: { create: buildIshikawa(data) },
      fiveWhys: { create: buildFiveWhys(data) }
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: permission.userId,
      action: "rootCause.create",
      entity: "RootCauseAnalysis",
      entityId: analysis.id
    }
  });

  revalidatePath("/root-cause");
  return { ok: true, message: "Analisis causa raiz creado correctamente.", id: analysis.id };
}

export async function updateRootCause(id: string, input: unknown) {
  const permission = await requireAnalyzePermission();
  if (!permission.ok) return permission;

  const parsed = rootCauseSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return { ok: false, message: firstError ?? "Revise los campos obligatorios." };
  }

  const data = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.rootCauseAnalysis.update({
      where: { id },
      data: {
        incidentReportId: data.incidentReportId,
        title: data.title,
        conclusion: data.conclusion || null
      }
    });
    await tx.ishikawaCategory.deleteMany({ where: { rootCauseAnalysisId: id } });
    await tx.fiveWhy.deleteMany({ where: { rootCauseAnalysisId: id } });
    await tx.ishikawaCategory.createMany({
      data: buildIshikawa(data).map((item) => ({ ...item, rootCauseAnalysisId: id }))
    });
    await tx.fiveWhy.createMany({
      data: buildFiveWhys(data).map((item) => ({ ...item, rootCauseAnalysisId: id }))
    });
    await tx.auditLog.create({
      data: {
        userId: permission.userId,
        action: "rootCause.update",
        entity: "RootCauseAnalysis",
        entityId: id
      }
    });
  });

  revalidatePath("/root-cause");
  revalidatePath(`/root-cause/${id}/edit`);
  return { ok: true, message: "Analisis causa raiz actualizado correctamente.", id };
}

export async function deleteRootCause(id: string) {
  const permission = await requireAnalyzePermission();
  if (!permission.ok) return permission;

  await prisma.$transaction([
    prisma.rootCauseAnalysis.update({ where: { id }, data: { deletedAt: new Date() } }),
    prisma.auditLog.create({
      data: {
        userId: permission.userId,
        action: "rootCause.delete",
        entity: "RootCauseAnalysis",
        entityId: id
      }
    })
  ]);

  revalidatePath("/root-cause");
  return { ok: true, message: "Analisis eliminado correctamente." };
}
