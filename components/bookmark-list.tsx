'use client';

import type { Bookmark } from "@/app/types/db.types";
import { BookmarkItem } from "./bookmark-item";
import { useRealtimeBookmarks } from "@/app/hooks/use-realtime";

export function BookmarkList({ 
  initialBookmarks, 
  userId 
}: { 
  initialBookmarks: Bookmark[];
  userId: string;
}) {
  // Logic broken into seperate hook
  const { bookmarks } = useRealtimeBookmarks(initialBookmarks, userId);

  if (bookmarks.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">
          No bookmarks yet. Add your first one above!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {bookmarks.length} {bookmarks.length === 1 ? 'Bookmark' : 'Bookmarks'}
      </h3>
      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <BookmarkItem key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
}