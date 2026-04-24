import { consumer } from "./kafka";
import { createOrder } from "./order";

export const runKafkaSubscriptions = async () => {
    console.log("Order service is subscribing to payment.successful...");
    consumer.subscribe([
        {
            topicName: "payment.successful",
            topicHandler: async (message) => {
                console.log("--- KAFKA EVENT RECEIVED: payment.successful ---");
                const order = message.value;
                console.log("Creating order for user:", order.userId);
                await createOrder(order);
                console.log("Order created successfully!");
            },
        },
    ]);
};
