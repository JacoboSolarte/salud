import { z } from "zod";

const optionalNumber = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.coerce.number().optional()
);

export const incidentOutcomes = [
  "death",
  "lifeThreateningDamage",
  "hospitalization",
  "bodyFunctionDamage",
  "medicalIntervention",
  "noDamage",
  "other"
] as const;

export const incidentReportSchema = z.object({
  type: z.enum(["INCIDENT", "ADVERSE_EVENT", "SENTINEL_EVENT", "NEAR_MISS"]),
  status: z.enum(["REPORTED", "IN_ANALYSIS", "IN_FOLLOW_UP", "CLOSED", "REOPENED"]).default("REPORTED"),
  notificationDate: z.string().min(1, "La fecha de notificacion es obligatoria"),
  institutionName: z.string().min(3, "La institucion es obligatoria"),
  institutionLevel: z.string().optional(),
  city: z.string().min(2, "La ciudad o municipio es obligatoria"),
  department: z.string().min(2, "El departamento es obligatorio"),
  measuresTaken: z.boolean(),
  measuresDescription: z.string().optional(),
  patientInitials: z.string().min(2, "Las iniciales del paciente son obligatorias").max(12),
  identificationNumber: z.string().optional(),
  age: optionalNumber.pipe(z.coerce.number().int().min(0).max(130).optional()),
  sex: z.enum(["FEMALE", "MALE", "OTHER", "UNDISCLOSED"]),
  eventDate: z.string().min(1, "La fecha del evento es obligatoria"),
  reportType: z.enum(["FIRST_TIME", "FOLLOW_UP"]),
  outcomes: z.array(z.enum(incidentOutcomes)).min(1),
  detailedDescription: z.string().min(20, "La descripcion detallada debe tener al menos 20 caracteres"),
  primaryDiagnosis: z.string().optional(),
  causeDetected: z.boolean(),
  causeDescription: z.string().optional(),
  genericName: z.string().min(2, "El nombre generico del dispositivo es obligatorio"),
  commercialName: z.string().optional(),
  manufacturer: z.string().optional(),
  lotOrSerialNumber: z.string().optional(),
  modelReference: z.string().optional(),
  brand: z.string().optional(),
  sanitaryRegistration: z.string().optional(),
  softwareVersion: z.string().optional(),
  distributorImporter: z.string().optional(),
  operatingArea: z.string().optional(),
  reportedToManufacturer: z.boolean(),
  additionalNote: z.string().optional(),
  associatedAccessories: z.string().optional(),
  devicePhysicalFeatures: z.string().optional(),
  additionalCorrectiveActions: z.string().optional(),
  patientWeightKg: optionalNumber.pipe(z.coerce.number().min(0).max(350).optional()),
  physicalCondition: z.string().optional(),
  relevantPathologies: z.string().optional(),
  clinicalObservations: z.string().optional(),
  reporterName: z.string().min(3, "El nombre del reportante es obligatorio"),
  reporterProfession: z.string().min(2, "La profesion o cargo del reportante es obligatoria"),
  reporterAddress: z.string().optional(),
  reporterPhone: z.string().optional(),
  reporterEmail: z.string().email().optional().or(z.literal(""))
});

export type IncidentReportInput = z.infer<typeof incidentReportSchema>;

export const outcomeLabels: Record<(typeof incidentOutcomes)[number], string> = {
  death: "Muerte",
  lifeThreateningDamage: "Enfermedad o dano que amenaza la vida",
  hospitalization: "Hospitalizacion inicial o prolongada",
  bodyFunctionDamage: "Dano funcion o estructura corporal",
  medicalIntervention: "Intervencion medica o quirurgica",
  noDamage: "No hubo dano",
  other: "Otro"
};
