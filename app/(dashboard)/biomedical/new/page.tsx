import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/authz";
import { EquipmentForm } from "@/modules/biomedical/components/equipment-form";
import { getAreaOptions } from "@/modules/biomedical/services/equipment-service";

export default async function NewEquipmentPage() {
  await requirePermission(PERMISSIONS.BIOMEDICAL_MANAGE);
  const areas = await getAreaOptions();

  return <EquipmentForm areas={areas} />;
}
