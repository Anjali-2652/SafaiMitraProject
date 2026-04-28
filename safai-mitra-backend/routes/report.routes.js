import express from "express";
import {
  createReport,
  getMyReports,
  getAllReports,
  getSingleReport,
} from "../controllers/report.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// 📌 Create report (USER)
router.post("/", authMiddleware, upload.single("image"), createReport);

// 📌 Get my reports (USER)
router.get("/my", authMiddleware, getMyReports);

router.get("/:id", authMiddleware, getSingleReport);


// 📌 Get all reports (ADMIN only)
router.get("/all", authMiddleware, roleMiddleware("admin"), getAllReports);


export default router;
