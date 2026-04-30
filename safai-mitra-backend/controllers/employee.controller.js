import Report from "../models/report.model.js";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

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

// UPDATE STATUS (progress → cleaned with proof)
export const updateStatus = async (req, res) => {
  try {
    const reportId = req.params.id;
    const { status } = req.body;

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

    // if marking cleaned then image proof required
    if (status === "cleaned") {
      if (!req.file) {
        return res.status(400).json({
          message: "Cleaned proof image is required",
        });
      }

      const uploadedImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "safai-mitra/cleaned-proofs" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      report.cleaned_image = uploadedImage.secure_url;
      report.cleanedAt = new Date();
    }    

    report.status = status;

    await report.save();

    res.json({
      message: "Status updated successfully",
      report,
    });
  } catch (error) {
    console.log("EMPLOYEE STATUS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
