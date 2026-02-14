-- 002_create_collections.sql

-- COLLECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON public.collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_created_at ON public.collections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collections_default ON public.collections(user_id, is_default) WHERE is_default = TRUE;

-- ROW LEVEL SECURITY
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Users can view their own collections
CREATE POLICY "Users can view their own collections"
    ON public.collections FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own collections
CREATE POLICY "Users can insert their own collections"
    ON public.collections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own collections (but cannot change is_default)
CREATE POLICY "Users can update their own collections"
    ON public.collections FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id AND is_default = OLD.is_default);

-- Users can delete their own non-default collections
CREATE POLICY "Users can delete their own non-default collections"
    ON public.collections FOR DELETE
    USING (auth.uid() = user_id AND is_default = FALSE);

-- Auto-update updated_at timestamp (reuse function from bookmarks)
CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON public.collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- REALTIME ENABLEMENT
ALTER PUBLICATION supabase_realtime ADD TABLE public.collections;

-- ADD FOREIGN KEY CONSTRAINT TO BOOKMARKS
-- Link bookmarks.collection_id to collections.id
ALTER TABLE public.bookmarks
    ADD CONSTRAINT fk_bookmarks_collection
    FOREIGN KEY (collection_id)
    REFERENCES public.collections(id)
    ON DELETE CASCADE;

-- Make collection_id NOT NULL (every bookmark must belong to a collection)
ALTER TABLE public.bookmarks
    ALTER COLUMN collection_id SET NOT NULL;

-- Add index on bookmarks.collection_id for faster queries
CREATE INDEX IF NOT EXISTS idx_bookmarks_collection_id ON public.bookmarks(collection_id);

-- FUNCTION: Auto-create default collection for new users
CREATE OR REPLACE FUNCTION create_default_collection_for_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Create default "All Bookmarks" collection when user signs up
    INSERT INTO public.collections (user_id, title, is_default)
    VALUES (NEW.id, 'All Bookmarks', TRUE);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: Create default collection on user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_collection_for_user();

-- MIGRATION HELPER: Create default collection for existing users
-- This ensures existing users get a default collection
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN 
        SELECT id FROM auth.users 
        WHERE NOT EXISTS (
            SELECT 1 FROM public.collections 
            WHERE user_id = auth.users.id AND is_default = TRUE
        )
    LOOP
        INSERT INTO public.collections (user_id, title, is_default)
        VALUES (user_record.id, 'All Bookmarks', TRUE);
    END LOOP;
END $$;

-- MIGRATION HELPER: Move existing bookmarks to default collection
-- For any bookmarks with NULL collection_id, assign to user's default collection
UPDATE public.bookmarks
SET collection_id = (
    SELECT id FROM public.collections 
    WHERE user_id = bookmarks.user_id AND is_default = TRUE
    LIMIT 1
)
WHERE collection_id IS NULL;