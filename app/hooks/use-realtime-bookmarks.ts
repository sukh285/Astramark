"use client";

import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "@/app/types/db.types";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useEffect, useState, useRef } from "react";

export function useRealtimeBookmarks(
  initialBookmarks: Bookmark[],
  currentCollectionId: string,
  userId: string
) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const collectionRef = useRef(currentCollectionId);

  // Sync ref
  useEffect(() => {
    collectionRef.current = currentCollectionId;
  }, [currentCollectionId]);

  // Sync state when initialBookmarks change (e.g. fresh fetch)
  useEffect(() => {
    setBookmarks(initialBookmarks);
  }, [initialBookmarks]);

  useEffect(() => {
    const supabase = createClient();
    // Simplified channel name to avoid any potential mismatch
    const channel = supabase
      .channel('db-changes') 
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        (payload: RealtimePostgresChangesPayload<Bookmark>) => {
          const activeId = collectionRef.current;
          console.log(`[Realtime] Event: ${payload.eventType}`, payload);

          if (payload.eventType === "INSERT") {
             if (payload.new.collection_id === activeId) {
                console.log("--> INSERT: Match found, adding.");
                setBookmarks((cur) => {
                   if (cur.find(b => b.id === payload.new.id)) return cur;
                   return [payload.new, ...cur];
                });
             } else {
                console.log("--> INSERT: Ignored (Different collection)");
             }
          } 
          else if (payload.eventType === "DELETE") {
             setBookmarks((cur) => cur.filter((b) => b.id !== payload.old.id));
          } 
          else if (payload.eventType === "UPDATE") {
             setBookmarks((cur) => {
                const exists = cur.find(b => b.id === payload.new.id);
                const belongs = payload.new.collection_id === activeId;

                if (exists && belongs) return cur.map(b => b.id === payload.new.id ? payload.new : b);
                if (exists && !belongs) return cur.filter(b => b.id !== payload.new.id);
                if (!exists && belongs) return [payload.new, ...cur];
                return cur;
             });
          }
        }
      )
      .subscribe((status) => {
        console.log(`[Realtime] Connection Status: ${status}`);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Connect once on mount

  return { bookmarks, setBookmarks };
}