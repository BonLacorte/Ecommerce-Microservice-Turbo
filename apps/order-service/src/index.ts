import Fastify from "fastify";

const fastify = Fastify();

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