-- 003_finalize_collections.sql

DROP POLICY IF EXISTS "Users can update their own collections" ON public.collections;

CREATE POLICY "Users can update their own collections"
    ON public.collections FOR UPDATE
    USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION protect_default_collection()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF OLD.is_default = TRUE AND NEW.is_default = FALSE THEN
        RAISE EXCEPTION 'Cannot change default collection flag';
    END IF;
    
    IF OLD.is_default = FALSE AND NEW.is_default = TRUE THEN
        RAISE EXCEPTION 'Cannot manually set collection as default';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_default_collection_changes
    BEFORE UPDATE ON public.collections
    FOR EACH ROW
    EXECUTE FUNCTION protect_default_collection();

CREATE TRIGGER update_bookmarks_updated_at
    BEFORE UPDATE ON public.bookmarks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;