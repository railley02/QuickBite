-- Update menu items to use proper stall UUIDs
-- Clear existing menu items and reinsert with correct stall_id

DELETE FROM menu_items;

-- Insert menu items for Lagoon Cafeteria (stall_number 1)
INSERT INTO menu_items (stall_id, stall_name, stall_number, name, description, price, stock, category, image) VALUES
  ((SELECT id FROM stalls WHERE stall_number = 1), 'Lagoon Cafeteria', 1, 'Shawarma Rice', 'Savory chicken shawarma over garlic rice', 65, 25, 'meals', '/shawarma-rice-bowl.jpg'),
  ((SELECT id FROM stalls WHERE stall_number = 1), 'Lagoon Cafeteria', 1, 'Chicken Adobo Rice', 'Classic Filipino adobo with jasmine rice', 55, 30, 'meals', '/chicken-adobo-rice.jpg'),
  ((SELECT id FROM stalls WHERE stall_number = 1), 'Lagoon Cafeteria', 1, 'Burger Meal', 'Beef burger with fries and drink', 75, 20, 'meals', '/burger-sandwich.jpg'),
  ((SELECT id FROM stalls WHERE stall_number = 1), 'Lagoon Cafeteria', 1, 'Fries', 'Crispy golden french fries', 30, 50, 'snacks', '/crispy-french-fries.png'),
  ((SELECT id FROM stalls WHERE stall_number = 1), 'Lagoon Cafeteria', 1, 'Footlong', 'Classic footlong hotdog sandwich', 45, 15, 'snacks', '/footlong-hotdog.jpg'),
  ((SELECT id FROM stalls WHERE stall_number = 1), 'Lagoon Cafeteria', 1, 'Siomai Rice', 'Pork siomai with soy garlic rice', 40, 35, 'meals', '/siomai-dumplings-rice.jpg'),
  ((SELECT id FROM stalls WHERE stall_number = 1), 'Lagoon Cafeteria', 1, 'Iced Tea', 'Refreshing lemon iced tea', 20, 100, 'drinks', '/iced-tea-glass.png'),
  ((SELECT id FROM stalls WHERE stall_number = 1), 'Lagoon Cafeteria', 1, 'Sago''t Gulaman', 'Sweet tapioca and jelly drink', 25, 80, 'drinks', '/sago-gulaman-drink.jpg');

-- Insert menu items for East Wing Food Hub (stall_number 2)
INSERT INTO menu_items (stall_id, stall_name, stall_number, name, description, price, stock, category, image) VALUES
  ((SELECT id FROM stalls WHERE stall_number = 2), 'East Wing Food Hub', 2, 'Pancit Canton', 'Stir-fried noodles with vegetables', 50, 20, 'meals', '/shawarma-rice-bowl.jpg'),
  ((SELECT id FROM stalls WHERE stall_number = 2), 'East Wing Food Hub', 2, 'Lumpia Shanghai', 'Crispy pork spring rolls (5 pcs)', 35, 40, 'snacks', '/footlong-hotdog.jpg'),
  ((SELECT id FROM stalls WHERE stall_number = 2), 'East Wing Food Hub', 2, 'Halo-Halo', 'Mixed shaved ice dessert', 60, 15, 'drinks', '/sago-gulaman-drink.jpg');
