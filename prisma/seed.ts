import { PrismaClient, RoleCode } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const permissions = [
  ["dashboard.read", "Ver dashboard", "dashboard"],
  ["users.manage", "Gestionar usuarios", "auth"],
  ["roles.manage", "Gestionar roles y permisos", "auth"],
  ["incidents.create", "Registrar incidentes", "incidents"],
  ["incidents.read", "Consultar incidentes", "incidents"],
  ["incidents.analyze", "Analizar causa raiz", "incidents"],
  ["incidents.close", "Cerrar incidentes", "incidents"],
  ["actions.manage", "Gestionar acciones CAPA", "actions"],
  ["biomedical.manage", "Gestionar inventario biomedico", "biomedical"],
  ["reports.export", "Exportar reportes", "reports"],
  ["audit.read", "Consultar auditoria", "audit"]
] as const;

const rolePermissions: Record<RoleCode, string[]> = {
  ADMIN: permissions.map(([key]) => key),
  ASSISTENTIAL_STAFF: ["dashboard.read", "incidents.create", "incidents.read"],
  SAFETY_COMMITTEE: [
    "dashboard.read",
    "incidents.read",
    "incidents.analyze",
    "incidents.close",
    "actions.manage",
    "reports.export"
  ],
  BIOMEDICAL_ENGINEERING: [
    "dashboard.read",
    "incidents.read",
    "incidents.analyze",
    "actions.manage",
    "biomedical.manage",
    "reports.export"
  ],
  COORDINATOR: [
    "dashboard.read",
    "incidents.create",
    "incidents.read",
    "incidents.analyze",
    "actions.manage",
    "reports.export"
  ]
};

async function main() {
  for (const [key, name, module] of permissions) {
    await prisma.permission.upsert({
      where: { key },
      update: { name, module },
      create: { key, name, module }
    });
  }

  const roles = [
    [RoleCode.ADMIN, "Administrador"],
    [RoleCode.ASSISTENTIAL_STAFF, "Personal asistencial"],
    [RoleCode.SAFETY_COMMITTEE, "Comite de seguridad"],
    [RoleCode.BIOMEDICAL_ENGINEERING, "Ingenieria biomedica"],
    [RoleCode.COORDINATOR, "Coordinador"]
  ] as const;

  for (const [code, name] of roles) {
    const role = await prisma.role.upsert({
      where: { code },
      update: { name },
      create: { code, name }
    });

    for (const permissionKey of rolePermissions[code]) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key: permissionKey } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id }
      });
    }
  }

  const initialArea = process.env.SEED_INITIAL_AREA;
  const initialService = process.env.SEED_INITIAL_SERVICE;

  if (initialArea) {
    const area = await prisma.area.upsert({
      where: { name: initialArea },
      update: {},
      create: { name: initialArea }
    });

    if (initialService) {
      await prisma.service.upsert({
        where: { areaId_name: { areaId: area.id, name: initialService } },
        update: {},
        create: { areaId: area.id, name: initialService }
      });
    }
  }

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { code: RoleCode.ADMIN } });
  const adminName = process.env.SEED_ADMIN_NAME ?? "Administrador Sistema";
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error("Configure SEED_ADMIN_PASSWORD en .env antes de ejecutar el seed.");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { roleId: adminRole.id, active: true },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      roleId: adminRole.id,
      position: "Administrador plataforma"
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
