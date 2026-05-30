import { prisma } from "@/lib/prisma";
import { incidentStatusLabels, incidentTypeLabels } from "@/modules/incidents/types/labels";
import type { IncidentReportInput } from "@/modules/incidents/schemas/incident-report.schema";

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getIncidentList() {
  const incidents = await prisma.incidentReport.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      area: { select: { name: true } },
      service: { select: { name: true } },
      reportedBy: { select: { name: true } },
      deviceInfo: { select: { genericName: true, brand: true, modelReference: true } },
      outcomes: { select: { label: true } }
    }
  });

  return incidents.map((incident) => ({
    id: incident.id,
    code: incident.code,
    type: incidentTypeLabels[incident.type],
    status: incidentStatusLabels[incident.status],
    notificationDate: new Intl.DateTimeFormat("es-CO").format(incident.notificationDate),
    eventDate: new Intl.DateTimeFormat("es-CO").format(incident.eventDate),
    area: incident.area?.name ?? "Sin area",
    service: incident.service?.name ?? "Sin servicio",
    reporter: incident.reportedBy.name,
    device: incident.deviceInfo?.genericName ?? "Sin dispositivo",
    outcomes: incident.outcomes.map((outcome) => outcome.label).join(", ") || "Sin desenlace"
  }));
}

export async function getIncidentForEdit(id: string): Promise<IncidentReportInput | null> {
  const incident = await prisma.incidentReport.findFirst({
    where: { id, deletedAt: null },
    include: {
      patientInfo: true,
      deviceInfo: true,
      reporterInfo: true,
      outcomes: true
    }
  });

  if (!incident || !incident.patientInfo || !incident.deviceInfo || !incident.reporterInfo) {
    return null;
  }

  return {
    type: incident.type,
    status: incident.status,
    notificationDate: toDateInput(incident.notificationDate),
    institutionName: incident.institutionName,
    institutionLevel: incident.institutionLevel ?? "",
    city: incident.city,
    department: incident.department,
    measuresTaken: incident.measuresTaken,
    measuresDescription: incident.measuresDescription ?? "",
    patientInitials: incident.patientInfo.patientInitials,
    identificationNumber: incident.patientInfo.identificationNumber ?? "",
    age: incident.patientInfo.age ?? undefined,
    sex: incident.patientInfo.sex,
    eventDate: toDateInput(incident.eventDate),
    reportType: incident.reportType,
    outcomes: incident.outcomes.map((outcome) => outcome.key) as IncidentReportInput["outcomes"],
    detailedDescription: incident.detailedDescription,
    primaryDiagnosis: incident.primaryDiagnosis ?? "",
    causeDetected: incident.causeDetected,
    causeDescription: incident.causeDescription ?? "",
    genericName: incident.deviceInfo.genericName,
    commercialName: incident.deviceInfo.commercialName ?? "",
    manufacturer: incident.deviceInfo.manufacturer ?? "",
    lotOrSerialNumber: incident.deviceInfo.lotOrSerialNumber ?? "",
    modelReference: incident.deviceInfo.modelReference ?? "",
    brand: incident.deviceInfo.brand ?? "",
    sanitaryRegistration: incident.deviceInfo.sanitaryRegistration ?? "",
    softwareVersion: incident.deviceInfo.softwareVersion ?? "",
    distributorImporter: incident.deviceInfo.distributorImporter ?? "",
    operatingArea: incident.deviceInfo.operatingArea ?? "",
    reportedToManufacturer: incident.deviceInfo.reportedToManufacturer,
    additionalNote: incident.deviceInfo.additionalNote ?? "",
    associatedAccessories: incident.deviceInfo.associatedAccessories ?? "",
    devicePhysicalFeatures: incident.devicePhysicalFeatures ?? "",
    additionalCorrectiveActions: incident.additionalCorrectiveActions ?? "",
    patientWeightKg: incident.patientWeightKg ? Number(incident.patientWeightKg) : undefined,
    physicalCondition: incident.physicalCondition ?? "",
    relevantPathologies: incident.relevantPathologies ?? "",
    clinicalObservations: incident.clinicalObservations ?? "",
    reporterName: incident.reporterInfo.name,
    reporterProfession: incident.reporterInfo.profession,
    reporterAddress: incident.reporterInfo.address ?? "",
    reporterPhone: incident.reporterInfo.phone ?? "",
    reporterEmail: incident.reporterInfo.email ?? ""
  };
}
