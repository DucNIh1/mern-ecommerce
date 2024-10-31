import express from "express";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  refresh,
  resetPassword,
  signup,
  updateMe,
  verificationEmail,
} from "../controllers/auth.controller.js";
import {
  addToWishList,
  deleteFromWishList,
  deleteUser,
  getAllUsers,
  getMyWishList,
  getUserById,
  updateUserById,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/checkAuth.js";
import { authorizeRoles } from "../middlewares/checkRole.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verificationEmail);
router.post("/login", login);
router.get("/refresh", refresh);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.use(protect);
router.post("/add-to-wishlist", addToWishList);
router.delete("/delete-from-wishlist", deleteFromWishList);
router.get("/wish-list", getMyWishList);
router.put("/update-me", updateMe);
router.get("/get-me", getMe);
router.post("/logout", logout);

// Admin
router.use(authorizeRoles("admin"));
router.route("/").get(getAllUsers);
router.route("/:id").delete(deleteUser).get(getUserById).put(updateUserById);

export default router;
