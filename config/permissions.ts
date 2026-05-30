import { RoleCode } from "@prisma/client";

export const PERMISSIONS = {
  DASHBOARD_READ: "dashboard.read",
  USERS_MANAGE: "users.manage",
  ROLES_MANAGE: "roles.manage",
  INCIDENTS_CREATE: "incidents.create",
  INCIDENTS_READ: "incidents.read",
  INCIDENTS_ANALYZE: "incidents.analyze",
  INCIDENTS_CLOSE: "incidents.close",
  ACTIONS_MANAGE: "actions.manage",
  BIOMEDICAL_MANAGE: "biomedical.manage",
  REPORTS_EXPORT: "reports.export",
  AUDIT_READ: "audit.read"
} as const;

export const DEFAULT_ROUTE_BY_ROLE: Record<RoleCode, string> = {
  ADMIN: "/dashboard",
  ASSISTENTIAL_STAFF: "/incidents/new",
  SAFETY_COMMITTEE: "/dashboard",
  BIOMEDICAL_ENGINEERING: "/dashboard",
  COORDINATOR: "/dashboard"
};
