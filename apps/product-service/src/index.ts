import express, { Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { shouldBeUser } from "../middleware/authMiddleware.js";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:3002", "http://localhost:3003"],
        credentials: true,
    })
)

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

app.get("/test", shouldBeUser, (req: Request, res: Response) => {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (!userId) {
        return res.status(401).json({ message: "Product service is not authenticated" });
    }
    
    res.json({message: "Product service is authenticated", userId: userId});
})

app.listen(8000, () => {
    console.log("Product service is running on port 8000");
});