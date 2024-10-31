import express from "express";

import { protect } from "../middlewares/checkAuth.js";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getAllOrders,
  getMyOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authorizeRoles } from "../middlewares/checkRole.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.patch("/:id/cancel", protect, cancelOrder); // Hủy đơn hàng
router.get("/my-orders", protect, getMyOrder);

router.get("/", protect, authorizeRoles("user", "admin"), getAllOrders);

router.delete("/:id", protect, authorizeRoles("admin"), deleteOrder);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("user", "admin"),
  updateOrderStatus
); // Cập nhật trạng thái đơn hàng
export default router;
