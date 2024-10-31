import express from "express";
import {
  addToCart,
  decreQt,
  deleteFromCart,
  getCart,
  increQt,
} from "../controllers/cart.controller.js";
import { protect } from "../middlewares/checkAuth.js";
const router = express.Router();

router.use(protect);
router.get("/", getCart);
router.post("/", addToCart);
router.patch("/:id/increment", increQt);
router.patch("/:id/decrement", decreQt);
router.delete("/:id", deleteFromCart);

export default router;
