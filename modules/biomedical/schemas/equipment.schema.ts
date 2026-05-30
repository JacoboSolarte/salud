import { z } from "zod";

const optionalInteger = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.coerce.number().int().optional()
);

const optionalDate = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.string().optional()
);

export const equipmentSchema = z.object({
  name: z.string().min(2, "El nombre del equipo es obligatorio"),
  brand: z.string().optional(),
  model: z.string().optional(),
  serial: z.string().optional(),
  manufacturer: z.string().optional(),
  manufactureYear: optionalInteger.pipe(z.coerce.number().int().min(1900).max(2100).optional()),
  location: z.string().min(2, "La ubicacion es obligatoria"),
  status: z.enum(["ACTIVE", "IN_MAINTENANCE", "OUT_OF_SERVICE", "RETIRED"]),
  areaId: z.string().optional(),
  lastMaintenanceAt: optionalDate,
  nextMaintenanceAt: optionalDate
});

export type EquipmentInput = z.infer<typeof equipmentSchema>;

export const equipmentStatusLabels: Record<EquipmentInput["status"], string> = {
  ACTIVE: "Activo",
  IN_MAINTENANCE: "En mantenimiento",
  OUT_OF_SERVICE: "Fuera de servicio",
  RETIRED: "Retirado"
};
