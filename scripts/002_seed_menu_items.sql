-- Seed menu_items table with initial data for Lagoon Cafeteria (Stall 1)
INSERT INTO menu_items (name, description, price, stock, category, image, stall_id, stall_name, stall_number)
VALUES
  ('Shawarma Rice', 'Savory shawarma meat served over steaming rice with garlic sauce', 65, 25, 'meals', '/shawarma-rice-bowl.jpg', 'lagoon-cafeteria', 'Lagoon Cafeteria', 1),
  ('Chicken Adobo Rice', 'Classic Filipino adobo with tender chicken in savory soy-vinegar sauce', 55, 30, 'meals', '/chicken-adobo-rice.jpg', 'lagoon-cafeteria', 'Lagoon Cafeteria', 1),
  ('Burger Meal', 'Juicy beef patty with fresh vegetables and special sauce', 75, 20, 'snacks', '/burger-sandwich.jpg', 'lagoon-cafeteria', 'Lagoon Cafeteria', 1),
  ('French Fries', 'Crispy golden fries with ketchup', 35, 40, 'snacks', '/crispy-french-fries.png', 'lagoon-cafeteria', 'Lagoon Cafeteria', 1),
  ('Footlong Hotdog', 'Classic footlong hotdog with mustard and ketchup', 45, 15, 'snacks', '/footlong-hotdog.jpg', 'lagoon-cafeteria', 'Lagoon Cafeteria', 1),
  ('Siomai Rice', 'Steamed pork dumplings served with garlic rice', 50, 35, 'meals', '/siomai-dumplings-rice.jpg', 'lagoon-cafeteria', 'Lagoon Cafeteria', 1),
  ('Iced Tea', 'Refreshing house-blend iced tea', 25, 50, 'beverages', '/iced-tea-glass.png', 'lagoon-cafeteria', 'Lagoon Cafeteria', 1),
  ('Sago Gulaman', 'Sweet Filipino drink with tapioca pearls and jelly', 30, 3, 'beverages', '/sago-gulaman-drink.jpg', 'lagoon-cafeteria', 'Lagoon Cafeteria', 1)
ON CONFLICT (id) DO NOTHING;
