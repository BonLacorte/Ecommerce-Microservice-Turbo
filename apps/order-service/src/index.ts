import Fastify from "fastify";

const fastify = Fastify();

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