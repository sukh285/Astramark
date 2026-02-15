"use client";

import { createClient } from "@/lib/supabase/client";
import { Collection } from "@/app/types/db.types";
import { useEffect, useState } from "react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export function useRealtimeCollections(
  initialCollections: Collection[],
  userId: string
) {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);

  // 1. Sync server-side revalidation
  useEffect(() => {
    setCollections(initialCollections);
  }, [initialCollections]);

  // 2. Realtime Subscription
  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupRealtime = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      channel = supabase
        .channel("collections-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "collections",
          },
          (payload: RealtimePostgresChangesPayload<Collection>) => {
            if (payload.eventType === "INSERT") {
              setCollections((prev) => [...prev, payload.new]);
            } else if (payload.eventType === "DELETE") {
              setCollections((prev) => prev.filter((c) => c.id !== payload.old.id));
            } else if (payload.eventType === "UPDATE") {
              setCollections((prev) =>
                prev.map((c) => (c.id === payload.new.id ? payload.new : c))
              );
            }
          }
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [userId]);

  // 3. Sort: Default First, then Updated At Descending
  const sortedCollections = [...collections].sort((a, b) => {
    if (a.is_default) return -1;
    if (b.is_default) return 1;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  return { collections: sortedCollections };
}