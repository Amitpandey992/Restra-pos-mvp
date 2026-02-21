import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import * as recipeController from "../controllers/recipe.controller";

const router = Router();

router.use(authenticate);

router.post("/", recipeController.createRecipe);
router.get("/", recipeController.getRecipes);
router.get("/:id", recipeController.getRecipe);
router.put("/:id", recipeController.updateRecipe);
router.delete("/:id", recipeController.deleteRecipe);

export default router;
