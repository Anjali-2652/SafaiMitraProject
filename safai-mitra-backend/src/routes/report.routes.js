import express from "express";
import {
  createReport,
  getMyReports,
  getAllReports,
} from "../controllers/report.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// create report (with image upload)
router.post("/", authMiddleware, upload.single("image"), createReport);

// user reports
router.get("/my", authMiddleware, getMyReports);

// admin/all reports
router.get("/all", authMiddleware, roleMiddleware("admin"), getAllReports);

export default router;