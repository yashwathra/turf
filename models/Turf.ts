import mongoose from "mongoose";

const TurfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    sports: [String], 
    amenities: [String],
    slotDuration: Number,
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
