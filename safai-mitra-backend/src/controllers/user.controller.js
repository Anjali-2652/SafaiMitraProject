import User from "../models/user.model.js";
import Report from "../models/report.model.js";


// 👤 GET USER PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const totalReports = await Report.countDocuments({ user: req.user.id });
    const cleanedReports = await Report.countDocuments({
      user: req.user.id,
      status: "cleaned",
    });
    const pendingReports = await Report.countDocuments({
      user: req.user.id,
      status: "pending",
    });

    res.json({
      user,
      stats: {
        totalReports,
        cleanedReports,
        pendingReports,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 👤 GET MY REPORTS
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id })
      .populate("assignedTo", "full_name phone role")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};