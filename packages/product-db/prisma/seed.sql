INSERT INTO "Category" (name, slug) VALUES ('Clothing', 'clothing'), ('Electronics', 'electronics'), ('Accessories', 'accessories') ON CONFLICT (slug) DO NOTHING;

INSERT INTO "Product" (name, "shortDescription", description, price, sizes, colors, images, "categorySlug", "createdAt", "updatedAt") VALUES
(
  'Premium Cotton T-Shirt',
  'Soft and breathable premium cotton t-shirt.',
  'Our Premium Cotton T-Shirt is made from 100% organic cotton, providing unmatched comfort and durability. Perfect for everyday wear, it features a classic fit and a variety of colors to choose from.',
  25,
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['White', 'Black', 'Navy'],
  '{"White": "/products/seed-set.png", "Black": "/products/seed-set.png", "Navy": "/products/seed-set.png"}'::json,
  'clothing',
  NOW(),
  NOW()
),
(
  'Modern Urban Hoodie',
  'Stylish hoodie for the modern urban explorer.',
  'Stay warm and look sharp with our Modern Urban Hoodie. Featuring a sleek design and high-quality fabric, this hoodie is designed for both style and comfort.',
  55,
  ARRAY['M', 'L', 'XL'],
  ARRAY['Gray', 'Black'],
  '{"Gray": "/products/seed-set.png", "Black": "/products/seed-set.png"}'::json,
  'clothing',
  NOW(),
  NOW()
),
(
  'High-Performance Sneakers',
  'Durable and comfortable sneakers for active lifestyles.',
  'Experience ultimate comfort with our High-Performance Sneakers. Built with advanced cushioning technology and breathable mesh, these sneakers are perfect for running, training, or casual outings.',
  85,
  ARRAY['40', '41', '42', '43', '44'],
  ARRAY['Blue', 'Red', 'White'],
  '{"Blue": "/products/seed-set.png", "Red": "/products/seed-set.png", "White": "/products/seed-set.png"}'::json,
  'clothing',
  NOW(),
  NOW()
),
(
  'Wireless Noise-Canceling Headphones',
  'Immersive sound with advanced noise cancellation.',
  'Escape into your music with our Wireless Noise-Canceling Headphones. Featuring high-fidelity audio and powerful noise cancellation. With up to 30 hours of battery life.',
  150,
  ARRAY['One Size'],
  ARRAY['Black', 'Silver'],
  '{"Black": "/products/seed-set.png", "Silver": "/products/seed-set.png"}'::json,
  'electronics',
  NOW(),
  NOW()
),
(
  'Leather Minimalist Wallet',
  'Sleek and durable genuine leather wallet.',
  'Our Leather Minimalist Wallet is designed for those who prefer a slim and efficient way to carry their essentials. Made from genuine top-grain leather with RFID blocking technology.',
  35,
  ARRAY['One Size'],
  ARRAY['Tan', 'Brown', 'Black'],
  '{"Tan": "/products/seed-set.png", "Brown": "/products/seed-set.png", "Black": "/products/seed-set.png"}'::json,
  'accessories',
  NOW(),
  NOW()
),
(
  'Classic Denim Jacket',
  'Timeless denim jacket with a modern cut.',
  'A wardrobe staple, our Classic Denim Jacket features a modern slim cut and high-quality denim. Versatile enough for any occasion, it pairs perfectly with casual and smart-casual outfits.',
  79,
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Blue', 'Black'],
  '{"Blue": "/products/seed-set.png", "Black": "/products/seed-set.png"}'::json,
  'clothing',
  NOW(),
  NOW()
);
