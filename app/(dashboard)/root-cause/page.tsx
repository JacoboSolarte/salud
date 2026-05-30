import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { DeleteRootCauseButton } from "@/modules/root-cause/components/delete-root-cause-button";

export default async function RootCausePage() {
  await requirePermission(PERMISSIONS.INCIDENTS_ANALYZE);
  const analyses = await prisma.rootCauseAnalysis.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      incidentReport: { select: { code: true } },
      _count: { select: { ishikawaCategories: true, fiveWhys: true } }
    }
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Analisis causa raiz</h1>
          <p className="text-sm text-muted-foreground">Analisis Ishikawa y 5 porques asociados al expediente del incidente.</p>
        </div>
        <Button asChild>
          <Link href="/root-cause/new">
            <Plus className="h-4 w-4" />
            Nuevo analisis
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Analisis registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {analyses.length === 0 ? (
            <EmptyState message="Aun no hay analisis causa raiz registrados." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="border-b text-left text-muted-foreground">
                  <tr>
                    <th className="py-3 font-medium">Titulo</th>
                    <th className="py-3 font-medium">Incidente</th>
                    <th className="py-3 font-medium">Ishikawa</th>
                    <th className="py-3 font-medium">5 porques</th>
                    <th className="py-3 font-medium">Conclusion</th>
                    <th className="py-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {analyses.map((analysis) => (
                    <tr key={analysis.id}>
                      <td className="py-3 font-medium">{analysis.title}</td>
                      <td className="py-3">{analysis.incidentReport.code}</td>
                      <td className="py-3">{analysis._count.ishikawaCategories}</td>
                      <td className="py-3">{analysis._count.fiveWhys}</td>
                      <td className="py-3">{analysis.conclusion ?? "Sin conclusion"}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/root-cause/${analysis.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                              Editar
                            </Link>
                          </Button>
                          <DeleteRootCauseButton analysisId={analysis.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
