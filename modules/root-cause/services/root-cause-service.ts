import { prisma } from "@/lib/prisma";
import type { RootCauseInput } from "@/modules/root-cause/schemas/root-cause.schema";

export async function getIncidentOptions() {
  return prisma.incidentReport.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: { id: true, code: true, detailedDescription: true }
  });
}

export async function getRootCauseForEdit(id: string): Promise<RootCauseInput | null> {
  const analysis = await prisma.rootCauseAnalysis.findFirst({
    where: { id, deletedAt: null },
    include: {
      ishikawaCategories: true,
      fiveWhys: { orderBy: { sequence: "asc" } }
    }
  });

  if (!analysis) return null;

  const categories = Object.fromEntries(
    analysis.ishikawaCategories.map((category) => [category.category, category.contributingFactors ?? ""])
  );

  const whys = Object.fromEntries(analysis.fiveWhys.map((why) => [`why${why.sequence}`, why.answer]));

  return {
    incidentReportId: analysis.incidentReportId,
    title: analysis.title,
    conclusion: analysis.conclusion ?? "",
    personal: categories.Personal ?? "",
    processes: categories.Procesos ?? "",
    equipment: categories.Equipos ?? "",
    environment: categories.Entorno ?? "",
    materials: categories.Materiales ?? "",
    why1: whys.why1 ?? "",
    why2: whys.why2 ?? "",
    why3: whys.why3 ?? "",
    why4: whys.why4 ?? "",
    why5: whys.why5 ?? ""
  };
}
