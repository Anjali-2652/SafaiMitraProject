import express from "express";
import {
  adminGetAllReports,
  assignEmployee,
  updateReportStatus,
  getDashboardStats,
} from "../controllers/admin.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// only admin access
router.get("/dashboard", authMiddleware, roleMiddleware("admin"), getDashboardStats);


router.get(
  "/reports",
  authMiddleware,
  roleMiddleware("admin"),
  adminGetAllReports
);

router.post(
  "/assign-employee",
  authMiddleware,
  roleMiddleware("admin"),
  assignEmployee
);

// update report status ... 
router.patch(
  "/report-status",
  authMiddleware,
  roleMiddleware("admin"),
  updateReportStatus
);



export default router;