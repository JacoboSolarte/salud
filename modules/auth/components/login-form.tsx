"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ShieldCheck } from "lucide-react";
import { loginAction } from "@/modules/auth/actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" disabled={pending}>
      {pending ? "Validando..." : "Ingresar"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, { ok: false, message: "" });
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Seguridad del Paciente";
  const institutionName = process.env.NEXT_PUBLIC_INSTITUTION_NAME ?? "";

  return (
    <form action={formAction} className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Seguridad del Paciente</h1>
          <p className="text-sm text-muted-foreground">{institutionName || appName}</p>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Correo institucional</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contrasena</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state?.message ? <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.message}</p> : null}
      <SubmitButton />
    </form>
  );
}
