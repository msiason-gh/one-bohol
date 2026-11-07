-- ==============================================================================
-- ONE BOHOL FOR GOOD GOVERNANCE (OBGG) - DATABASE SCHEMA & POLICIES
-- Target: Supabase (PostgreSQL 15+)
-- ==============================================================================

-- 1. Create public.members table
CREATE TABLE IF NOT EXISTS public.members (
  id TEXT PRIMARY KEY, -- e.g. 'OBGG-2026-0001'
  first_name TEXT NOT NULL,
  middle_name TEXT DEFAULT '',
  last_name TEXT NOT NULL,
  suffix TEXT DEFAULT '',
  birthdate TEXT NOT NULL,
  age INTEGER NOT NULL,
  sex TEXT NOT NULL CHECK (sex IN ('Male', 'Female')),
  civil_status TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  region TEXT NOT NULL,
  province TEXT NOT NULL,
  municipality TEXT NOT NULL,
  barangay TEXT NOT NULL,
  bohol_district TEXT,
  role TEXT NOT NULL,
  sector TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  date_registered TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('VERIFIED', 'PENDING', 'INACTIVE')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for high-performance institutional filtering
CREATE INDEX IF NOT EXISTS idx_members_region ON public.members (region);
CREATE INDEX IF NOT EXISTS idx_members_province ON public.members (province);
CREATE INDEX IF NOT EXISTS idx_members_municipality ON public.members (municipality);
CREATE INDEX IF NOT EXISTS idx_members_role ON public.members (role);
CREATE INDEX IF NOT EXISTS idx_members_sector ON public.members (sector);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members (status);
CREATE INDEX IF NOT EXISTS idx_members_date ON public.members (date_registered DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Drop existing demo policies if re-running
DROP POLICY IF EXISTS "Allow public read access for OBGG portal" ON public.members;
DROP POLICY IF EXISTS "Allow public insert access for OBGG portal" ON public.members;
DROP POLICY IF EXISTS "Allow public update access for OBGG portal" ON public.members;
DROP POLICY IF EXISTS "Allow public delete access for OBGG portal" ON public.members;

-- Create open GovTech demo policies
CREATE POLICY "Allow public read access for OBGG portal"
  ON public.members FOR SELECT USING (true);

CREATE POLICY "Allow public insert access for OBGG portal"
  ON public.members FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access for OBGG portal"
  ON public.members FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete access for OBGG portal"
  ON public.members FOR DELETE USING (true);

-- 4. Enable Realtime live synchronization
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'members'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.members;
  END IF;
END $$;

-- 5. Create Storage Bucket for Member ID Photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-photos', 'member-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if re-running
DROP POLICY IF EXISTS "Allow public access to member-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to member-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update to member-photos" ON storage.objects;

-- Create storage bucket policies
CREATE POLICY "Allow public access to member-photos"
  ON storage.objects FOR SELECT USING (bucket_id = 'member-photos');

CREATE POLICY "Allow public upload to member-photos"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'member-photos');

CREATE POLICY "Allow public update to member-photos"
  ON storage.objects FOR UPDATE USING (bucket_id = 'member-photos');
