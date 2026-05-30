import { z } from "zod";

export const rootCauseSchema = z.object({
  incidentReportId: z.string().min(1, "Seleccione un incidente"),
  title: z.string().min(3, "El titulo es obligatorio"),
  conclusion: z.string().optional(),
  personal: z.string().optional(),
  processes: z.string().optional(),
  equipment: z.string().optional(),
  environment: z.string().optional(),
  materials: z.string().optional(),
  why1: z.string().optional(),
  why2: z.string().optional(),
  why3: z.string().optional(),
  why4: z.string().optional(),
  why5: z.string().optional()
});

export type RootCauseInput = z.infer<typeof rootCauseSchema>;

export const ishikawaLabels = {
  Personal: "Personal",
  Procesos: "Procesos",
  Equipos: "Equipos",
  Entorno: "Entorno",
  Materiales: "Materiales"
} as const;
