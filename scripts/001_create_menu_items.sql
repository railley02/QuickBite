-- Create menu_items table for vendor menu management
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  image TEXT,
  stall_id TEXT NOT NULL,
  stall_name TEXT NOT NULL,
  stall_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (public menu)
-- In production, you would tie this to vendor authentication
CREATE POLICY "Allow public read access to menu_items" 
  ON menu_items FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert to menu_items" 
  ON menu_items FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update to menu_items" 
  ON menu_items FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete to menu_items" 
  ON menu_items FOR DELETE 
  USING (true);

-- Create index for faster queries by stall
CREATE INDEX idx_menu_items_stall_id ON menu_items(stall_id);
CREATE INDEX idx_menu_items_category ON menu_items(category);
