import User from "../models/user.model.js";
import Report from "../models/report.model.js";
import bcrypt from "bcryptjs";
import generateUsername from "../utils/generateUsername.js";

// GET ALL REPORTS (ADMIN DASHBOARD)
export const adminGetAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("user", "full_name phone")
      .populate("assignedTo", "full_name role").sort({ createdAt: -1});
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ASSIGN EMPLOYEE TO REPORT
export const assignEmployee = async (req, res) => {
  try {
    const { reportId, employeeId } = req.body;
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const employee = await User.findById(employeeId);

    if (!employee || employee.role !== "employee") {
      return res.status(400).json({ message: "Invalid employee" });
    }

    report.assignedTo = employeeId;
    report.status = "progress";

    await report.save();

    res.json({ message: "Employee assigned successfully", report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE STATUS (CLEANED / PROGRESS)

export const updateReportStatus = async (req, res) => {
  try {
    const { reportId, status } = req.body;
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    report.status = status;
    await report.save();
    res.json({ message: "Status updated", report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DASHBOARD STATS

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalReports = await Report.countDocuments();
    const pending = await Report.countDocuments({ status: "pending" });
    const progress = await Report.countDocuments({ status: "progress" });
    const cleaned = await Report.countDocuments({ status: "cleaned" });
    res.json({ totalUsers, totalReports, pending, progress, cleaned });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// CREATE EMPLOYEE
export const createEmployee = async (req, res) => {
  try {
    const { full_name, phone, address, password } = req.body;

    const existing = await User.findOne({ phone });

    if (existing) {
      return res.status(400).json({ message: "Phone already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const username = await generateUsername(full_name);

    const employee = await User.create({
      full_name,
      username,
      phone,
      address,
      password: hashedPassword,
      role: "employee",
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL EMPLOYEES
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");

    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE REPORT DETAILS (ADMIN)
export const getSingleAdminReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("user", "full_name phone address")
      .populate("assignedTo", "full_name phone role");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};