import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { serve } from '@hono/node-server'
import { timeStamp } from 'console'
import { Hono } from 'hono'
import { uptime } from 'process'
import { shouldBeUser } from "./middleware/authMiddleware.js";

const app = new Hono()
app.use('/test', clerkMiddleware())

app.get('/', (c) => {
  return c.text('Payment service works!')
})

app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    uptime: process.uptime(),
    timeStamp: Date.now(),
    message: 'Payment service is running'
  })
})

app.get('/test', shouldBeUser, (c) => {
  return c.json({message: "Payment service is authenticated", userId: c.get('userId')})
})

const start = async () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: 8002
      },
      (info) => {
        console.log(`Payment service is running on port 8002`)
      }
    )
  } catch (error) {
    console.error("Error starting payment service:", error);
    process.exit(1);
  }
}
start()