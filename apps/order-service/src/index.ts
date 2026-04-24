import Fastify from "fastify";
import { clerkPlugin, getAuth } from '@clerk/fastify'
import { shouldBeUser } from "./middleware/authMiddleware.js";
import { connectOrderDB } from "@repo/order-db";
import { orderRoute } from "./routes/order.js";
import { consumer, producer } from "./utils/kafka.js";
import { runKafkaSubscriptions } from "./utils/subscriptions.js";

const fastify = Fastify();

fastify.register(clerkPlugin)

fastify.get("/", (request, res) => {
    res.send("Orders endpoint works");
});

fastify.get("/health", (request, reply) => {
    return reply.status(200).send({
        status: "healthy",
        uptime: process.uptime(),
        timeStamp: Date.now(),
        message: "Orders service is running",
    });
});

fastify.get("/test", { preHandler: shouldBeUser }, (request, reply) => {
    const { userId } = getAuth(request);
    if (!userId) {
        return reply.send({ message: "Order service is not authenticated" });
    }
    return reply.status(200).send({message: "Order service is authenticated", userId});
})

fastify.register(orderRoute, { prefix: "/api" });

const start = async () => {
    try {
        console.log("Connecting to Order DB...");
        await connectOrderDB();
        console.log("Connecting to Kafka Producer...");
        await producer.connect();
        console.log("Connecting to Kafka Consumer...");
        await consumer.connect();
        
        console.log("Running Kafka Subscriptions...");
        await runKafkaSubscriptions();
        
        console.log("Starting Fastify server...");
        await fastify.listen({ port: 8001, host: '0.0.0.0' });
        console.log("Order service is running on port 8001");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};
start();