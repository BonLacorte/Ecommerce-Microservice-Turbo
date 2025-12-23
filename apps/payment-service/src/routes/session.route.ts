import { Hono } from 'hono';
import stripe from "../utils/stripe";
import { shouldBeUser } from '../middleware/authMiddleware';
import { CartItemType } from '@repo/types';
import { getStripeProductPrice } from '../utils/stripeProducts';

const sessionRoute = new Hono();

sessionRoute.post('/create-checkout-session', shouldBeUser, async (c) => {
  
  const { cart }: { cart: CartItemType[] } = await c.req.json();
  const userId = c.get('userId');

  const lineItems = await Promise.all(
    cart.map(async (item) => {
      const unitAmount = await getStripeProductPrice(item.id);

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: unitAmount as number,
        },
        quantity: item.quantity,
      };
    })
  )

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      client_reference_id: userId,
      mode: 'payment',
      ui_mode: 'custom',
      // The URL of your payment completion page
      return_url: 'http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}'
    });

    console.log("testing");

    console.log("session:", session);

    // console.log("session: ", session);

    return c.json({checkoutSessionClientSecret: session.client_secret});
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

  // console.log(session);

  return c.json({
    status: session.status,
    paymentStatus: session.payment_status,
  });
});

export default sessionRoute;
