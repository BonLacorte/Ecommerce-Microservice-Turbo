import { Router } from "express";
import {
    createCategory,
    getCategories,
} from "../controllers/category.controller";
// import { shouldBeAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.get("/test", (req, res) => {
    res.json({message: "Products test endpoint works"});
});

// shouldBeAdmin

router.post("/", createCategory);
router.get("/", getCategories);

export default router;
