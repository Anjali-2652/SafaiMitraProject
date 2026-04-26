import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  getProfile,
  getMyReports,
} from "../controllers/user.controller.js";

const router = express.Router();

// 👤 user dashboard profile
router.get(
  "/profile",
  authMiddleware,
  // roleMiddleware("user", "admin", "employee"),
  getProfile
);

// 👤 user reports
// router.get(
//   "/reports",
//   authMiddleware,
//   roleMiddleware("user"),
//   getMyReports
// );

export default router;