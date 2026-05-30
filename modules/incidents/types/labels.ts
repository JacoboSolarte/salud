import { IncidentStatus, IncidentType } from "@prisma/client";

export const incidentTypeLabels: Record<IncidentType, string> = {
  INCIDENT: "Incidente",
  ADVERSE_EVENT: "Evento adverso",
  SENTINEL_EVENT: "Evento centinela",
  NEAR_MISS: "Cuasi falla"
};

export const incidentStatusLabels: Record<IncidentStatus, string> = {
  REPORTED: "Reportado",
  IN_ANALYSIS: "En analisis",
  IN_FOLLOW_UP: "En seguimiento",
  CLOSED: "Cerrado",
  REOPENED: "Reabierto"
};
