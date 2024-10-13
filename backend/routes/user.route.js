import express from "express";
import {
  getMe,
  login,
  logout,
  signup,
  updateMe,
} from "../controllers/auth.controller.js";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/checkAuth.js";
import { authorizeRoles } from "../middlewares/checkRole.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.use(protect);
router.put("/update-me", updateMe);
router.get("/get-me", getMe);
router.post("/logout", logout);

// Admin
router.use(authorizeRoles("admin"));
router.route("/").get(getAllUsers);
router.route("/:id").delete(deleteUser).get(getUserById).put(updateUserById);

export default router;
