import Link from "next/link";
import { Activity, ClipboardPlus, FileBarChart, Gauge, HeartPulse, ShieldCheck, Stethoscope, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { getInstitutionConfig } from "@/config/institution";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/incidents/new", label: "Nuevo reporte", icon: ClipboardPlus },
  { href: "/incidents", label: "Incidentes", icon: HeartPulse },
  { href: "/root-cause", label: "Causa raiz", icon: Activity },
  { href: "/actions", label: "CAPA", icon: ShieldCheck },
  { href: "/biomedical", label: "Biomedica", icon: Wrench },
  { href: "/reports", label: "Reportes", icon: FileBarChart }
];

export function Sidebar({ className }: { className?: string }) {
  const institution = getInstitutionConfig();

  return (
    <aside className={cn("flex h-full w-72 flex-col border-r bg-card", className)}>
      <div className="flex h-16 items-center gap-3 border-b px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{institution.institutionName || institution.appName}</p>
          <p className="truncate text-xs text-muted-foreground">{institution.appName}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
