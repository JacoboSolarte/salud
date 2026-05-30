import { notFound } from "next/navigation";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/authz";
import { EquipmentForm } from "@/modules/biomedical/components/equipment-form";
import { getAreaOptions, getEquipmentForEdit } from "@/modules/biomedical/services/equipment-service";

export default async function EditEquipmentPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.BIOMEDICAL_MANAGE);
  const { id } = await params;
  const [areas, equipment] = await Promise.all([getAreaOptions(), getEquipmentForEdit(id)]);

  if (!equipment) notFound();

  return <EquipmentForm areas={areas} equipmentId={id} initialValues={equipment} />;
}
