import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      unique: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    address: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "employee", "user"],
      default: "user",
    },

    isActive:{
      type: Boolean,
      default: true,

    }
  },
  { timestamps: true },
);

userSchema.index({ phone: 1 });
userSchema.index({ username: 1 });


const User = mongoose.model("User", userSchema);
export default User;
