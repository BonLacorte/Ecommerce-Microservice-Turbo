import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Categories
  const clothing = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: {},
    create: {
      name: "Clothing",
      slug: "clothing",
    },
  });

  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
    },
  });

  const accessories = await prisma.category.upsert({
    where: { slug: "accessories" },
    update: {},
    create: {
      name: "Accessories",
      slug: "accessories",
    },
  });

  console.log("Categories created.");

  // Create Products
  const products = [
    {
      name: "Premium Cotton T-Shirt",
      shortDescription: "Soft and breathable premium cotton t-shirt.",
      description: "Our Premium Cotton T-Shirt is made from 100% organic cotton, providing unmatched comfort and durability. Perfect for everyday wear, it features a classic fit and a variety of colors to choose from.",
      price: 25,
      sizes: ["S", "M", "L", "XL"],
      colors: ["White", "Black", "Navy"],
      images: {
        White: "/products/seed-set.png",
        Black: "/products/seed-set.png",
        Navy: "/products/seed-set.png",
      },
      categorySlug: "clothing",
    },
    {
      name: "Modern Urban Hoodie",
      shortDescription: "Stylish hoodie for the modern urban explorer.",
      description: "Stay warm and look sharp with our Modern Urban Hoodie. Featuring a sleek design and high-quality fabric, this hoodie is designed for both style and comfort. It includes a front pouch pocket and an adjustable drawstring hood.",
      price: 55,
      sizes: ["M", "L", "XL"],
      colors: ["Gray", "Black"],
      images: {
        Gray: "/products/seed-set.png",
        Black: "/products/seed-set.png",
      },
      categorySlug: "clothing",
    },
    {
      name: "High-Performance Sneakers",
      shortDescription: "Durable and comfortable sneakers for active lifestyles.",
      description: "Experience ultimate comfort with our High-Performance Sneakers. Built with advanced cushioning technology and breathable mesh, these sneakers are perfect for running, training, or just casual outings. The non-slip sole ensures stability on any surface.",
      price: 85,
      sizes: ["40", "41", "42", "43", "44"],
      colors: ["Blue", "Red", "White"],
      images: {
        Blue: "/products/seed-set.png",
        Red: "/products/seed-set.png",
        White: "/products/seed-set.png",
      },
      categorySlug: "clothing",
    },
    {
      name: "Wireless Noise-Canceling Headphones",
      shortDescription: "Immersive sound with advanced noise cancellation.",
      description: "Escape into your music with our Wireless Noise-Canceling Headphones. Featuring high-fidelity audio and powerful noise cancellation, these headphones provide an immersive listening experience. With up to 30 hours of battery life, you can enjoy your favorite tunes all day long.",
      price: 150,
      sizes: ["One Size"],
      colors: ["Black", "Silver"],
      images: {
        Black: "/products/seed-set.png",
        Silver: "/products/seed-set.png",
      },
      categorySlug: "electronics",
    },
    {
      name: "Leather Minimalist Wallet",
      shortDescription: "Sleek and durable leather wallet.",
      description: "Our Leather Minimalist Wallet is designed for those who prefer a slim and efficient way to carry their essentials. Made from genuine top-grain leather, it features RFID blocking technology to keep your cards safe.",
      price: 35,
      sizes: ["One Size"],
      colors: ["Tan", "Brown", "Black"],
      images: {
        Tan: "/products/seed-set.png",
        Brown: "/products/seed-set.png",
        Black: "/products/seed-set.png",
      },
      categorySlug: "accessories",
    }
  ];

  for (const productData of products) {
    await prisma.product.create({
      data: productData,
    });
  }

  console.log("Products created.");
  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
