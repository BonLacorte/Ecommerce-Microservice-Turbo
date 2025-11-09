import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:3002", "http://localhost:3003"],
        credentials: true,
    })
)

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



app.listen(8000, () => {
    console.log("Product service is running on port 8000");
});