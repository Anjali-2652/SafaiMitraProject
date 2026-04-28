import Report from "../models/report.model.js";

// GET ASSIGNED REPORTS
export const getAssignedReports = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const reports = await Report.find({ assignedTo: employeeId })
      .populate("user", "full_name phone address")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE STATUS (progress → cleaned)
export const updateStatus = async (req, res) => {
  try {
    const { reportId, status } = req.body;
    const validStatuses = ["progress", "cleaned"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // ensure employee owns this report

    if (!report.assignedTo || report.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your assigned task" });
    }
    report.status = status;
    await report.save();
    res.json({ message: "Status updated successfully", report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
