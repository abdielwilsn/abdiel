-- Fix for 406 errors - Run this if you're getting 406 errors
-- This adds missing columns and fixes any schema issues

-- Add missing columns to site_config if they don't exist
DO $$
BEGIN
  -- Add experiences column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_config' AND column_name = 'experiences'
  ) THEN
    ALTER TABLE site_config ADD COLUMN experiences JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Add certifications column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_config' AND column_name = 'certifications'
  ) THEN
    ALTER TABLE site_config ADD COLUMN certifications JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Make sure slug column exists in posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'slug'
  ) THEN
    ALTER TABLE posts ADD COLUMN slug TEXT;
  END IF;
END $$;

-- Drop and recreate the RLS policies to ensure they work correctly
DROP POLICY IF EXISTS "Allow public read access on site_config" ON site_config;
DROP POLICY IF EXISTS "Allow authenticated insert on site_config" ON site_config;
DROP POLICY IF EXISTS "Allow authenticated update on site_config" ON site_config;
DROP POLICY IF EXISTS "Allow authenticated delete on site_config" ON site_config;

CREATE POLICY "Allow public read access on site_config"
  ON site_config FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on site_config"
  ON site_config FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on site_config"
  ON site_config FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on site_config"
  ON site_config FOR DELETE
  TO authenticated
  USING (true);

-- Same for posts
DROP POLICY IF EXISTS "Allow public read access on posts" ON posts;
DROP POLICY IF EXISTS "Allow authenticated insert on posts" ON posts;
DROP POLICY IF EXISTS "Allow authenticated update on posts" ON posts;
DROP POLICY IF EXISTS "Allow authenticated delete on posts" ON posts;

CREATE POLICY "Allow public read access on posts"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on posts"
  ON posts FOR DELETE
  TO authenticated
  USING (true);

-- Create index on slug if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Verify the schema
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('site_config', 'posts')
ORDER BY table_name, ordinal_position;
