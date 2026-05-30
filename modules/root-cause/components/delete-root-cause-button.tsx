"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteRootCause } from "@/modules/root-cause/actions/root-cause-actions";
import { Button } from "@/components/ui/button";

export function DeleteRootCauseButton({ analysisId }: { analysisId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleDelete() {
    if (!window.confirm("Desea eliminar este analisis causa raiz?")) return;
    startTransition(async () => {
      const result = await deleteRootCause(analysisId);
      setMessage(result.message);
      if (result.ok) router.refresh();
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
