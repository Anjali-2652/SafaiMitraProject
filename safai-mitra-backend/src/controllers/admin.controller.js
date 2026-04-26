import Report from "../models/report.model.js";
import User from "../models/user.model.js";


// GET ALL REPORTS (ADMIN DASHBOARD)
export const adminGetAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("user", "full_name phone")
      .populate("assignedTo", "full_name role");

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


    // report.assignedTo = employeeId;
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

    res.json({
      totalUsers,
      totalReports,
      pending,
      progress,
      cleaned,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};