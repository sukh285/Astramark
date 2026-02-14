"use client";

import { deleteBookmark } from "@/app/actions/bookmarks";
import type { Bookmark } from "@/app/types/db.types";
import Link from "next/link";
import { useState } from "react";

export function BookmarkItem({ bookmark }: { bookmark: Bookmark }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this bookmark?")) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteBookmark(bookmark.id);

    if (result.error) {
      alert(result.error);
      setIsDeleting(false);
    }
  }

  // Format date consistently (avoid hydration mismatch)
  const formattedDate = new Date(bookmark.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <div className="group bg-card border border-border rounded-lg p-4 hover:border-accent transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Link
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <h3 className="font-medium text-foreground hover:text-accent transition truncate">
              {bookmark.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate mt-1">
              {bookmark.url}
            </p>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">
            Added {formattedDate}
          </p>
        </div>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1.5 text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
