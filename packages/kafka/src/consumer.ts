import type { Kafka, Consumer } from "kafkajs";

export const createConsumer = (kafka: Kafka, groupId: string) => {
    const consumer: Consumer = kafka.consumer({ groupId });

    const connect = async () => {
        await consumer.connect();
        console.log("Kafka consumer connected:" + groupId);
    };

    const subscribe = async (
        // topics: {
        // topicName: string;
        // topicHandler: (message: any) => Promise<void>;
        // }[]
        topic: string,
        handler: (message: any) => Promise<void>
    ) => {
        // await consumer.subscribe({
        // topics: [topic],
        // fromBeginning: true,
        // });

        await consumer.subscribe({
            topic: topic,
            fromBeginning: true,
        });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    // const topicConfig = topics.find((t) => t.topicName === topic);
                    // if (topicConfig) {
                    //     const value = message.value?.toString();

                    //     if (value) {
                    //     await topicConfig.topicHandler(JSON.parse(value));
                    //     }
                    // }

                    const value = message.value?.toString();
                    
                    if (value) {
                        await handler(JSON.parse(value));
                    }
                } catch (error) {
                console.log("Error processing message", error);
                }
            },
        });
    };

    const disconnect = async () => {
        await consumer.disconnect();
    };

    return { connect, subscribe, disconnect };
};
