import { prisma } from "./packages/product-db/src/client";

async function main() {
  console.log("Seeding new products...");

  // Ensure categories exist
  const categories = [
    { name: "Accessories", slug: "accessories" },
    { name: "Electronics", slug: "electronics" },
    { name: "Footwear", slug: "footwear" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const products = [
    {
      name: "Premium Leather Messenger Bag",
      shortDescription: "Handcrafted dark tan leather bag for professionals.",
      description: "Our Premium Leather Messenger Bag is crafted from high-quality full-grain leather. It features a spacious main compartment, dedicated laptop sleeve, and multiple pockets for organization. The rich tan color develops a beautiful patina over time.",
      price: 189,
      sizes: ["one-size"],
      colors: ["tan"],
      images: { tan: "/products/leather-bag.png" },
      categorySlug: "accessories",
    },
    {
      name: "Modern Titanium Smartwatch",
      shortDescription: "Sleek titanium finish with health tracking features.",
      description: "Stay connected and track your fitness with the Modern Titanium Smartwatch. Featuring a durable titanium case and a comfortable emerald green silicone strap, this watch combines style with high-tech functionality. Water-resistant up to 50 meters.",
      price: 299,
      sizes: ["one-size"],
      colors: ["black"],
      images: { black: "/products/smartwatch.png" },
      categorySlug: "electronics",
    },
    {
      name: "Minimalist White Sneakers",
      shortDescription: "Clean white premium leather sneakers with silver accents.",
      description: "Our Minimalist White Sneakers are the epitome of versatile footwear. Made from supple premium leather with subtle silver detailing, these sneakers offer both comfort and a sharp, clean look that pairs perfectly with any outfit.",
      price: 129,
      sizes: ["40", "41", "42", "43", "44"],
      colors: ["white"],
      images: { white: "/products/sneakers.png" },
      categorySlug: "footwear",
    },
    {
      name: "Designer Aviator Sunglasses",
      shortDescription: "Classic gold frames with polarized dark lenses.",
      description: "Protect your eyes in style with our Designer Aviator Sunglasses. These glasses feature high-quality gold frames and polarized lenses for superior glare reduction and UV protection. A timeless design for the modern individual.",
      price: 159,
      sizes: ["one-size"],
      colors: ["gold"],
      images: { gold: "/products/sunglasses.png" },
      categorySlug: "accessories",
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: p,
    });
    console.log(`Created product: ${p.name}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
