import Fastify from "fastify";
import { clerkPlugin, getAuth } from '@clerk/fastify'
import { shouldBeUser } from "./middleware/authMiddleware.js";

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

const start = async () => {
    try {
        await fastify.listen({ port: 8001 })
        console.log("Order service on port 8001")
    } catch (error) {
        console.error("Error starting order service:", error);
        fastify.log.error(error);
        process.exit(1);
    }
}
start()