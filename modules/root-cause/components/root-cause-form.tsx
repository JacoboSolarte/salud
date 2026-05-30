"use client";

import { startTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, Save } from "lucide-react";
import { type FieldErrors, useForm } from "react-hook-form";
import { createRootCause, updateRootCause } from "@/modules/root-cause/actions/root-cause-actions";
import { RootCauseInput, rootCauseSchema } from "@/modules/root-cause/schemas/root-cause.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const defaults: RootCauseInput = {
  incidentReportId: "",
  title: "",
  conclusion: "",
  personal: "",
  processes: "",
  equipment: "",
  environment: "",
  materials: "",
  why1: "",
  why2: "",
  why3: "",
  why4: "",
  why5: ""
};

export function RootCauseForm({
  incidents,
  analysisId,
  initialValues
}: {
  incidents: Array<{ id: string; code: string; detailedDescription: string }>;
  analysisId?: string;
  initialValues?: Partial<RootCauseInput>;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const form = useForm<RootCauseInput>({
    resolver: zodResolver(rootCauseSchema),
    defaultValues: { ...defaults, ...initialValues }
  });

  function handleInvalid(errors: FieldErrors<RootCauseInput>) {
    const firstError = Object.values(errors)[0];
    setMessage({
      type: "error",
      text: typeof firstError?.message === "string" ? firstError.message : "Complete los campos obligatorios."
    });
  }

  function submit(values: RootCauseInput) {
    setPending(true);
    setMessage(null);
    startTransition(async () => {
      const result = analysisId ? await updateRootCause(analysisId, values) : await createRootCause(values);
      setMessage({ type: result.ok ? "success" : "error", text: result.message });
      setPending(false);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{analysisId ? "Editar analisis causa raiz" : "Nuevo analisis causa raiz"}</CardTitle>
        <CardDescription>Ishikawa y 5 porques asociados a un reporte institucional.</CardDescription>
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
          <Field label="Titulo">
            <Input {...form.register("title")} />
          </Field>
          <Field label="Personal">
            <Textarea {...form.register("personal")} />
          </Field>
          <Field label="Procesos">
            <Textarea {...form.register("processes")} />
          </Field>
          <Field label="Equipos">
            <Textarea {...form.register("equipment")} />
          </Field>
          <Field label="Entorno">
            <Textarea {...form.register("environment")} />
          </Field>
          <Field label="Materiales">
            <Textarea {...form.register("materials")} />
          </Field>
          <Field label="Conclusion">
            <Textarea {...form.register("conclusion")} />
          </Field>
          {[1, 2, 3, 4, 5].map((number) => (
            <Field key={number} label={`Por que ${number}`}>
              <Textarea {...form.register(`why${number}` as keyof RootCauseInput)} />
            </Field>
          ))}
          <div className="flex justify-end md:col-span-2">
            <Button disabled={pending}>
              <Save className="h-4 w-4" />
              {pending ? "Guardando..." : analysisId ? "Actualizar analisis" : "Crear analisis"}
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
