"use client";

import { startTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Save, AlertCircle } from "lucide-react";
import { type FieldErrors, useForm } from "react-hook-form";
import { createEquipment, updateEquipment } from "@/modules/biomedical/actions/equipment-actions";
import {
  EquipmentInput,
  equipmentSchema,
  equipmentStatusLabels
} from "@/modules/biomedical/schemas/equipment.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const defaults: EquipmentInput = {
  name: "",
  brand: "",
  model: "",
  serial: "",
  manufacturer: "",
  manufactureYear: undefined,
  location: "",
  status: "ACTIVE",
  areaId: "",
  lastMaintenanceAt: "",
  nextMaintenanceAt: ""
};

export function EquipmentForm({
  areas,
  equipmentId,
  initialValues
}: {
  areas: Array<{ id: string; name: string }>;
  equipmentId?: string;
  initialValues?: Partial<EquipmentInput>;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const form = useForm<EquipmentInput>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: { ...defaults, ...initialValues },
    mode: "onChange"
  });

  function handleInvalid(errors: FieldErrors<EquipmentInput>) {
    const firstError = Object.values(errors)[0];
    setMessage({
      type: "error",
      text: typeof firstError?.message === "string" ? firstError.message : "Complete los campos obligatorios."
    });
  }

  function submit(values: EquipmentInput) {
    setPending(true);
    setMessage(null);
    startTransition(async () => {
      const result = equipmentId ? await updateEquipment(equipmentId, values) : await createEquipment(values);
      setMessage({ type: result.ok ? "success" : "error", text: result.message });
      setPending(false);
    });
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>{equipmentId ? "Editar equipo biomedico" : "Registrar equipo biomedico"}</CardTitle>
          <CardDescription>Inventario tecnico para gestion biomedica y tecnovigilancia.</CardDescription>
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
            <Field label="Nombre equipo">
              <Input {...form.register("name")} />
            </Field>
            <Field label="Estado">
              <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...form.register("status")}>
                {Object.entries(equipmentStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Marca">
              <Input {...form.register("brand")} />
            </Field>
            <Field label="Modelo">
              <Input {...form.register("model")} />
            </Field>
            <Field label="Serie">
              <Input {...form.register("serial")} />
            </Field>
            <Field label="Fabricante">
              <Input {...form.register("manufacturer")} />
            </Field>
            <Field label="Ano fabricacion">
              <Input type="number" {...form.register("manufactureYear")} />
            </Field>
            <Field label="Ubicacion">
              <Input {...form.register("location")} />
            </Field>
            <Field label="Area">
              <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...form.register("areaId")}>
                <option value="">Sin area asignada</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Ultimo mantenimiento">
              <Input type="date" {...form.register("lastMaintenanceAt")} />
            </Field>
            <Field label="Proximo mantenimiento">
              <Input type="date" {...form.register("nextMaintenanceAt")} />
            </Field>
            <div className="flex justify-end md:col-span-2">
              <Button disabled={pending}>
                <Save className="h-4 w-4" />
                {pending ? "Guardando..." : equipmentId ? "Actualizar equipo" : "Crear equipo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
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
