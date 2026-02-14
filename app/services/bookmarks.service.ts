import { createClient } from "@/lib/supabase/server";
import type { Bookmark } from "@/app/types/db.types";

//Bookmark Service
export class BookmarkService {
  //Get bookmarks by collection
  static async getByCollection(params: {
    collectionId: string;
    userId: string;
  }): Promise<Bookmark[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('collection_id', params.collectionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("BookmarkService.getByCollection Error:", error);
      throw new Error("Failed to fetch bookmarks");
    }

    return data || [];
  }

  //Create a new bookmark
  static async create(params: {
    title: string;
    url: string;
    collectionId: string; 
    userId: string;
  }): Promise<Bookmark> {
    // Validation
    if (!params.title?.trim()) {
      throw new Error("Title is required");
    }

    if (!params.url?.trim()) {
      throw new Error("URL is required");
    }

    if (!params.collectionId) {
      throw new Error("Collection is required");
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
      .from('bookmarks')
      .insert({
        user_id: params.userId,
        title: params.title.trim(),
        url: params.url.trim(),
        collection_id: params.collectionId, 
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

  //Update a bookmark
  static async update(params: {
    bookmarkId: string;
    userId: string;
    title?: string;
    url?: string;
  }): Promise<Bookmark> {
    const updates: any = {};

    // Validate and add title if provided
    if (params.title !== undefined) {
      if (!params.title.trim()) {
        throw new Error("Title cannot be empty");
      }
      updates.title = params.title.trim();
    }

    // Validate and add url if provided
    if (params.url !== undefined) {
      if (!params.url.trim()) {
        throw new Error("URL cannot be empty");
      }
      try {
        new URL(params.url);
      } catch {
        throw new Error("Invalid URL format");
      }
      updates.url = params.url.trim();
    }

    if (Object.keys(updates).length === 0) {
      throw new Error("Nothing to update");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('bookmarks')
      .update(updates)
      .eq('id', params.bookmarkId)
      .select()
      .single();

    if (error) {
      console.error("BookmarkService.update Error:", error);
      throw new Error("Failed to update bookmark");
    }

    if (!data) {
      throw new Error("No data returned after update");
    }

    return data;
  }

  //Delete a bookmark by ID
  static async delete(params: {
    bookmarkId: string;
    userId: string;
  }): Promise<void> {
    if (!params.bookmarkId) {
      throw new Error("Bookmark ID is required");
    }

    const supabase = await createClient();
    
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', params.bookmarkId);

    if (error) {
      console.error("BookmarkService.delete Error:", error);
      throw new Error("Failed to delete bookmark");
    }
  }

  //Verify user is authenticated
  static async getCurrentUser() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    return user;
  }
}