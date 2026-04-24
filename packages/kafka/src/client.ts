import { Kafka } from "kafkajs";

export const createKafkaClient = (service: string) => {
    return new Kafka({
        clientId: service,
        brokers: ["localhost:9094", "localhost:9095", "localhost:9096"],
        connectionTimeout: 120000,
        requestTimeout: 120000,
        retry: {
            initialRetryTime: 1000,
            retries: 10,
        },
    });
};
