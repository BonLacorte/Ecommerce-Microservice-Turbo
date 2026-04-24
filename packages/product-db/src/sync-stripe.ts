import { prisma } from "@repo/product-db";
import Stripe from "stripe";
import dotenv from "dotenv";
import path from "path";

// Load env from payment-service
dotenv.config({ path: path.resolve(__dirname, "../../apps/payment-service/.env") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
});

async function syncProducts() {
  console.log("Starting product sync to Stripe...");
  
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products in database.`);

  for (const product of products) {
    try {
      // Check if product exists in Stripe
      try {
        await stripe.products.retrieve(product.id.toString());
        console.log(`Product ${product.name} (ID: ${product.id}) already exists in Stripe. Skipping.`);
        continue;
      } catch (e) {
        // Product doesn't exist, proceed to create
      }

      console.log(`Creating product ${product.name} (ID: ${product.id}) in Stripe...`);
      await stripe.products.create({
        id: product.id.toString(),
        name: product.name,
        default_price_data: {
          currency: "usd",
          unit_amount: product.price * 100,
        },
      });
      console.log(`Successfully synced ${product.name}`);
    } catch (error: any) {
      console.error(`Failed to sync product ${product.id}:`, error.message);
    }
  }

  console.log("Sync complete!");
}

syncProducts().catch(console.error);
