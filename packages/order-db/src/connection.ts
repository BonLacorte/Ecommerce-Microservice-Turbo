import mongoose from "mongoose";

let isConnected = false;

export const connectOrderDB = async () => {
    if (isConnected) {
        return;
    }
    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL is not defined");
    }
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        isConnected = true;
        console.log("Order DB connected");
    } catch (error) {
        console.log(error);
        throw error;
    }
}