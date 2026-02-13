export type Bookmark = {
  id: string;
  user_id: string;
  url: string;
  title: string;
  collection_id: string | null;
  created_at: string;
  updated_at: string;
};

// For inserting (omit auto-generated fields)
export type BookmarkInsert = Omit<Bookmark, 'id' | 'created_at' | 'updated_at'>;

// For updating (all fields optional except id)
export type BookmarkUpdate = Partial<Omit<Bookmark, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;