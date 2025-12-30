import express, { Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
// import { shouldBeUser } from "./middleware/authMiddleware";
import productRouter from "./routes/product.route";
import categoryRouter from "./routes/category.route";
import { consumer, producer } from "./utils/kafka.js";


const app = express();

app.use(
    cors({
        origin: ["http://localhost:3002", "http://localhost:3003"],
        credentials: true,
    })
)

app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req: Request, res: Response) => {
    res.send("Products endpoint works");
});

app.get("/health", (req: Request, res: Response) => {
    res.json({
        status: "healthy",
        uptime: process.uptime(),
        timeStamp: Date.now(),
        message: "Products service is running",
    });
});

app.get("/test", (req: Request, res: Response) => {
    // const auth = getAuth(req);
    // const userId = auth.userId;

    // if (!userId) {
    //     return res.status(401).json({ message: "Product service is not authenticated" });
    // }
    
    // res.json({message: "Product service is authenticated", userId: userId});
    // res.json({message: "Product service is authenticated", userId: req.userId});
    res.json({message: "Product service is authenticated"});
})

app.use("/products", productRouter);
app.use("/categories", categoryRouter);

const start = async () => {
    try {
        Promise.all([await producer.connect(), await consumer.connect()]);
        app.listen(8000, () => {
            console.log("Product service is running on 8000");
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

start()