import { Kafka } from "kafkajs";

export const createKafkaClient = (service: string) => {
    const defaultBrokers = ["localhost:9094", "localhost:9095", "localhost:9096"];
    const brokers = process.env.KAFKA_BROKERS
        ? process.env.KAFKA_BROKERS.split(",")
        : defaultBrokers;

    return new Kafka({
        clientId: service,
        brokers,
        connectionTimeout: 120000,
        requestTimeout: 120000,
        retry: {
            initialRetryTime: 1000,
            retries: 10,
        },
    });
};
