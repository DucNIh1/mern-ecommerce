import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import { authorizeRoles } from "../middlewares/checkRole.js";
import { protect } from "../middlewares/checkAuth.js";

const router = express.Router();

router
  .route("/")
  .post(protect, authorizeRoles("admin"), createCategory)
  .get(getAllCategories);
router
  .route("/:id")
  .delete(protect, authorizeRoles("admin"), deleteCategory)
  .put(protect, authorizeRoles("admin"), updateCategory);
export default router;
