"use client";

import { Collection, Bookmark } from "@/app/types/db.types";
import { useState } from "react";
import { Sidebar } from "./sidebar";
import { useRealtimeCollections } from "@/app/hooks/use-realtime-collections";
import { BookmarkList } from "../bookmark-list";

interface DashboardShellProps {
  initialCollections: Collection[];
  defaultCollectionId: string;
  initialBookmarks: Bookmark[];
  userId: string;
  userEmail: string;
}

export function DashboardShell({
  initialCollections,
  defaultCollectionId,
  initialBookmarks,
  userId,
  userEmail,
}: DashboardShellProps) {
  
  const [activeCollectionId, setActiveCollectionId] = useState(defaultCollectionId);
  const { collections } = useRealtimeCollections(initialCollections, userId);

  const activeCollection = collections.find((c) => c.id === activeCollectionId);
  const activeTitle = activeCollection?.is_default
    ? "BOOKMARKS"
    : activeCollection?.title || "COLLECTION";

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      
      <Sidebar
        collections={collections}
        activeCollectionId={activeCollectionId}
        onSelectCollection={setActiveCollectionId}
        userEmail={userEmail}
      />

      <div className="flex-1 flex flex-col min-w-0 relative h-screen transition-all">
        <header className="h-4 w-full shrink-0" />

        <div className="flex-1 flex min-h-0 px-4 relative">
          <main className="flex-1 bg-card rounded-2xl border border-border shadow-sm overflow-hidden relative flex flex-row">
            
            {/* We pass initialBookmarks ONLY if we are on the default collection (first load).
              Otherwise we pass empty array and let the child fetch.
            */}
            <BookmarkList 
               key={activeCollectionId} // Forces remount to reset state/loading
               initialBookmarks={activeCollectionId === defaultCollectionId ? initialBookmarks : []}
               collectionId={activeCollectionId}
               userId={userId}
            />

            <div className="w-20 md:w-32 lg:w-40 relative overflow-hidden hidden sm:flex items-center justify-center bg-card select-none shrink-0 border-l border-border/30">
               <div 
                 className="text-[60px] md:text-[80px] lg:text-[100px] font-black tracking-tighter opacity-[0.04] text-foreground pointer-events-none uppercase leading-[0.8]"
                 style={{ 
                   writingMode: 'vertical-rl', 
                   textOrientation: 'mixed',
                   transform: 'rotate(180deg)',
                   maxHeight: '100%',
                   textAlign: 'right'
                 }}
               >
                  {activeTitle.substring(0, 15)}
               </div>
            </div>
            
          </main>
        </div>

        <footer className="h-4 w-full shrink-0" />
      </div>
    </div>
  );
}