import { z } from "zod";

export const safetyActionSchema = z.object({
  incidentReportId: z.string().min(1, "Seleccione un incidente"),
  type: z.enum(["CORRECTIVE", "PREVENTIVE"]),
  title: z.string().min(3, "El titulo es obligatorio"),
  description: z.string().min(5, "La descripcion es obligatoria"),
  status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED", "OVERDUE", "CANCELLED"]),
  dueDate: z.string().min(1, "La fecha limite es obligatoria"),
  assigneeId: z.string().optional(),
  evidenceNotes: z.string().optional()
});

export type SafetyActionInput = z.infer<typeof safetyActionSchema>;

export const actionTypeLabels: Record<SafetyActionInput["type"], string> = {
  CORRECTIVE: "Correctiva",
  PREVENTIVE: "Preventiva"
};

export const actionStatusLabels: Record<SafetyActionInput["status"], string> = {
  OPEN: "Abierta",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completada",
  OVERDUE: "Vencida",
  CANCELLED: "Cancelada"
};
