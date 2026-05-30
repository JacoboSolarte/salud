import { PERMISSIONS } from "@/config/permissions";
import { getInstitutionConfig } from "@/config/institution";
import { requirePermission } from "@/lib/authz";
import { IncidentWizard } from "@/modules/incidents/components/incident-wizard";

export default async function NewIncidentPage() {
  await requirePermission(PERMISSIONS.INCIDENTS_CREATE);
  const institution = getInstitutionConfig();

  return (
    <IncidentWizard
      institution={{
        institutionName: institution.institutionName,
        institutionLevel: institution.institutionLevel,
        city: institution.city,
        department: institution.department
      }}
    />
  );
}
