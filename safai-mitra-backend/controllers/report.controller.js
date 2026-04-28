import Report from "../models/report.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// helper function to upload buffer to cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "safai-mitra" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// CREATE REPORT
export const createReport = async (req, res) => {
  try {
    console.log("========== CREATE REPORT HIT ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user);

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

    // upload image buffer manually to cloudinary
    const uploadedImage = await uploadToCloudinary(req.file.buffer);

    const report = await Report.create({
      image: uploadedImage.secure_url,
      description,
      garbage_type,
      location_text,
      latitude,
      longitude,
      ward,
      user: req.user.id,
    });

    console.log("Report created:", report);

    res.status(201).json({
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    console.log("========= CREATE REPORT ERROR =========");
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET USER REPORTS
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL REPORTS (ADMIN)
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("user", "full_name phone")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSingleReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("assignedTo", "full_name phone role")
      .populate("user", "full_name phone");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};