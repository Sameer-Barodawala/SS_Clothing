INSERT INTO products (name, slug, description, price, sale_price, category_id, brand, sizes, colors, stock, images, is_featured, is_new_arrival, black_friday_deal, black_friday_discount) VALUES
('Classic White T-Shirt', 'classic-white-tshirt', 'Premium cotton t-shirt with a classic fit', 29.99, 19.99, 5, 'Fashion Brand', '["S", "M", "L", "XL", "XXL"]', '["White", "Black", "Navy"]', 150, '["https://via.placeholder.com/400x500?text=White+Tshirt"]', TRUE, TRUE, TRUE, 33),

('Slim Fit Blue Jeans', 'slim-fit-blue-jeans', 'Comfortable slim fit jeans with stretch fabric', 79.99, 49.99, 6, 'Denim Co', '["28", "30", "32", "34", "36"]', '["Blue", "Dark Blue", "Black"]', 100, '["https://via.placeholder.com/400x500?text=Blue+Jeans"]', TRUE, FALSE, TRUE, 38),

('Leather Jacket', 'leather-jacket', 'Premium leather jacket with modern fit', 299.99, 199.99, 7, 'Premium Leather', '["S", "M", "L", "XL"]', '["Black", "Brown"]', 50, '["https://via.placeholder.com/400x500?text=Leather+Jacket"]', TRUE, FALSE, TRUE, 33),

('Running Sneakers', 'running-sneakers', 'Comfortable running shoes with cushioned sole', 89.99, 59.99, 8, 'SportWear', '["7", "8", "9", "10", "11", "12"]', '["White", "Black", "Red"]', 200, '["https://via.placeholder.com/400x500?text=Sneakers"]', FALSE, TRUE, TRUE, 33),

('Casual Polo Shirt', 'casual-polo-shirt', 'Cotton polo shirt perfect for casual occasions', 39.99, NULL, 5, 'Fashion Brand', '["S", "M", "L", "XL"]', '["Navy", "Red", "Green", "Black"]', 120, '["https://via.placeholder.com/400x500?text=Polo"]', FALSE, TRUE, FALSE, 0),

-- Women's Products
('Summer Floral Dress', 'summer-floral-dress', 'Light and breezy floral print dress', 79.99, 39.99, 9, 'Summer Collection', '["XS", "S", "M", "L", "XL"]', '["Floral Pink", "Floral Blue", "Floral Yellow"]', 80, '["https://via.placeholder.com/400x500?text=Floral+Dress"]', TRUE, TRUE, TRUE, 50),

('Silk Blouse', 'silk-blouse', 'Elegant silk blouse for office and evening wear', 69.99, 44.99, 10, 'Elegant Wear', '["XS", "S", "M", "L", "XL"]', '["White", "Black", "Red", "Navy"]', 90, '["https://via.placeholder.com/400x500?text=Silk+Blouse"]', TRUE, FALSE, TRUE, 36),

('High-Waisted Skinny Jeans', 'high-waisted-skinny-jeans', 'Stretchy high-waisted skinny jeans', 69.99, 41.99, 11, 'Denim Co', '["24", "26", "28", "30", "32"]', '["Blue", "Black", "Grey"]', 150, '["https://via.placeholder.com/400x500?text=Skinny+Jeans"]', FALSE, TRUE, TRUE, 40),

('Classic Black Heels', 'classic-black-heels', 'Timeless black heels for any occasion', 99.99, 69.99, 12, 'Heel Heaven', '["5", "6", "7", "8", "9", "10"]', '["Black", "Nude", "Red"]', 75, '["https://via.placeholder.com/400x500?text=Black+Heels"]', TRUE, FALSE, TRUE, 30),

('Cardigan Sweater', 'cardigan-sweater', 'Cozy cardigan perfect for layering', 59.99, NULL, 10, 'Cozy Knits', '["S", "M", "L", "XL"]', '["Grey", "Beige", "Black", "Navy"]', 100, '["https://via.placeholder.com/400x500?text=Cardigan"]', FALSE, TRUE, FALSE, 0),

-- More Products for Infinite Scroll
('Graphic T-Shirt', 'graphic-tshirt', 'Trendy graphic print t-shirt', 24.99, 14.99, 5, 'Street Wear', '["S", "M", "L", "XL"]', '["Black", "White", "Grey"]', 200, '["https://via.placeholder.com/400x500?text=Graphic+Tee"]', FALSE, TRUE, TRUE, 40),

('Chino Pants', 'chino-pants', 'Classic chino pants for men', 59.99, NULL, 6, 'Classic Fit', '["28", "30", "32", "34", "36"]', '["Khaki", "Navy", "Black"]', 130, '["https://via.placeholder.com/400x500?text=Chino+Pants"]', FALSE, FALSE, FALSE, 0),

('Bomber Jacket', 'bomber-jacket', 'Stylish bomber jacket', 129.99, 89.99, 7, 'Urban Style', '["S", "M", "L", "XL"]', '["Black", "Green", "Navy"]', 60, '["https://via.placeholder.com/400x500?text=Bomber+Jacket"]', FALSE, FALSE, TRUE, 31),

('Canvas Sneakers', 'canvas-sneakers', 'Casual canvas sneakers', 49.99, 34.99, 8, 'Casual Foot', '["7", "8", "9", "10", "11"]', '["White", "Black", "Red"]', 180, '["https://via.placeholder.com/400x500?text=Canvas+Shoes"]', FALSE, TRUE, TRUE, 30),

('V-Neck Sweater', 'vneck-sweater', 'Wool blend v-neck sweater', 69.99, NULL, 5, 'Winter Warmth', '["S", "M", "L", "XL"]', '["Grey", "Navy", "Burgundy"]', 95, '["https://via.placeholder.com/400x500?text=V-Neck"]', FALSE, FALSE, FALSE, 0),

('Maxi Dress', 'maxi-dress', 'Elegant maxi dress for special occasions', 89.99, 59.99, 9, 'Evening Elegance', '["XS", "S", "M", "L", "XL"]', '["Black", "Navy", "Wine"]', 70, '["https://via.placeholder.com/400x500?text=Maxi+Dress"]', TRUE, FALSE, TRUE, 33),

('Crop Top', 'crop-top', 'Trendy crop top', 29.99, 19.99, 10, 'Trendy Tops', '["XS", "S", "M", "L"]', '["White", "Black", "Pink", "Blue"]', 160, '["https://via.placeholder.com/400x500?text=Crop+Top"]', FALSE, TRUE, TRUE, 33),

('Mom Jeans', 'mom-jeans', 'High-rise mom jeans', 74.99, NULL, 11, 'Vintage Denim', '["24", "26", "28", "30"]', '["Light Blue", "Dark Blue"]', 110, '["https://via.placeholder.com/400x500?text=Mom+Jeans"]', FALSE, TRUE, FALSE, 0),

('Ankle Boots', 'ankle-boots', 'Stylish ankle boots', 119.99, 83.99, 12, 'Boot Boutique', '["5", "6", "7", "8", "9"]', '["Black", "Brown", "Tan"]', 85, '["https://via.placeholder.com/400x500?text=Ankle+Boots"]', FALSE, FALSE, TRUE, 30),

('Denim Jacket', 'denim-jacket', 'Classic denim jacket', 89.99, 62.99, 7, 'Denim Co', '["S", "M", "L", "XL"]', '["Light Blue", "Dark Blue", "Black"]', 95, '["https://via.placeholder.com/400x500?text=Denim+Jacket"]', FALSE, TRUE, TRUE, 30);

-- Add 30 more products for better infinite scroll demonstration
INSERT INTO products (name, slug, description, price, sale_price, category_id, brand, sizes, colors, stock, is_featured, is_new_arrival, black_friday_deal, black_friday_discount) VALUES
('Striped Button Down', 'striped-button-down-1', 'Classic striped shirt', 49.99, 34.99, 5, 'Classic Shirts', '["S", "M", "L", "XL"]', '["Blue", "White"]', 100, FALSE, FALSE, TRUE, 30),
('Cargo Pants', 'cargo-pants-1', 'Utility cargo pants', 69.99, NULL, 6, 'Urban Cargo', '["30", "32", "34", "36"]', '["Khaki", "Black", "Olive"]', 120, FALSE, FALSE, FALSE, 0),
('Puffer Jacket', 'puffer-jacket-1', 'Warm puffer jacket', 149.99, 104.99, 7, 'Winter Gear', '["S", "M", "L", "XL"]', '["Black", "Navy"]', 70, FALSE, TRUE, TRUE, 30),
('Loafers', 'loafers-1', 'Leather loafers', 89.99, NULL, 8, 'Classic Shoes', '["7", "8", "9", "10", "11"]', '["Brown", "Black"]', 90, FALSE, FALSE, FALSE, 0),
('Henley Shirt', 'henley-shirt-1', 'Long sleeve henley', 39.99, 27.99, 5, 'Casual Wear', '["S", "M", "L", "XL"]', '["Grey", "Navy", "Black"]', 140, FALSE, TRUE, TRUE, 30),
('Wrap Dress', 'wrap-dress-1', 'Flattering wrap dress', 79.99, 55.99, 9, 'Day Dresses', '["XS", "S", "M", "L"]', '["Red", "Black", "Blue"]', 80, FALSE, FALSE, TRUE, 30),
('Tank Top', 'tank-top-1', 'Basic tank top', 19.99, NULL, 10, 'Basics', '["XS", "S", "M", "L"]', '["White", "Black", "Grey"]', 200, FALSE, FALSE, FALSE, 0),
('Boyfriend Jeans', 'boyfriend-jeans-1', 'Relaxed fit jeans', 69.99, 48.99, 11, 'Denim Co', '["24", "26", "28", "30"]', '["Light Blue", "Dark Blue"]', 100, FALSE, TRUE, TRUE, 30),
('Platform Sandals', 'platform-sandals-1', 'Trendy platform sandals', 69.99, NULL, 12, 'Summer Shoes', '["5", "6", "7", "8", "9"]', '["Tan", "White", "Black"]', 110, FALSE, TRUE, FALSE, 0),
('Turtleneck Sweater', 'turtleneck-sweater-1', 'Cozy turtleneck', 59.99, 41.99, 5, 'Winter Warmth', '["S", "M", "L", "XL"]', '["Black", "Cream", "Grey"]', 90, FALSE, FALSE, TRUE, 30);

-- Add 20 more products
INSERT INTO products (name, slug, description, price, sale_price, category_id, brand, sizes, colors, stock, is_featured, is_new_arrival, black_friday_deal, black_friday_discount) VALUES
('Flannel Shirt', 'flannel-shirt-2', 'Warm flannel shirt', 44.99, NULL, 5, 'Lumberjack', '["S", "M", "L", "XL"]', '["Red", "Blue", "Green"]', 110, FALSE, FALSE, FALSE, 0),
('Joggers', 'joggers-2', 'Comfortable joggers', 54.99, 38.49, 6, 'Athleisure', '["S", "M", "L", "XL"]', '["Black", "Grey", "Navy"]', 150, FALSE, TRUE, TRUE, 30),
('Trench Coat', 'trench-coat-2', 'Classic trench coat', 179.99, 125.99, 7, 'Timeless', '["S", "M", "L"]', '["Beige", "Black"]', 50, TRUE, FALSE, TRUE, 30),
('Chelsea Boots', 'chelsea-boots-2', 'Stylish chelsea boots', 129.99, NULL, 8, 'Boot Co', '["7", "8", "9", "10", "11"]', '["Brown", "Black"]', 75, FALSE, FALSE, FALSE, 0),
('Printed Shirt', 'printed-shirt-2', 'Bold printed shirt', 49.99, 34.99, 5, 'Pattern Play', '["S", "M", "L", "XL"]', '["Various"]', 95, FALSE, TRUE, TRUE, 30),
('Midi Skirt', 'midi-skirt-2', 'Elegant midi skirt', 54.99, NULL, 9, 'Skirt Shop', '["XS", "S", "M", "L"]', '["Black", "Navy", "Plaid"]', 100, FALSE, FALSE, FALSE, 0),
('Camisole', 'camisole-2', 'Silk camisole', 39.99, 27.99, 10, 'Silk Touch', '["XS", "S", "M", "L"]', '["Black", "White", "Nude"]', 130, FALSE, FALSE, TRUE, 30),
('Wide Leg Jeans', 'wide-leg-jeans-2', 'Trendy wide leg jeans', 79.99, 55.99, 11, 'Denim Co', '["24", "26", "28", "30"]', '["Blue", "Black"]', 90, FALSE, TRUE, TRUE, 30),
('Mules', 'mules-2', 'Comfortable mules', 79.99, NULL, 12, 'Easy Step', '["5", "6", "7", "8", "9"]', '["Black", "Tan", "White"]', 105, FALSE, FALSE, FALSE, 0),
('Pullover Hoodie', 'pullover-hoodie-2', 'Cozy pullover hoodie', 49.99, 34.99, 5, 'Comfort Wear', '["S", "M", "L", "XL"]', '["Grey", "Black", "Navy"]', 170, FALSE, TRUE, TRUE, 30);