import { LoginForm } from "@/modules/auth/components/login-form";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(14,116,144,0.16),transparent_34%),linear-gradient(135deg,#f7fbfc,#eef4f2)] p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
