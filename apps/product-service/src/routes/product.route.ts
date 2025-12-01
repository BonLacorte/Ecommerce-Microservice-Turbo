import { Router } from "express";
import {
    getProduct,
    getProducts,
} from "../controllers/product.controller";
// import { shouldBeAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.get("/test", (req, res) => {
    res.json({message: "Products test endpoint works"});
});
router.get("/", getProducts);
router.get("/:id", getProduct);

export default router;
