import { StripeProductType } from "@repo/types";
import stripe from "./stripe";

export const createStripeProduct = async (item: StripeProductType) => {
  try {
    console.log(`Calling Stripe to create product: ${item.name} (${item.id})`);
    const res = await stripe.products.create({
      id: item.id.toString(),
      name: item.name,
      default_price_data: {
        currency: "usd",
        unit_amount: item.price * 100,
      },
    });
    console.log(`Stripe API Success: Created product ${res.id}`);
    return res;
  } catch (error: any) {
    console.error(`Stripe API Error for ${item.name}:`, error.message);
    return error;
  }
};

export const getStripeProductPrice = async (productId: number) => {
  try {
    const res = await stripe.prices.list({
      product: productId.toString(),
      active: true,
    });
    
    if (res.data.length > 0) {
      return res.data[0].unit_amount;
    }
    
    // If no price found, check if product exists
    try {
      await stripe.products.retrieve(productId.toString());
      return "PRODUCT_EXISTS_NO_PRICE";
    } catch (e) {
      return "PRODUCT_NOT_FOUND";
    }
  } catch (error) {
    console.log("Error in getStripeProductPrice:", error);
    return null;
  }
};

export const deleteStripeProduct = async (productId: number) => {
  try {
    const res = await stripe.products.del(productId.toString());
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
