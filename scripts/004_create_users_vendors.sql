-- Create users table for customers
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create stalls/vendors table
CREATE TABLE IF NOT EXISTS stalls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stall_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  status TEXT DEFAULT 'closed' CHECK (status IN ('open', 'closed')),
  rating NUMERIC(2,1) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  operating_hours TEXT DEFAULT '8:00 AM - 5:00 PM',
  slot_capacity INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add stall_number to menu_items if not exists (as foreign key reference)
-- Update menu_items to reference stalls table
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS stall_uuid UUID REFERENCES stalls(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stalls ENABLE ROW LEVEL SECURITY;

-- Policies for users
CREATE POLICY "Allow public read access to users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert to users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to users" ON users FOR UPDATE USING (true);

-- Policies for stalls
CREATE POLICY "Allow public read access to stalls" ON stalls FOR SELECT USING (true);
CREATE POLICY "Allow public insert to stalls" ON stalls FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to stalls" ON stalls FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to stalls" ON stalls FOR DELETE USING (true);

-- Seed initial stalls data
INSERT INTO stalls (id, stall_number, name, description, image, status, rating, total_ratings)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 1, 'Lagoon Cafeteria', 'Main cafeteria with variety of Filipino dishes', '/cafeteria-lagoon-food-stall.jpg', 'open', 4.5, 124),
  ('22222222-2222-2222-2222-222222222222', 2, 'East Wing Food Hub', 'Quick bites and snacks', '/main-cafeteria-restaurant.jpg', 'open', 4.2, 89),
  ('33333333-3333-3333-3333-333333333333', 3, 'Mcjollibee', 'Fast food favorites', '/canteen-food-court.jpg', 'closed', 4.8, 256)
ON CONFLICT (id) DO NOTHING;

-- Update existing menu_items to reference stalls
UPDATE menu_items SET stall_uuid = '11111111-1111-1111-1111-111111111111' WHERE stall_id = 'lagoon';
UPDATE menu_items SET stall_uuid = '22222222-2222-2222-2222-222222222222' WHERE stall_id = 'east-wing';
UPDATE menu_items SET stall_uuid = '33333333-3333-3333-3333-333333333333' WHERE stall_id = 'mcjollibee';
