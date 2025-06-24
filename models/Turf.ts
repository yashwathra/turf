import mongoose from "mongoose";

const TurfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true }, // 🆕 Used in filters
    sports: [String],
    amenities: [String],
    slotDuration: {
      type: Number,
      default: 60, // in minutes
    },
    ratePerHour: {
      type: Number,
      default: 800,
    },
    imageUrl: {
      type: String,
      default: "/turf-image.jpg",
    },
    description: {
      type: String,
      default: "A premium turf for all your sports needs.",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Turf || mongoose.model("Turf", TurfSchema);
