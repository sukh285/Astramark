// Bookmark type
export type Bookmark = {
  id: string;
  user_id: string;
  url: string;
  title: string;
  collection_id: string; // NOT NULL - always belongs to a collection
  created_at: string;
  updated_at: string;
};

export type BookmarkInsert = Omit<Bookmark, 'id' | 'created_at' | 'updated_at'>;
export type BookmarkUpdate = Partial<Omit<Bookmark, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

// Collection type
export type Collection = {
  id: string;
  user_id: string;
  title: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type CollectionInsert = Omit<Collection, 'id' | 'created_at' | 'updated_at'>;
export type CollectionUpdate = Partial<Omit<Collection, 'id' | 'user_id' | 'is_default' | 'created_at' | 'updated_at'>>;

// Extended types for UI
export type CollectionWithCount = Collection & {
  bookmark_count?: number;
};