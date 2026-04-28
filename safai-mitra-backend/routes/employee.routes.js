import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

import {
  getAssignedReports,
  updateStatus,
} from "../controllers/employee.controller.js";

const router = express.Router();

// 👷 Get assigned reports
router.get(
  "/reports",
  authMiddleware,
  roleMiddleware("employee"),
  getAssignedReports
);

// 👷 Update report status (cleaned/progress)
router.patch(
  "/reports/:id",
  authMiddleware,
  roleMiddleware("employee"),
  updateStatus
);

export default router;