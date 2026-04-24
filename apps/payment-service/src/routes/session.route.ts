import { Hono } from 'hono';
import stripe from "../utils/stripe";
import { shouldBeUser } from '../middleware/authMiddleware';
import { CartItemType } from '@repo/types';
import { getStripeProductPrice } from '../utils/stripeProduct';

const sessionRoute = new Hono();

sessionRoute.post('/create-checkout-session', shouldBeUser, async (c) => {
  
  const { cart }: { cart: CartItemType[] } = await c.req.json();
  const userId = c.get('userId');

  console.log("Creating checkout session for cart:", cart);

  const lineItems = await Promise.all(
    cart.map(async (item) => {
      let unitAmountResult = await getStripeProductPrice(item.id);
      let unitAmount: number;

      if (typeof unitAmountResult === "number") {
        unitAmount = unitAmountResult;
      } else {
        console.log(`Product ${item.name} (ID: ${item.id}) needs sync. Status: ${unitAmountResult}`);
        
        try {
          if (unitAmountResult === "PRODUCT_NOT_FOUND") {
            await stripe.products.create({
              id: item.id.toString(),
              name: item.name,
              default_price_data: {
                currency: "usd",
                unit_amount: item.price * 100,
              },
            });
          } else {
            // PRODUCT_EXISTS_NO_PRICE
            await stripe.prices.create({
              product: item.id.toString(),
              currency: "usd",
              unit_amount: item.price * 100,
            });
          }
          unitAmount = item.price * 100;
          console.log(`Successfully synced product ${item.name} to Stripe.`);
        } catch (err: any) {
          console.error(`Failed to sync product ${item.name}: ${err.message}`);
          throw err;
        }
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    })
  )

  console.log("Line Items for Stripe:", JSON.stringify(lineItems, null, 2));

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      client_reference_id: userId,
      mode: 'payment',
      ui_mode: 'embedded',
      return_url: 'http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}'
    });

    return c.json({clientSecret: session.client_secret});
  } catch (error) {
    console.log("testing error");
    console.log("error: ", error);
    return c.json({error});
  }
});


sessionRoute.get("/:session_id", async (c) => {
  const { session_id } = c.req.param();
  const session = await stripe.checkout.sessions.retrieve(
    session_id as string,
    {
      expand: ["line_items"],
    }
  );

  console.log(session);

  return c.json({
    status: session.status,
    paymentStatus: session.payment_status,
  });
});

export default sessionRoute;
