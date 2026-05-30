import { notFound } from "next/navigation";
import { PERMISSIONS } from "@/config/permissions";
import { getInstitutionConfig } from "@/config/institution";
import { requirePermission } from "@/lib/authz";
import { IncidentWizard } from "@/modules/incidents/components/incident-wizard";
import { getIncidentForEdit } from "@/modules/incidents/services/incident-service";

export default async function EditIncidentPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.INCIDENTS_CREATE);
  const { id } = await params;
  const incident = await getIncidentForEdit(id);

  if (!incident) {
    notFound();
  }

  const institution = getInstitutionConfig();

  return (
    <IncidentWizard
      incidentId={id}
      initialValues={incident}
      institution={{
        institutionName: institution.institutionName,
        institutionLevel: institution.institutionLevel,
        city: institution.city,
        department: institution.department
      }}
    />
  );
}
