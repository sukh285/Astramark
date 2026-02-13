import { createClient } from "@/lib/supabase/server";
import type { Bookmark } from "@/app/types/db.types";


// Bookmark Service that contains all business logic for bookmark operations
export class BookmarkService {
  // Create a new bookmark
  static async create(params: {
    title: string;
    url: string;
    userId: string;
  }): Promise<Bookmark> {
    // Validation
    if (!params.title?.trim()) {
      throw new Error("Title is required");
    }

    if (!params.url?.trim()) {
      throw new Error("URL is required");
    }

    // URL format validation
    try {
      new URL(params.url);
    } catch {
      throw new Error("Invalid URL format");
    }

    // Database operation
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        user_id: params.userId,
        title: params.title.trim(),
        url: params.url.trim(),
        collection_id: null,
      })
      .select()
      .single();

    if (error) {
      console.error("BookmarkService.create Error:", error);
      throw new Error("Failed to create bookmark");
    }

    if (!data) {
      throw new Error("No data returned after insert");
    }

    return data;
  }

  // Fetch all bookmarks for authenticated user
  static async getAll(): Promise<Bookmark[]> {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("BookmarkService.getAll Error:", error);
      throw new Error("Failed to fetch bookmarks");
    }

    return data || [];
  }

  // Delete a bookmark by ID
  // RLS ensures user can only delete their own bookmarks
  static async delete(params: {
    bookmarkId: string;
    userId: string;
  }): Promise<void> {
    if (!params.bookmarkId) {
      throw new Error("Bookmark ID is required");
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", params.bookmarkId);

    if (error) {
      console.error("BookmarkService.delete Error:", error);
      throw new Error("Failed to delete bookmark");
    }
  }

  // Verify user is authenticated
  // Helper method for authorization checks
  static async getCurrentUser() {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    return user;
  }
}
