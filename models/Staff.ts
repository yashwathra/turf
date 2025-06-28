// models/Staff.ts
import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    role: {
      type: String,
      required: true,
    },
    shiftStart: {
  type: String,
  required: true,
},
shiftEnd: {
  type: String,
  required: true,
},
    permissions: {
      type: [String],
      default: [],
    },
    canAccessDashboard: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      select: false, // security: exclude by default
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
