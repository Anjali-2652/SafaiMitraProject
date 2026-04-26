import Report from "../models/report.model.js";

// CREATE REPORT
export const createReport = async (req, res) => {
  try {
    const {
      description,
      garbage_type,
      location_text,
      latitude,
      longitude,
      ward,
    } = req.body;

if (!req.file) {
  return res.status(400).json({ message: "Image is required" });
}



    const report = await Report.create({
      image,
      description,
      garbage_type,
      location_text,
      latitude,
      longitude,
      ward,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET USER REPORTS
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL REPORTS (ADMIN)
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("user", "full_name phone");

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};