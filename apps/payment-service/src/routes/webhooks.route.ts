import { Hono } from "hono"
import Stripe from "stripe"
import stripe from "../utils/stripe"

const webhooksecret = process.env.STRIPE_WEBHOOK_SECRET as string
const webhookRoute = new Hono()

webhookRoute.post("/stripe", async (c) => {
    const body = await c.req.text()
    const sig = c.req.header("stripe-signature")

    let event: Stripe.Event
    
    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig!,
            webhooksecret
        )
    } catch (error) {
        console.log("Webhook verification failed!");
        return c.json({error: "Webhook verification failed!"}, 400);
    }

    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object as Stripe.Checkout.Session
            console.log("session:", session);

            const lineItems = await stripe.checkout.sessions.listLineItems(
                session.id,
                {
                    expand: ["data.price.product"],
                }
            )

            // TODO: CREATE ORDER
            console.log("WEBHOOK RECEIVED:", session);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    }
    return c.json({ received: true });
})

export default webhookRoute