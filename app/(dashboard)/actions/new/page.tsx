import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/authz";
import { SafetyActionForm } from "@/modules/actions/components/safety-action-form";
import { getActionFormOptions } from "@/modules/actions/services/safety-action-service";

export default async function NewSafetyActionPage() {
  await requirePermission(PERMISSIONS.ACTIONS_MANAGE);
  const options = await getActionFormOptions();
  return <SafetyActionForm incidents={options.incidents} users={options.users} />;
}
