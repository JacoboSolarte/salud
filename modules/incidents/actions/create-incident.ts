"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { IncidentStatus } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/config/permissions";
import { incidentReportSchema, outcomeLabels } from "@/modules/incidents/schemas/incident-report.schema";

function nextIncidentCode(type: string) {
  const prefix = type === "ADVERSE_EVENT" ? "EA" : type === "NEAR_MISS" ? "CF" : type === "SENTINEL_EVENT" ? "EC" : "IN";
  return `${prefix}-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function saveIncidentReport(input: unknown, mode: "draft" | "submit") {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ok: false,
      message: "La sesion expiro. Inicie sesion nuevamente para guardar el reporte."
    };
  }

  if (!session.user.permissions.includes(PERMISSIONS.INCIDENTS_CREATE)) {
    return {
      ok: false,
      message: "No tiene permiso para registrar incidentes."
    };
  }

  const parsed = incidentReportSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0];

    return {
      ok: false,
      message: firstError ?? "Revise los campos obligatorios del formulario.",
      errors: fieldErrors
    };
  }

  const data = parsed.data;
  const status = mode === "draft" ? IncidentStatus.REPORTED : data.status;

  try {
    const incident = await prisma.incidentReport.create({
      data: {
        code: nextIncidentCode(data.type),
        type: data.type,
        status,
        reportType: data.reportType,
        notificationDate: new Date(data.notificationDate),
        institutionName: data.institutionName,
        institutionLevel: data.institutionLevel,
        city: data.city,
        department: data.department,
        measuresTaken: data.measuresTaken,
        measuresDescription: data.measuresDescription,
        eventDate: new Date(data.eventDate),
        detailedDescription: data.detailedDescription,
        primaryDiagnosis: data.primaryDiagnosis,
        causeDetected: data.causeDetected,
        causeDescription: data.causeDescription,
        patientWeightKg: data.patientWeightKg,
        physicalCondition: data.physicalCondition,
        relevantPathologies: data.relevantPathologies,
        clinicalObservations: data.clinicalObservations,
        devicePhysicalFeatures: data.devicePhysicalFeatures,
        additionalCorrectiveActions: data.additionalCorrectiveActions,
        submittedAt: mode === "submit" ? new Date() : null,
        reportedById: session.user.id,
        patientInfo: {
          create: {
            patientInitials: data.patientInitials,
            identificationNumber: data.identificationNumber,
            age: data.age,
            sex: data.sex
          }
        },
        deviceInfo: {
          create: {
            genericName: data.genericName,
            commercialName: data.commercialName,
            manufacturer: data.manufacturer,
            lotOrSerialNumber: data.lotOrSerialNumber,
            modelReference: data.modelReference,
            brand: data.brand,
            sanitaryRegistration: data.sanitaryRegistration,
            softwareVersion: data.softwareVersion,
            distributorImporter: data.distributorImporter,
            operatingArea: data.operatingArea,
            reportedToManufacturer: data.reportedToManufacturer,
            additionalNote: data.additionalNote,
            associatedAccessories: data.associatedAccessories
          }
        },
        reporterInfo: {
          create: {
            name: data.reporterName,
            profession: data.reporterProfession,
            address: data.reporterAddress,
            phone: data.reporterPhone,
            email: data.reporterEmail || null
          }
        },
        outcomes: {
          create: data.outcomes.map((key) => ({
            key,
            label: outcomeLabels[key]
          }))
        },
        timeline: {
          create: {
            title: mode === "draft" ? "Borrador guardado" : "Reporte radicado",
            description: "Registro creado desde el formulario institucional digital.",
            status,
            createdById: session.user.id
          }
        }
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: mode === "draft" ? "incident.draft" : "incident.submit",
        entity: "IncidentReport",
        entityId: incident.id,
        metadata: { code: incident.code }
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/incidents");
    return { ok: true, message: "Reporte guardado correctamente.", id: incident.id, code: incident.code };
  } catch (error) {
    console.error("incident.save.failed", error);
    return {
      ok: false,
      message: "No fue posible guardar el reporte. Revise la conexion a la base de datos e intente nuevamente."
    };
  }
}

export async function updateIncidentReport(incidentId: string, input: unknown, mode: "draft" | "submit") {
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, message: "La sesion expiro. Inicie sesion nuevamente para actualizar el reporte." };
  }

  if (!session.user.permissions.includes(PERMISSIONS.INCIDENTS_CREATE)) {
    return { ok: false, message: "No tiene permiso para editar incidentes." };
  }

  const parsed = incidentReportSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0];
    return { ok: false, message: firstError ?? "Revise los campos obligatorios del formulario.", errors: fieldErrors };
  }

  const existing = await prisma.incidentReport.findFirst({
    where: { id: incidentId, deletedAt: null },
    select: { id: true, code: true }
  });

  if (!existing) {
    return { ok: false, message: "No se encontro el reporte o ya fue eliminado." };
  }

  const data = parsed.data;
  const status = mode === "draft" ? IncidentStatus.REPORTED : data.status;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.incidentReport.update({
        where: { id: incidentId },
        data: {
          type: data.type,
          status,
          reportType: data.reportType,
          notificationDate: new Date(data.notificationDate),
          institutionName: data.institutionName,
          institutionLevel: data.institutionLevel,
          city: data.city,
          department: data.department,
          measuresTaken: data.measuresTaken,
          measuresDescription: data.measuresDescription,
          eventDate: new Date(data.eventDate),
          detailedDescription: data.detailedDescription,
          primaryDiagnosis: data.primaryDiagnosis,
          causeDetected: data.causeDetected,
          causeDescription: data.causeDescription,
          patientWeightKg: data.patientWeightKg,
          physicalCondition: data.physicalCondition,
          relevantPathologies: data.relevantPathologies,
          clinicalObservations: data.clinicalObservations,
          devicePhysicalFeatures: data.devicePhysicalFeatures,
          additionalCorrectiveActions: data.additionalCorrectiveActions,
          submittedAt: mode === "submit" ? new Date() : undefined
        }
      });

      await tx.patientInfo.upsert({
        where: { incidentReportId: incidentId },
        update: {
          patientInitials: data.patientInitials,
          identificationNumber: data.identificationNumber,
          age: data.age,
          sex: data.sex
        },
        create: {
          incidentReportId: incidentId,
          patientInitials: data.patientInitials,
          identificationNumber: data.identificationNumber,
          age: data.age,
          sex: data.sex
        }
      });

      await tx.deviceInfo.upsert({
        where: { incidentReportId: incidentId },
        update: {
          genericName: data.genericName,
          commercialName: data.commercialName,
          manufacturer: data.manufacturer,
          lotOrSerialNumber: data.lotOrSerialNumber,
          modelReference: data.modelReference,
          brand: data.brand,
          sanitaryRegistration: data.sanitaryRegistration,
          softwareVersion: data.softwareVersion,
          distributorImporter: data.distributorImporter,
          operatingArea: data.operatingArea,
          reportedToManufacturer: data.reportedToManufacturer,
          additionalNote: data.additionalNote,
          associatedAccessories: data.associatedAccessories
        },
        create: {
          incidentReportId: incidentId,
          genericName: data.genericName,
          commercialName: data.commercialName,
          manufacturer: data.manufacturer,
          lotOrSerialNumber: data.lotOrSerialNumber,
          modelReference: data.modelReference,
          brand: data.brand,
          sanitaryRegistration: data.sanitaryRegistration,
          softwareVersion: data.softwareVersion,
          distributorImporter: data.distributorImporter,
          operatingArea: data.operatingArea,
          reportedToManufacturer: data.reportedToManufacturer,
          additionalNote: data.additionalNote,
          associatedAccessories: data.associatedAccessories
        }
      });

      await tx.reporterInfo.upsert({
        where: { incidentReportId: incidentId },
        update: {
          name: data.reporterName,
          profession: data.reporterProfession,
          address: data.reporterAddress,
          phone: data.reporterPhone,
          email: data.reporterEmail || null
        },
        create: {
          incidentReportId: incidentId,
          name: data.reporterName,
          profession: data.reporterProfession,
          address: data.reporterAddress,
          phone: data.reporterPhone,
          email: data.reporterEmail || null
        }
      });

      await tx.incidentOutcome.deleteMany({ where: { incidentReportId: incidentId } });
      await tx.incidentOutcome.createMany({
        data: data.outcomes.map((key) => ({
          incidentReportId: incidentId,
          key,
          label: outcomeLabels[key]
        }))
      });

      await tx.incidentTimeline.create({
        data: {
          incidentReportId: incidentId,
          title: "Reporte actualizado",
          description: mode === "submit" ? "Reporte actualizado y radicado." : "Borrador actualizado.",
          status,
          createdById: session.user.id
        }
      });

      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: mode === "submit" ? "incident.update.submit" : "incident.update.draft",
          entity: "IncidentReport",
          entityId: incidentId,
          metadata: { code: existing.code }
        }
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/incidents");
    revalidatePath(`/incidents/${incidentId}/edit`);
    return { ok: true, message: "Reporte actualizado correctamente.", id: incidentId, code: existing.code };
  } catch (error) {
    console.error("incident.update.failed", error);
    return { ok: false, message: "No fue posible actualizar el reporte. Intente nuevamente." };
  }
}

export async function deleteIncidentReport(incidentId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, message: "La sesion expiro. Inicie sesion nuevamente para eliminar el reporte." };
  }

  if (!session.user.permissions.includes(PERMISSIONS.INCIDENTS_CLOSE)) {
    return { ok: false, message: "No tiene permiso para eliminar incidentes." };
  }

  const existing = await prisma.incidentReport.findFirst({
    where: { id: incidentId, deletedAt: null },
    select: { id: true, code: true }
  });

  if (!existing) {
    return { ok: false, message: "No se encontro el reporte o ya fue eliminado." };
  }

  await prisma.$transaction([
    prisma.incidentReport.update({
      where: { id: incidentId },
      data: { deletedAt: new Date() }
    }),
    prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "incident.delete",
        entity: "IncidentReport",
        entityId: incidentId,
        metadata: { code: existing.code }
      }
    })
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/incidents");
  return { ok: true, message: `Reporte ${existing.code} eliminado correctamente.` };
}
