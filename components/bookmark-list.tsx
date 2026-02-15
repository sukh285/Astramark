"use client";

import { Bookmark } from "@/app/types/db.types";
import { useRealtimeBookmarks } from "@/app/hooks/use-realtime";
import { BookmarkItem } from "./bookmark-item";

interface BookmarkListProps {
  initialBookmarks: Bookmark[];
  userId: string;
}

export function BookmarkList({ initialBookmarks, userId }: BookmarkListProps) {
  const { bookmarks } = useRealtimeBookmarks(initialBookmarks, userId);

  if (bookmarks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/40 select-none min-h-[200px]">
        <p className="italic text-sm">No bookmarks yet</p>
      </div>
    );
  }

  return (
    <div className="flex-1 relative -mx-4 px-4 h-full flex flex-col min-h-0">
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

      {/* Top Fade */}
      <div className="sticky top-0 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none shrink-0" />

      {/* Scrollable List Container */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        <div className="space-y-0.5">
          {bookmarks.map((bookmark) => (
            <BookmarkItem key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="sticky bottom-0 h-8 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none shrink-0" />
    </div>
  );
}