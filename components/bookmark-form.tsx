"use client";

import { createBookmark } from "@/app/actions/bookmarks";
import { useRef, useState } from "react";

export function BookmarkForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await createBookmark(formData);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      formRef.current?.reset();
      setIsLoading(false);
    }
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="bg-card border border-border rounded-lg p-6 space-y-4"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Add Bookmark</h3>
        <p className="text-sm text-muted-foreground">
          Save a new link to your collection
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-3 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium">
            URL
          </label>
          <input
            type="url"
            id="url"
            name="url"
            placeholder="https://example.com"
            required
            disabled={isLoading}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="My Awesome Link"
            required
            disabled={isLoading}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isLoading ? "Adding..." : "Add Bookmark"}
      </button>
    </form>
  );
}
