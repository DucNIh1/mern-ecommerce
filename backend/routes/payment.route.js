import express from "express";
import {
  callbackOrder,
  checkOrderStatus,
  createOrder,
} from "../controllers/payment.controller.js";
import { protect } from "../middlewares/checkAuth.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);

router.post("/callback-order", callbackOrder);

// router.post("/refund/:zp_trans_id", refund);

router.post("/check-order-status/:app_trans_id", checkOrderStatus);

export default router;
