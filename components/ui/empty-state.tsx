export function EmptyState({ message }: { message: string }) {
  return <div className="rounded-md border bg-background p-8 text-center text-sm text-muted-foreground">{message}</div>;
}
