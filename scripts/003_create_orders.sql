-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  stall_id TEXT NOT NULL,
  stall_name TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  pickup_time TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to orders"
  ON orders FOR SELECT
  USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert to orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Allow public update
CREATE POLICY "Allow public update to orders"
  ON orders FOR UPDATE
  USING (true);

-- Create index for faster queries
CREATE INDEX idx_orders_stall_id ON orders(stall_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
