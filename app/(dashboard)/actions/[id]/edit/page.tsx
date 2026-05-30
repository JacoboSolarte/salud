import { notFound } from "next/navigation";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/authz";
import { SafetyActionForm } from "@/modules/actions/components/safety-action-form";
import { getActionFormOptions, getSafetyActionForEdit } from "@/modules/actions/services/safety-action-service";

export default async function EditSafetyActionPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.ACTIONS_MANAGE);
  const { id } = await params;
  const [options, action] = await Promise.all([getActionFormOptions(), getSafetyActionForEdit(id)]);
  if (!action) notFound();
  return <SafetyActionForm actionId={id} initialValues={action} incidents={options.incidents} users={options.users} />;
}
