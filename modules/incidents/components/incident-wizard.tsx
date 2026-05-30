"use client";

import { startTransition, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, ChevronLeft, ChevronRight, Save, Send } from "lucide-react";
import { type FieldErrors, useForm } from "react-hook-form";
import { saveIncidentReport, updateIncidentReport } from "@/modules/incidents/actions/create-incident";
import {
  IncidentReportInput,
  incidentOutcomes,
  incidentReportSchema,
  outcomeLabels
} from "@/modules/incidents/schemas/incident-report.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const steps = [
  "Institucion",
  "Paciente",
  "Evento",
  "Dispositivo",
  "Informacion adicional",
  "Reportante"
];

const defaults: IncidentReportInput = {
  type: "ADVERSE_EVENT",
  status: "REPORTED",
  notificationDate: new Date().toISOString().slice(0, 10),
  institutionName: "",
  institutionLevel: "",
  city: "",
  department: "",
  measuresTaken: false,
  measuresDescription: "",
  patientInitials: "",
  identificationNumber: "",
  age: undefined,
  sex: "UNDISCLOSED",
  eventDate: new Date().toISOString().slice(0, 10),
  reportType: "FIRST_TIME",
  outcomes: ["noDamage"],
  detailedDescription: "",
  primaryDiagnosis: "",
  causeDetected: false,
  causeDescription: "",
  genericName: "",
  commercialName: "",
  manufacturer: "",
  lotOrSerialNumber: "",
  modelReference: "",
  brand: "",
  sanitaryRegistration: "",
  softwareVersion: "",
  distributorImporter: "",
  operatingArea: "",
  reportedToManufacturer: false,
  additionalNote: "",
  associatedAccessories: "",
  devicePhysicalFeatures: "",
  additionalCorrectiveActions: "",
  patientWeightKg: undefined,
  physicalCondition: "",
  relevantPathologies: "",
  clinicalObservations: "",
  reporterName: "",
  reporterProfession: "",
  reporterAddress: "",
  reporterPhone: "",
  reporterEmail: ""
};

type InstitutionDefaults = Pick<IncidentReportInput, "institutionName" | "institutionLevel" | "city" | "department">;

export function IncidentWizard({
  institution,
  incidentId,
  initialValues
}: {
  institution: InstitutionDefaults;
  incidentId?: string;
  initialValues?: Partial<IncidentReportInput>;
}) {
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const form = useForm<IncidentReportInput>({
    resolver: zodResolver(incidentReportSchema),
    defaultValues: { ...defaults, ...institution, ...initialValues },
    mode: "onChange"
  });

  const progress = useMemo(() => Math.round(((step + 1) / steps.length) * 100), [step]);

  function submit(mode: "draft" | "submit") {
    setPending(true);
    setMessage(null);
    setValidationMessage(null);
    startTransition(async () => {
      try {
        const result = incidentId
          ? await updateIncidentReport(incidentId, form.getValues(), mode)
          : await saveIncidentReport(form.getValues(), mode);
        setMessage({
          type: result.ok ? "success" : "error",
          text: result.ok ? `${result.message} Codigo: ${result.code}` : result.message
        });
      } catch (error) {
        console.error(error);
        setMessage({ type: "error", text: "Ocurrio un error inesperado al guardar el reporte." });
      } finally {
        setPending(false);
      }
    });
  }

  function handleInvalid(errors: FieldErrors<IncidentReportInput>) {
    const firstError = Object.values(errors)[0];
    const firstMessage = typeof firstError?.message === "string" ? firstError.message : null;
    setValidationMessage(firstMessage ?? "Complete los campos obligatorios antes de radicar el reporte.");
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">
                {incidentId ? "Editar reporte institucional" : "Reporte institucional de evento adverso"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Formato digital para seguridad del paciente y tecnovigilancia de dispositivos medicos.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" type="button" disabled={pending} onClick={() => submit("draft")}>
                <Save className="h-4 w-4" />
                {incidentId ? "Actualizar" : "Borrador"}
              </Button>
              <Button type="button" disabled={pending} onClick={form.handleSubmit(() => submit("submit"), handleInvalid)}>
                <Send className="h-4 w-4" />
                {incidentId ? "Actualizar y radicar" : "Radicar"}
              </Button>
            </div>
          </div>
          <div className="mt-5 h-2 rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-6">
            {steps.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(index)}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left text-xs font-medium transition-colors ${
                  index === step ? "border-primary bg-primary/10 text-primary" : "bg-card text-muted-foreground"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border text-[11px]">
                  {index < step ? <Check className="h-3 w-3" /> : index + 1}
                </span>
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {message ? (
        <div
          className={`flex items-center gap-2 rounded-md border p-3 text-sm ${
            message.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : "border-destructive/40 bg-destructive/10 text-destructive"
          }`}
        >
          {message.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      ) : null}

      {validationMessage ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {validationMessage}
        </div>
      ) : null}

      <form className="space-y-5">
        {step === 0 && (
          <Section title="Seccion 1 - Institucion reportante" description="Datos institucionales y medidas tomadas">
            <Field label="Fecha notificacion"><Input type="date" {...form.register("notificationDate")} /></Field>
            <Field label="Institucion"><Input {...form.register("institutionName")} /></Field>
            <Field label="Nivel"><Input {...form.register("institutionLevel")} /></Field>
            <Field label="Ciudad o municipio"><Input {...form.register("city")} /></Field>
            <Field label="Departamento"><Input {...form.register("department")} /></Field>
            <Field label="Se tomaron medidas">
              <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...form.register("measuresTaken", { setValueAs: (v) => v === "true" })}>
                <option value="false">No</option>
                <option value="true">Si</option>
              </select>
            </Field>
            <Field label="Medidas tomadas" wide><Textarea {...form.register("measuresDescription")} /></Field>
          </Section>
        )}

        {step === 1 && (
          <Section title="Seccion 2 - Identificacion del paciente" description="Datos minimos para trazabilidad clinica">
            <Field label="Iniciales del paciente"><Input {...form.register("patientInitials")} /></Field>
            <Field label="Numero identificacion"><Input {...form.register("identificationNumber")} /></Field>
            <Field label="Edad"><Input type="number" {...form.register("age")} /></Field>
            <Field label="Sexo">
              <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...form.register("sex")}>
                <option value="FEMALE">Femenino</option>
                <option value="MALE">Masculino</option>
                <option value="OTHER">Otro</option>
                <option value="UNDISCLOSED">No informado</option>
              </select>
            </Field>
          </Section>
        )}

        {step === 2 && (
          <Section title="Seccion 3 - Descripcion del evento adverso" description="Clasificacion, desenlace y causa">
            <Field label="Fecha del evento"><Input type="date" {...form.register("eventDate")} /></Field>
            <Field label="Tipo de reporte">
              <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...form.register("reportType")}>
                <option value="FIRST_TIME">Primera vez</option>
                <option value="FOLLOW_UP">Seguimiento</option>
              </select>
            </Field>
            <Field label="Tipo de evento">
              <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...form.register("type")}>
                <option value="INCIDENT">Incidente</option>
                <option value="ADVERSE_EVENT">Evento adverso</option>
                <option value="SENTINEL_EVENT">Evento centinela</option>
                <option value="NEAR_MISS">Cuasi falla</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Label>Desenlaces posibles</Label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {incidentOutcomes.map((outcome) => (
                  <label key={outcome} className="flex items-center gap-2 rounded-md border p-3 text-sm">
                    <input type="checkbox" value={outcome} {...form.register("outcomes")} />
                    {outcomeLabels[outcome]}
                  </label>
                ))}
              </div>
            </div>
            <Field label="Descripcion detallada" wide><Textarea {...form.register("detailedDescription")} /></Field>
            <Field label="Diagnostico principal" wide><Textarea {...form.register("primaryDiagnosis")} /></Field>
            <Field label="Se detecto la causa">
              <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...form.register("causeDetected", { setValueAs: (v) => v === "true" })}>
                <option value="false">No</option>
                <option value="true">Si</option>
              </select>
            </Field>
            <Field label="Descripcion de la causa" wide><Textarea {...form.register("causeDescription")} /></Field>
          </Section>
        )}

        {step === 3 && (
          <Section title="Seccion 4 - Dispositivo medico involucrado" description="Informacion tecnica para tecnovigilancia">
            <Field label="Nombre generico"><Input {...form.register("genericName")} /></Field>
            <Field label="Nombre comercial"><Input {...form.register("commercialName")} /></Field>
            <Field label="Fabricante"><Input {...form.register("manufacturer")} /></Field>
            <Field label="Lote o serie"><Input {...form.register("lotOrSerialNumber")} /></Field>
            <Field label="Modelo o referencia"><Input {...form.register("modelReference")} /></Field>
            <Field label="Marca"><Input {...form.register("brand")} /></Field>
            <Field label="Registro sanitario"><Input {...form.register("sanitaryRegistration")} /></Field>
            <Field label="Version software"><Input {...form.register("softwareVersion")} /></Field>
            <Field label="Distribuidor/importador"><Input {...form.register("distributorImporter")} /></Field>
            <Field label="Area funcionamiento"><Input {...form.register("operatingArea")} /></Field>
            <Field label="Reportado al fabricante">
              <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...form.register("reportedToManufacturer", { setValueAs: (v) => v === "true" })}>
                <option value="false">No</option>
                <option value="true">Si</option>
              </select>
            </Field>
            <Field label="Nota adicional" wide><Textarea {...form.register("additionalNote")} /></Field>
            <Field label="Accesorios asociados" wide><Textarea {...form.register("associatedAccessories")} /></Field>
          </Section>
        )}

        {step === 4 && (
          <Section title="Seccion 5 - Otras informaciones adicionales" description="Contexto clinico y acciones iniciales">
            <Field label="Caracteristicas fisicas del dispositivo" wide><Textarea {...form.register("devicePhysicalFeatures")} /></Field>
            <Field label="Acciones correctivas" wide><Textarea {...form.register("additionalCorrectiveActions")} /></Field>
            <Field label="Peso del paciente"><Input type="number" step="0.01" {...form.register("patientWeightKg")} /></Field>
            <Field label="Condicion fisica relevante" wide><Textarea {...form.register("physicalCondition")} /></Field>
            <Field label="Patologias relevantes" wide><Textarea {...form.register("relevantPathologies")} /></Field>
            <Field label="Observaciones clinicas" wide><Textarea {...form.register("clinicalObservations")} /></Field>
          </Section>
        )}

        {step === 5 && (
          <Section title="Seccion 6 - Identificacion del reportante" description="Responsable del diligenciamiento">
            <Field label="Nombre reportante"><Input {...form.register("reporterName")} /></Field>
            <Field label="Profesion o cargo"><Input {...form.register("reporterProfession")} /></Field>
            <Field label="Direccion"><Input {...form.register("reporterAddress")} /></Field>
            <Field label="Telefono"><Input {...form.register("reporterPhone")} /></Field>
            <Field label="Correo electronico"><Input type="email" {...form.register("reporterEmail")} /></Field>
          </Section>
        )}

        <div className="flex justify-between">
          <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button type="button" disabled={step === steps.length - 1} onClick={() => setStep((value) => value + 1)}>
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

function Section({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "space-y-2 md:col-span-2" : "space-y-2"}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
