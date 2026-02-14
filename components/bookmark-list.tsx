'use client';

import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/app/types/db.types";
import { useEffect, useState } from "react";
import { BookmarkItem } from "./bookmark-item";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export function BookmarkList({ 
  initialBookmarks, 
  userId 
}: { 
  initialBookmarks: Bookmark[];
  userId: string;
}) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);

  // 1. Sync server-side revalidation with local state
  useEffect(() => {
    setBookmarks(initialBookmarks);
  }, [initialBookmarks]);

  // 2. Realtime Subscription
  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupRealtime = async () => {
      // A. Ensure we have a valid session before connecting
      // This prevents connecting as 'anon' which causes RLS to block everything
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.error("No active session found. Realtime will fail.");
        return;
      }

      console.log('Setting up realtime for user:', userId);

      channel = supabase
        .channel('bookmarks-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            // REMOVED FILTER: `filter: 'user_id=eq.${userId}'` -> this was blocking the channel
            // Why? DELETE events don't include user_id, so that filter blocks deletes.
            // RLS policy already handles the filtering securely!
          },
          (payload: RealtimePostgresChangesPayload<Bookmark>) => {
            console.log('Event received:', payload.eventType);

            if (payload.eventType === 'INSERT') {
              setBookmarks((cur) => {
                if (cur.find(b => b.id === payload.new.id)) return cur;
                return [payload.new, ...cur];
              });
            } 
            else if (payload.eventType === 'DELETE') {
              setBookmarks((cur) => 
                cur.filter((b) => b.id !== payload.old.id)
              );
            } 
            else if (payload.eventType === 'UPDATE') {
              setBookmarks((cur) =>
                cur.map((b) =>
                  b.id === payload.new.id ? payload.new : b
                )
              );
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Realtime Connected as Authenticated User');
          }
        });
    };

    setupRealtime();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [userId]);

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