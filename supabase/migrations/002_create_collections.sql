-- 002_create_collections.sql

-- COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON public.collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_created_at ON public.collections(created_at DESC);

-- ROW LEVEL SECURITY
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Users can ONLY view their own collections
CREATE POLICY "Users can view their own collections"
    ON public.collections
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can ONLY insert their own collections
CREATE POLICY "Users can insert their own collections"
    ON public.collections
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can ONLY update their own collections
CREATE POLICY "Users can update their own collections"
    ON public.collections
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can ONLY delete their own collections
CREATE POLICY "Users can delete their own collections"
    ON public.collections
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-update updated_at timestamp
CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON public.collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- REALTIME ENABLEMENT
ALTER PUBLICATION supabase_realtime ADD TABLE public.collections;

-- ADD FOREIGN KEY CONSTRAINT TO BOOKMARKS
ALTER TABLE public.bookmarks
    ADD CONSTRAINT fk_bookmarks_collection
    FOREIGN KEY (collection_id)
    REFERENCES public.collections(id)
    ON DELETE SET NULL;

-- Add index on bookmarks.collection_id
CREATE INDEX IF NOT EXISTS idx_bookmarks_collection_id ON public.bookmarks(collection_id);