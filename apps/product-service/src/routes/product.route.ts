import { Router } from "express";
import {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller";
import { shouldBeAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.get("/test", (req, res) => {
    res.json({message: "Products test endpoint works"});
});
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", shouldBeAdmin, createProduct);
router.post("/sync", shouldBeAdmin, async (req, res) => {
    console.log("Sync request received in product-service");
    const { prisma } = await import("@repo/product-db");
    const { producer } = await import("../utils/kafka");
    
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products. Syncing to Kafka...`);
    for (const product of products) {
        console.log(`Syncing product: ${product.name} (${product.id})`);
        await producer.send("product.created", {
            value: {
                id: product.id.toString(),
                name: product.name,
                price: product.price,
            },
        });
    }
    console.log("Sync messages sent to Kafka");
    res.json({ message: `Syncing ${products.length} products to Stripe...` });
});
router.put("/:id", shouldBeAdmin, updateProduct);
router.delete("/:id", shouldBeAdmin, deleteProduct);

export default router;
