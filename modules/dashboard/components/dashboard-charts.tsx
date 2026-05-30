"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartColors = ["#0e7490", "#f59e0b", "#16a34a", "#dc2626", "#7c3aed", "#475569", "#0891b2"];

export function DashboardCharts({
  monthly,
  outcomes
}: {
  monthly: Array<{ month: string; incidentes: number }>;
  outcomes: Array<{ name: string; value: number }>;
}) {
  const hasMonthlyData = monthly.some((item) => item.incidentes > 0);
  const hasOutcomeData = outcomes.some((item) => item.value > 0);
  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Tendencia mensual de eventos</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {hasMonthlyData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="incidentes" radius={[6, 6, 0, 0]} fill="#0e7490" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartMessage message="Aun no hay reportes registrados en los ultimos meses." />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Eventos por desenlace</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {hasOutcomeData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={outcomes} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={3}>
                  {outcomes.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartMessage message="Los desenlaces apareceran cuando existan reportes radicados." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyChartMessage({ message }: { message: string }) {
  return <div className="grid h-full place-items-center rounded-md border bg-background text-center text-sm text-muted-foreground">{message}</div>;
}
