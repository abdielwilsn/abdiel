-- Portfolio Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Site Config Table
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000',
  name TEXT NOT NULL,
  bio_title TEXT NOT NULL,
  affiliations JSONB DEFAULT '[]'::jsonb,
  core_team JSONB DEFAULT '[]'::jsonb,
  "creatorOf" JSONB DEFAULT '[]'::jsonb,
  created_projects JSONB DEFAULT '[]'::jsonb,
  experiences JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  duration TEXT NOT NULL,
  categories JSONB DEFAULT '[]'::jsonb,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT NOT NULL,
  github TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Talks Table
CREATE TABLE IF NOT EXISTS talks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  event TEXT NOT NULL,
  date TEXT NOT NULL,
  link TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Table
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'podcast', 'article')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photos Table
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  caption TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tool Sections Table
CREATE TABLE IF NOT EXISTS tool_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_talks_date ON talks(date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE talks ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read access
CREATE POLICY "Allow public read access on site_config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Allow public read access on posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on talks" ON talks FOR SELECT USING (true);
CREATE POLICY "Allow public read access on media" ON media FOR SELECT USING (true);
CREATE POLICY "Allow public read access on photos" ON photos FOR SELECT USING (true);
CREATE POLICY "Allow public read access on tool_sections" ON tool_sections FOR SELECT USING (true);

-- RLS Policies: Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert on site_config" ON site_config FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on site_config" ON site_config FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on site_config" ON site_config FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on posts" ON posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on posts" ON posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on posts" ON posts FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on projects" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on projects" ON projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on talks" ON talks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on talks" ON talks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on talks" ON talks FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on media" ON media FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on media" ON media FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on media" ON media FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on photos" ON photos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on photos" ON photos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on photos" ON photos FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on tool_sections" ON tool_sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on tool_sections" ON tool_sections FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on tool_sections" ON tool_sections FOR DELETE TO authenticated USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_talks_updated_at BEFORE UPDATE ON talks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tool_sections_updated_at BEFORE UPDATE ON tool_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
