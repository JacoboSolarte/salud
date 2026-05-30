import { notFound } from "next/navigation";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/authz";
import { RootCauseForm } from "@/modules/root-cause/components/root-cause-form";
import { getIncidentOptions, getRootCauseForEdit } from "@/modules/root-cause/services/root-cause-service";

export default async function EditRootCausePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.INCIDENTS_ANALYZE);
  const { id } = await params;
  const [incidents, analysis] = await Promise.all([getIncidentOptions(), getRootCauseForEdit(id)]);
  if (!analysis) notFound();
  return <RootCauseForm incidents={incidents} analysisId={id} initialValues={analysis} />;
}
