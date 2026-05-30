import { prisma } from "@/lib/prisma";
import type { SafetyActionInput } from "@/modules/actions/schemas/safety-action.schema";

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getSafetyActionForEdit(id: string): Promise<SafetyActionInput | null> {
  const action = await prisma.safetyAction.findFirst({ where: { id, deletedAt: null } });
  if (!action) return null;
  return {
    incidentReportId: action.incidentReportId,
    type: action.type,
    title: action.title,
    description: action.description,
    status: action.status,
    dueDate: toDateInput(action.dueDate),
    assigneeId: action.assigneeId ?? "",
    evidenceNotes: action.evidenceNotes ?? ""
  };
}

export async function getActionFormOptions() {
  const [incidents, users] = await Promise.all([
    prisma.incidentReport.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      select: { id: true, code: true }
    }),
    prisma.user.findMany({
      where: { active: true, deletedAt: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true }
    })
  ]);

  return { incidents, users };
}
