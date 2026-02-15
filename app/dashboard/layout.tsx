import { SidebarContainer } from "@/components/sidebar-container";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      
      {/* Boundaries:
        We wrap the fetching component in Suspense.
        The fallback creates a visual placeholder (w-20 width) so the layout doesn't jump.
      */}
      <Suspense fallback={<div className="w-20 h-screen bg-card border-r border-border shrink-0" />}>
        <SidebarContainer />
      </Suspense>

      <div className="flex-1 flex flex-col min-w-0 relative h-screen transition-all">
        <header className="h-4 w-full shrink-0" />
        
        <div className="flex-1 flex min-h-0 px-4 relative">
          <main className="flex-1 bg-card rounded-2xl border border-border shadow-sm overflow-hidden relative flex flex-row">
             {/* Note: This suspense handles the PAGE content loading 
                (e.g. fetching bookmarks list)
             */}
             <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading dashboard...</div>}>
               {children}
             </Suspense>
          </main>
        </div>
        
        <footer className="h-4 w-full shrink-0" />
      </div>
    </div>
  );
}