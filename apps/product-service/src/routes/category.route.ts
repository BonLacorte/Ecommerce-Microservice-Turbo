import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from "../controllers/category.controller";
import { shouldBeAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.get("/test", (req, res) => {
    res.json({message: "Products test endpoint works"});
});

// shouldBeAdmin

router.post("/", shouldBeAdmin, createCategory);
router.get("/", getCategories);
router.put("/:id", shouldBeAdmin, updateCategory);
router.delete("/:id", shouldBeAdmin, deleteCategory);



export default router;
