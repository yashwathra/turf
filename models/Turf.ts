import mongoose from "mongoose";

const TurfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true }, 
    sports: [
  {
    name: { type: String, required: true },
    ratePerHour: { type: Number, required: true },
  },
],
    amenities: [String], 
    slotDuration: {
      type: Number,
      default: 60, // in minutes
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

    // 🆕 Active/Inactive status
    isActive: {
      type: Boolean,
      default: true,
    },

    // 🆕 Turf facilities (optional, or use `amenities`)
    facilities: {
      type: [String],
      default: [],
    },

    // 🆕 Turf opens at
    openingTime: {
      type: String, 
      default: "06:00",
    },

    // 🆕 Turf closes at
    closingTime: {
      type: String, 
      default: "22:00",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Turf || mongoose.model("Turf", TurfSchema);
