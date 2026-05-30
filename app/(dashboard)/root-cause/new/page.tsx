import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/authz";
import { RootCauseForm } from "@/modules/root-cause/components/root-cause-form";
import { getIncidentOptions } from "@/modules/root-cause/services/root-cause-service";

export default async function NewRootCausePage() {
  await requirePermission(PERMISSIONS.INCIDENTS_ANALYZE);
  const incidents = await getIncidentOptions();
  return <RootCauseForm incidents={incidents} />;
}
