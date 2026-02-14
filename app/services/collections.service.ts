import { createClient } from "@/lib/supabase/server";
import type { Collection } from "@/app/types/db.types";

// Collections Service
export class CollectionsService {
  // Fetch all collections for authenticated user
  static async getAll(): Promise<Collection[]> {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('is_default', { ascending: false }) // Default first
      .order('created_at', { ascending: false });

    if (error) {
      console.error("CollectionsService.getAll Error:", error);
      throw new Error("Failed to fetch collections");
    }

    return data || [];
  }

  // Get user's default collection
  static async getDefault(): Promise<Collection | null> {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_default', true)
      .single();

    if (error) {
      console.error("CollectionsService.getDefault Error:", error);
      return null;
    }

    return data;
  }

  // Get collection by ID
  static async getById(params: {
    collectionId: string;
    userId: string;
  }): Promise<Collection | null> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', params.collectionId)
      .single();

    if (error) {
      console.error("CollectionsService.getById Error:", error);
      return null;
    }

    return data;
  }

  // Create a new collection
  static async create(params: {
    title: string;
    userId: string;
  }): Promise<Collection> {
    // Validation
    if (!params.title?.trim()) {
      throw new Error("Collection title is required");
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('collections')
      .insert({
        user_id: params.userId,
        title: params.title.trim(),
        is_default: false, // User-created collections are never default
      })
      .select()
      .single();

    if (error) {
      console.error("CollectionsService.create Error:", error);
      throw new Error("Failed to create collection");
    }

    if (!data) {
      throw new Error("No data returned after insert");
    }

    return data;
  }

  // Update collection title
  static async update(params: {
    collectionId: string;
    title: string;
    userId: string;
  }): Promise<Collection> {
    if (!params.title?.trim()) {
      throw new Error("Collection title is required");
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('collections')
      .update({ title: params.title.trim() })
      .eq('id', params.collectionId)
      .select()
      .single();

    if (error) {
      console.error("CollectionsService.update Error:", error);
      throw new Error("Failed to update collection");
    }

    if (!data) {
      throw new Error("No data returned after update");
    }

    return data;
  }

  // Delete a collection (only non-default)
  // Bookmarks are CASCADE deleted
  static async delete(params: {
    collectionId: string;
    userId: string;
  }): Promise<void> {
    if (!params.collectionId) {
      throw new Error("Collection ID is required");
    }

    const supabase = await createClient();
    
    // Verify it's not the default collection
    const collection = await this.getById({ 
      collectionId: params.collectionId, 
      userId: params.userId 
    });
    
    if (collection?.is_default) {
      throw new Error("Cannot delete default collection");
    }
    
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', params.collectionId);

    if (error) {
      console.error("CollectionsService.delete Error:", error);
      throw new Error("Failed to delete collection");
    }
  }

  // Helper: Verify user is authenticated
  static async getCurrentUser() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    return user;
  }
}