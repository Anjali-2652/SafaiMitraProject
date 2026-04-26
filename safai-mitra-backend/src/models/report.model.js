import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    garbage_type: {
      type: String,
      enum: ["plastic", "organic", "metal", "mixed", "other"],
      required: true,
    },

    location_text: {
      type: String,
      trim: true,
    },

    latitude: Number,
    longitude: Number,

    ward: { 
        type: Number,
        required: true,

     },

    status: {
      type: String,
      enum: ["pending", "progress", "cleaned"],
      default: "pending",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    remarks: {
      type: String,
      default: "",
    },

    cleanedAt:{
      type: Date,
      default: null,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

reportSchema.index({ status: 1 });
reportSchema.index({ ward: 1 });
reportSchema.index({ user: 1 });

const Report = mongoose.model("Report", reportSchema);
export default Report;