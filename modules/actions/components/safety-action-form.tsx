"use client";

import { startTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, Save } from "lucide-react";
import { type FieldErrors, useForm } from "react-hook-form";
import { createSafetyAction, updateSafetyAction } from "@/modules/actions/actions/safety-action-actions";
import {
  actionStatusLabels,
  actionTypeLabels,
  SafetyActionInput,
  safetyActionSchema
} from "@/modules/actions/schemas/safety-action.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const defaults: SafetyActionInput = {
  incidentReportId: "",
  type: "CORRECTIVE",
  title: "",
  description: "",
  status: "OPEN",
  dueDate: "",
  assigneeId: "",
  evidenceNotes: ""
};

export function SafetyActionForm({
  actionId,
  initialValues,
  incidents,
  users
}: {
  actionId?: string;
  initialValues?: Partial<SafetyActionInput>;
  incidents: Array<{ id: string; code: string }>;
  users: Array<{ id: string; name: string; email: string }>;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const form = useForm<SafetyActionInput>({
    resolver: zodResolver(safetyActionSchema),
    defaultValues: { ...defaults, ...initialValues }
  });

  function handleInvalid(errors: FieldErrors<SafetyActionInput>) {
    const firstError = Object.values(errors)[0];
    setMessage({
      type: "error",
      text: typeof firstError?.message === "string" ? firstError.message : "Complete los campos obligatorios."
    });
  }

  function submit(values: SafetyActionInput) {
    setPending(true);
    setMessage(null);
    startTransition(async () => {
      const result = actionId ? await updateSafetyAction(actionId, values) : await createSafetyAction(values);
      setMessage({ type: result.ok ? "success" : "error", text: result.message });
      setPending(false);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{actionId ? "Editar accion CAPA" : "Nueva accion CAPA"}</CardTitle>
        <CardDescription>Acciones correctivas y preventivas asociadas a incidentes.</CardDescription>
      </CardHeader>
      <CardContent>
        {message ? (
          <div
            className={`mb-5 flex items-center gap-2 rounded-md border p-3 text-sm ${
              message.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            {message.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {message.text}
          </div>
        ) : null}
        <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(submit, handleInvalid)}>
          <Field label="Incidente">
            <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...form.register("incidentReportId")}>
              <option value="">Seleccione un incidente</option>
              {incidents.map((incident) => (
                <option key={incident.id} value={incident.id}>
                  {incident.code}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tipo">
            <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...form.register("type")}>
              {Object.entries(actionTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Titulo">
            <Input {...form.register("title")} />
          </Field>
          <Field label="Estado">
            <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...form.register("status")}>
              {Object.entries(actionStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Responsable">
            <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...form.register("assigneeId")}>
              <option value="">Sin responsable</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.email}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Fecha limite">
            <Input type="date" {...form.register("dueDate")} />
          </Field>
          <Field label="Descripcion">
            <Textarea {...form.register("description")} />
          </Field>
          <Field label="Notas de evidencia">
            <Textarea {...form.register("evidenceNotes")} />
          </Field>
          <div className="flex justify-end md:col-span-2">
            <Button disabled={pending}>
              <Save className="h-4 w-4" />
              {pending ? "Guardando..." : actionId ? "Actualizar accion" : "Crear accion"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
