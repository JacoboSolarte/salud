import { auth } from "@/auth";
import { logoutAction } from "@/modules/auth/actions/login";
import { Button } from "@/components/ui/button";

export async function Topbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:px-6">
      <div />
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">{session?.user?.name ?? "Usuario"}</p>
          <p className="text-xs text-muted-foreground">{session?.user?.role ?? "Rol"}</p>
        </div>
        <form action={logoutAction}>
          <Button variant="outline" size="sm">
            Salir
          </Button>
        </form>
      </div>
    </header>
  );
}
