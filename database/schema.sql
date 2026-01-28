-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS SS_clothing;
USE SS_clothing;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Categories Table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(255),
    parent_id INT,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products Table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2) DEFAULT NULL,
    category_id INT,
    brand VARCHAR(100),
    sizes JSON,
    colors JSON,
    stock_quantity INT DEFAULT 0,
    images JSON,
    is_featured TINYINT(1) DEFAULT 0,
    is_new_arrival TINYINT(1) DEFAULT 0,
    black_friday_deal TINYINT(1) DEFAULT 0,
    black_friday_discount INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    rating DECIMAL(2,1) DEFAULT 0.0,
    rating_count INT DEFAULT 0,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category_id (category_id),
    INDEX idx_price (price),
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured),
    INDEX idx_is_new_arrival (is_new_arrival),
    INDEX idx_black_friday (black_friday_deal),
    CONSTRAINT chk_price_positive CHECK (price >= 0),
    CONSTRAINT chk_stock_positive CHECK (stock_quantity >= 0),
    CONSTRAINT chk_rating_range CHECK (rating >= 0 AND rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cart Table
CREATE TABLE carts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_session (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cart Items Table
CREATE TABLE cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    size VARCHAR(20),
    color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_cart (cart_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders Table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    billing_address TEXT NOT NULL,
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Order Items Table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    size VARCHAR(20),
    color VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Addresses Table
CREATE TABLE addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('shipping', 'billing') NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_default TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Categories (FIXED - removed explicit IDs from VALUES)
INSERT INTO categories (name, slug, description, image, parent_id, is_active) VALUES
('Men', 'men', 'Stylish clothing for men', 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=300', NULL, 1),
('Women', 'women', 'Fashionable clothing for women', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300', NULL, 1),
('Shoes', 'shoes', 'Step up your style', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300', NULL, 1),
('Accessories', 'accessories', 'Complete your look', 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=300', NULL, 1),
('Bags', 'bags', 'Carry in style', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300', NULL, 1),
('Kids', 'kids', 'Adorable outfits for children', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=300', NULL, 1);

-- Insert Products
INSERT INTO products (name, slug, sku, description, price, sale_price, category_id, brand, sizes, colors, stock_quantity, images, is_featured, is_new_arrival, black_friday_deal, black_friday_discount, rating, rating_count) VALUES
-- MEN'S SECTION
('Classic White T-Shirt', 'classic-white-tshirt', 'TSH-001', 'Premium cotton crew neck t-shirt with a comfortable fit', 29.99, NULL, 1, 'BasicWear', '["S", "M", "L", "XL", "XXL"]', '["White", "Black", "Gray"]', 150, '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"]', 1, 0, 0, 0, 4.5, 128),
('Graphic Print Tee', 'graphic-print-tee', 'TSH-002', 'Trendy graphic t-shirt with bold designs', 34.99, 24.99, 1, 'UrbanStyle', '["S", "M", "L", "XL"]', '["Black", "Navy", "Red"]', 200, '["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500"]', 0, 1, 1, 30, 4.3, 95),
('V-Neck Premium Tee', 'vneck-premium-tee', 'TSH-003', 'Soft v-neck t-shirt perfect for any occasion', 39.99, NULL, 1, 'Premium Co', '["M", "L", "XL"]', '["White", "Blue", "Green"]', 100, '["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500"]', 0, 0, 0, 0, 4.6, 203),
('Formal White Shirt', 'formal-white-shirt', 'SHT-001', 'Classic formal shirt for business and events', 59.99, 44.99, 1, 'Executive', '["S", "M", "L", "XL", "XXL"]', '["White", "Light Blue"]', 120, '["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500"]', 1, 0, 1, 25, 4.7, 156),
('Casual Denim Shirt', 'casual-denim-shirt', 'SHT-002', 'Comfortable denim shirt for casual wear', 49.99, NULL, 1, 'DenimHouse', '["M", "L", "XL"]', '["Blue", "Black"]', 90, '["https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500"]', 0, 1, 0, 0, 4.4, 87),
('Checked Flannel Shirt', 'checked-flannel-shirt', 'SHT-003', 'Warm flannel shirt with classic check pattern', 54.99, NULL, 1, 'Outdoor', '["S", "M", "L", "XL"]', '["Red", "Blue", "Green"]', 75, '["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500"]', 0, 0, 0, 0, 4.2, 64),
('Slim Fit Jeans', 'slim-fit-jeans', 'PNT-001', 'Modern slim fit denim jeans', 79.99, 59.99, 1, 'DenimKing', '["28", "30", "32", "34", "36"]', '["Blue", "Black"]', 180, '["https://images.unsplash.com/photo-1542272454315-7f6d6b2f7d0c?w=500"]', 1, 0, 1, 25, 4.8, 245),
('Chino Pants Beige', 'chino-pants-beige', 'PNT-002', 'Comfortable chino pants for smart casual look', 69.99, NULL, 1, 'SmartWear', '["30", "32", "34", "36"]', '["Beige", "Navy", "Olive"]', 110, '["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500"]', 0, 1, 0, 0, 4.5, 132),
('Athletic Track Pants', 'athletic-track-pants', 'PNT-003', 'Performance track pants for workouts', 49.99, 39.99, 1, 'SportFit', '["S", "M", "L", "XL"]', '["Black", "Gray", "Navy"]', 160, '["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500"]', 0, 0, 1, 20, 4.3, 98),
('Cargo Pants', 'cargo-pants', 'PNT-004', 'Multi-pocket cargo pants for adventure', 64.99, NULL, 1, 'Adventure Co', '["30", "32", "34", "36"]', '["Khaki", "Black", "Olive"]', 85, '["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500"]', 0, 0, 0, 0, 4.1, 56),

-- WOMEN'S SECTION
('Floral Summer Dress', 'floral-summer-dress', 'DRS-001', 'Beautiful floral print dress perfect for summer', 89.99, 69.99, 2, 'FloralFashion', '["XS", "S", "M", "L"]', '["Floral", "Pink", "Blue"]', 95, '["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"]', 1, 1, 1, 22, 4.7, 189),
('Elegant Maxi Dress', 'elegant-maxi-dress', 'DRS-002', 'Long flowing maxi dress for special occasions', 99.99, NULL, 2, 'ElegantWear', '["S", "M", "L", "XL"]', '["Black", "Burgundy", "Navy"]', 70, '["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500"]', 1, 0, 0, 0, 4.6, 145),
('Casual T-Shirt Dress', 'casual-tshirt-dress', 'DRS-003', 'Comfortable t-shirt style dress', 44.99, 34.99, 2, 'CasualChic', '["XS", "S", "M", "L", "XL"]', '["White", "Gray", "Black"]', 130, '["https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=500"]', 0, 1, 1, 23, 4.4, 167),
('Silk Blouse', 'silk-blouse', 'TOP-001', 'Luxurious silk blouse for professional look', 79.99, NULL, 2, 'SilkRoute', '["XS", "S", "M", "L"]', '["Ivory", "Navy", "Black"]', 60, '["https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=500"]', 0, 0, 0, 0, 4.5, 93),
('Striped Tank Top', 'striped-tank-top', 'TOP-002', 'Casual striped tank top for summer', 29.99, 19.99, 2, 'SummerVibes', '["XS", "S", "M", "L"]', '["Striped", "White", "Navy"]', 180, '["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500"]', 0, 0, 1, 33, 4.2, 234),
('Knit Sweater Top', 'knit-sweater-top', 'TOP-003', 'Cozy knit sweater for cooler days', 69.99, 54.99, 2, 'CozyKnits', '["S", "M", "L", "XL"]', '["Cream", "Gray", "Burgundy"]', 75, '["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500"]', 1, 0, 1, 21, 4.6, 178),

-- SHOES SECTION
('Running Sneakers Pro', 'running-sneakers-pro', 'SHO-001', 'Professional running shoes with advanced cushioning', 129.99, 99.99, 3, 'RunPro', '["7", "8", "9", "10", "11"]', '["Black", "White", "Blue"]', 145, '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"]', 1, 0, 1, 23, 4.8, 312),
('Classic Canvas Sneakers', 'classic-canvas-sneakers', 'SHO-002', 'Timeless canvas sneakers for everyday wear', 59.99, 44.99, 3, 'CanvasKing', '["6", "7", "8", "9", "10", "11"]', '["White", "Black", "Red"]', 220, '["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500"]', 0, 1, 1, 25, 4.5, 289),
('Leather Formal Shoes', 'leather-formal-shoes', 'SHO-003', 'Premium leather shoes for formal occasions', 149.99, NULL, 3, 'Executive', '["7", "8", "9", "10", "11", "12"]', '["Black", "Brown"]', 80, '["https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500"]', 1, 0, 0, 0, 4.7, 156),
('High-Top Basketball Shoes', 'hightop-basketball-shoes', 'SHO-004', 'Performance basketball shoes with ankle support', 159.99, 129.99, 3, 'CourtKing', '["7", "8", "9", "10", "11", "12"]', '["Black", "White", "Red"]', 95, '["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"]', 0, 1, 1, 19, 4.6, 198),
('Sandals Summer Comfort', 'sandals-summer-comfort', 'SHO-005', 'Comfortable sandals for beach and casual wear', 39.99, 29.99, 3, 'BeachWalk', '["6", "7", "8", "9", "10"]', '["Brown", "Black", "Tan"]', 160, '["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500"]', 0, 0, 1, 25, 4.3, 145),
('Hiking Boots', 'hiking-boots', 'SHO-006', 'Durable hiking boots for outdoor adventures', 179.99, NULL, 3, 'MountainGear', '["7", "8", "9", "10", "11", "12"]', '["Brown", "Black"]', 65, '["https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500"]', 0, 0, 0, 0, 4.7, 87),

-- ACCESSORIES SECTION
('Leather Belt Classic', 'leather-belt-classic', 'ACC-001', 'Genuine leather belt with metal buckle', 49.99, 39.99, 4, 'LeatherCraft', '["32", "34", "36", "38", "40"]', '["Black", "Brown"]', 200, '["https://images.unsplash.com/photo-1624222247344-550fb60583f2?w=500"]', 0, 0, 1, 20, 4.4, 234),
('Sunglasses Aviator', 'sunglasses-aviator', 'ACC-002', 'Classic aviator sunglasses with UV protection', 89.99, 69.99, 4, 'SunStyle', '["One Size"]', '["Gold", "Silver", "Black"]', 150, '["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"]', 1, 0, 1, 22, 4.6, 345),
('Wool Beanie', 'wool-beanie', 'ACC-003', 'Warm wool beanie for winter', 24.99, 19.99, 4, 'WinterWarm', '["One Size"]', '["Black", "Gray", "Navy", "Red"]', 300, '["https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500"]', 0, 1, 1, 20, 4.3, 456),
('Leather Wallet', 'leather-wallet', 'ACC-004', 'Slim leather wallet with multiple card slots', 59.99, NULL, 4, 'LeatherCraft', '["One Size"]', '["Black", "Brown", "Tan"]', 180, '["https://images.unsplash.com/photo-1627123424574-724758594e93?w=500"]', 1, 0, 0, 0, 4.7, 289),
('Watch Chronograph', 'watch-chronograph', 'ACC-005', 'Stylish chronograph watch with leather strap', 199.99, 159.99, 4, 'TimeKeeper', '["One Size"]', '["Black", "Brown", "Silver"]', 75, '["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500"]', 1, 1, 1, 20, 4.8, 178),
('Baseball Cap', 'baseball-cap', 'ACC-006', 'Classic baseball cap with adjustable strap', 29.99, 24.99, 4, 'CapStyle', '["One Size"]', '["Black", "Navy", "White", "Red"]', 250, '["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500"]', 0, 0, 1, 17, 4.2, 567),

-- BAGS SECTION
('Leather Backpack', 'leather-backpack', 'BAG-001', 'Premium leather backpack for work and travel', 149.99, 119.99, 5, 'TravelPro', '["One Size"]', '["Brown", "Black"]', 90, '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"]', 1, 0, 1, 20, 4.7, 234),
('Laptop Messenger Bag', 'laptop-messenger-bag', 'BAG-002', 'Padded messenger bag for laptop and documents', 79.99, 59.99, 5, 'TechCarry', '["One Size"]', '["Black", "Gray", "Navy"]', 120, '["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"]', 0, 1, 1, 25, 4.5, 189),
('Canvas Tote Bag', 'canvas-tote-bag', 'BAG-003', 'Eco-friendly canvas tote bag', 34.99, 24.99, 5, 'EcoCarry', '["One Size"]', '["Natural", "Black", "Navy"]', 200, '["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500"]', 0, 0, 1, 29, 4.3, 456),
('Gym Duffel Bag', 'gym-duffel-bag', 'BAG-004', 'Spacious duffel bag for gym and sports', 64.99, 49.99, 5, 'SportFit', '["Medium", "Large"]', '["Black", "Gray", "Red"]', 110, '["https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500"]', 0, 0, 1, 23, 4.4, 234),
('Crossbody Handbag', 'crossbody-handbag', 'BAG-005', 'Stylish crossbody bag for everyday use', 89.99, NULL, 5, 'StyleBag', '["One Size"]', '["Black", "Brown", "Beige"]', 85, '["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"]', 1, 1, 0, 0, 4.6, 345),

-- KIDS SECTION
('Kids Graphic Tee', 'kids-graphic-tee', 'KID-001', 'Fun graphic t-shirt for kids', 24.99, 19.99, 6, 'KidStyle', '["4", "6", "8", "10", "12"]', '["Blue", "Red", "Yellow"]', 200, '["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500"]', 0, 1, 1, 20, 4.5, 234),
('Kids Denim Jacket', 'kids-denim-jacket', 'KID-002', 'Classic denim jacket for children', 49.99, 39.99, 6, 'DenimKids', '["4", "6", "8", "10", "12"]', '["Blue", "Black"]', 100, '["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500"]', 0, 0, 1, 20, 4.4, 156),
('Kids Sneakers', 'kids-sneakers', 'KID-003', 'Comfortable sneakers for active kids', 59.99, 44.99, 6, 'KidRun', '["1", "2", "3", "4", "5"]', '["Pink", "Blue", "Black"]', 150, '["https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500"]', 1, 1, 1, 25, 4.6, 289),
('Kids Backpack', 'kids-backpack', 'KID-004', 'Colorful backpack for school', 39.99, 29.99, 6, 'SchoolPro', '["One Size"]', '["Blue", "Pink", "Green"]', 180, '["https://images.unsplash.com/photo-1577803645773-f96470509666?w=500"]', 0, 0, 1, 25, 4.3, 345),
('Kids Hoodie', 'kids-hoodie', 'KID-005', 'Warm hoodie for kids', 44.99, 34.99, 6, 'CozyKids', '["4", "6", "8", "10", "12"]', '["Gray", "Black", "Navy"]', 120, '["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500"]', 0, 1, 1, 22, 4.5, 178),

-- ADDITIONAL PRODUCTS
('Premium Polo Shirt', 'premium-polo-shirt', 'POL-001', 'Classic polo shirt with collar', 54.99, 44.99, 1, 'PoloClub', '["S", "M", "L", "XL", "XXL"]', '["White", "Navy", "Black", "Red"]', 140, '["https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500"]', 0, 0, 1, 19, 4.4, 167),
('Bomber Jacket', 'bomber-jacket', 'JKT-001', 'Trendy bomber jacket for style', 129.99, 99.99, 1, 'StreetWear', '["S", "M", "L", "XL"]', '["Black", "Navy", "Olive"]', 70, '["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500"]', 1, 1, 1, 23, 4.7, 145),
('Yoga Pants', 'yoga-pants', 'YGA-001', 'Stretchy yoga pants for fitness', 49.99, 39.99, 2, 'YogaFit', '["XS", "S", "M", "L", "XL"]', '["Black", "Gray", "Purple"]', 190, '["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500"]', 0, 1, 1, 20, 4.6, 289),
('Sports Bra', 'sports-bra', 'BRA-001', 'Supportive sports bra for workouts', 39.99, 29.99, 2, 'SportFit', '["XS", "S", "M", "L", "XL"]', '["Black", "Pink", "Blue"]', 220, '["https://images.unsplash.com/photo-1580089595942-371c13eced9e?w=500"]', 0, 0, 1, 25, 4.5, 456),
('Winter Scarf', 'winter-scarf', 'SCR-001', 'Warm knitted scarf for winter', 34.99, 24.99, 4, 'WinterWarm', '["One Size"]', '["Red", "Black", "Gray", "Navy"]', 250, '["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500"]', 0, 0, 1, 29, 4.2, 345);