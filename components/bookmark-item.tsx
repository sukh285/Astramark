"use client";

import { deleteBookmark, updateBookmark } from "@/app/actions/bookmarks";
import type { Bookmark } from "@/app/types/db.types";
import Link from "next/link";
import { useState, useEffect } from "react";

export function BookmarkItem({ bookmark }: { bookmark: Bookmark }) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // 1. Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 2. Form State (initialize with current props)
  const [title, setTitle] = useState(bookmark.title);
  const [url, setUrl] = useState(bookmark.url);

  // Sync local state if realtime updates the prop while we aren't editing
  useEffect(() => {
    if (!isEditing) {
      setTitle(bookmark.title);
      setUrl(bookmark.url);
    }
  }, [bookmark, isEditing]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this bookmark?")) return;
    setIsDeleting(true);
    const result = await deleteBookmark(bookmark.id);
    if (result.error) {
      alert(result.error);
      setIsDeleting(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("url", url);

    const result = await updateBookmark(bookmark.id, formData);

    setIsSaving(false);
    if (result.error) {
      alert(result.error);
    } else {
      setIsEditing(false);
    }
  }

  // Format date
  const formattedDate = new Date(bookmark.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // EDIT MODE
  if (isEditing) {
    return (
      <div className="bg-card border border-accent/50 rounded-lg p-4 shadow-sm">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground ml-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2 py-1 bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground ml-1">URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-2 py-1 bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono text-muted-foreground"
            />
          </div>
          
          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setTitle(bookmark.title); // Reset on cancel
                setUrl(bookmark.url);
              }}
              disabled={isSaving}
              className="px-3 py-1 text-xs font-medium hover:bg-muted rounded transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 rounded transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DISPLAY MODE (Default)
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

        <div className="flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            disabled={isDeleting}
            className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition"
          >
            Edit
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1.5 text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-md transition disabled:opacity-50"
          >
            {isDeleting ? "..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}