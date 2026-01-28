INSERT INTO categories (name, slug, description, parent_id) VALUES
('Men', 'men', 'Men''s Fashion', NULL),
('Women', 'women', 'Women''s Fashion', NULL),
('Kids', 'kids', 'Kids Fashion', NULL),
('Accessories', 'accessories', 'Fashion Accessories', NULL);

-- Subcategories for Men
INSERT INTO categories (name, slug, description, parent_id) VALUES
('T-Shirts', 'men-tshirts', 'Men''s T-Shirts', 1),
('Jeans', 'men-jeans', 'Men''s Jeans', 1),
('Jackets', 'men-jackets', 'Men''s Jackets', 1),
('Shoes', 'men-shoes', 'Men''s Shoes', 1);

-- Subcategories for Women
INSERT INTO categories (name, slug, description, parent_id) VALUES
('Dresses', 'women-dresses', 'Women''s Dresses', 2),
('Tops', 'women-tops', 'Women''s Tops', 2),
('Jeans', 'women-jeans', 'Women''s Jeans', 2),
('Heels', 'women-heels', 'Women''s Heels', 2);