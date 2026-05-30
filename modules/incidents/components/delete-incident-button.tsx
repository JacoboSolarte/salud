"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteIncidentReport } from "@/modules/incidents/actions/create-incident";
import { Button } from "@/components/ui/button";

export function DeleteIncidentButton({ incidentId, code }: { incidentId: string; code: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleDelete() {
    const confirmed = window.confirm(`Desea eliminar el reporte ${code}? Esta accion conserva auditoria y lo oculta del sistema.`);
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteIncidentReport(incidentId);
      setMessage(result.message);
      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="destructive" size="sm" disabled={isPending} onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
        Eliminar
      </Button>
      {message ? <span className="max-w-48 text-xs text-muted-foreground">{message}</span> : null}
    </div>
  );
}
