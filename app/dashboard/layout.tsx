import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      {children}
    </Suspense>
  );
}

function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-5 py-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-10 w-20 bg-muted animate-pulse rounded" />
        </div>
      </nav>
      <main className="flex-1 max-w-7xl mx-auto w-full px-5 py-8">
        <div className="space-y-6">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-64 border border-dashed border-border rounded-lg" />
        </div>
      </main>
    </div>
  );
}