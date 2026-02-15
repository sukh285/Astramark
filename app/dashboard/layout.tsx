import { Suspense } from "react";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background min-h-screen">
      <Suspense fallback={<DashboardLoading />}>
        {children}
      </Suspense>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="flex-1 flex flex-row h-screen p-4 gap-4 overflow-hidden">
      <div className="w-64 bg-card border rounded-2xl animate-pulse hidden md:block" />
      <div className="flex-1 bg-card border rounded-2xl animate-pulse" />
    </div>
  );
}