export function getInstitutionConfig() {
  return {
    appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Seguridad del Paciente",
    institutionName: process.env.NEXT_PUBLIC_INSTITUTION_NAME ?? "",
    institutionLevel: process.env.NEXT_PUBLIC_INSTITUTION_LEVEL ?? "",
    city: process.env.NEXT_PUBLIC_INSTITUTION_CITY ?? "",
    department: process.env.NEXT_PUBLIC_INSTITUTION_DEPARTMENT ?? ""
  };
}
