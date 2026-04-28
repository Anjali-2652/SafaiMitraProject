import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import { getWardAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

// 📊 Ward analytics (ADMIN only)
router.get(
  "/wards",
  authMiddleware,
  roleMiddleware("admin"),
  getWardAnalytics
);

export default router;