import express from "express";
import {
  adminGetAllReports,
  assignEmployee,
  updateReportStatus,
  getDashboardStats,
  createEmployee,
  getAllEmployees,
  getSingleAdminReport,
} from "../controllers/admin.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// 📊 Dashboard
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  getDashboardStats,
);

// 📄 Reports
router.get(
  "/reports",
  authMiddleware,
  roleMiddleware("admin"),
  adminGetAllReports,
);

//get single report
router.get(
  "/reports/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getSingleAdminReport
);

// 👷 Assign employee
router.post(
  "/assign-employee",
  authMiddleware,
  roleMiddleware("admin"),
  assignEmployee,
);

// 🔄 Update report status
router.patch(
  "/report-status",
  authMiddleware,
  roleMiddleware("admin"),
  updateReportStatus,
);

// 👷 Create employee
router.post(
  "/create-employee",
  authMiddleware,
  roleMiddleware("admin"),
  createEmployee,
);

// 👷 Get employees
router.get(
  "/employees",
  authMiddleware,
  roleMiddleware("admin"),
  getAllEmployees,
);

export default router;
