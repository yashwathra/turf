import mongoose from "mongoose";

const TurfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },

    // ✅ UPDATED: sports include 'available' flag now
    sports: [
      {
        name: { type: String, required: true },
        ratePerHour: { type: Number, required: true },
        available: { type: Boolean, default: true }, // ✅ new field
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

    isActive: {
      type: Boolean,
      default: true,
    },

    facilities: {
      type: [String],
      default: [],
    },

    openingTime: {
      type: String,
      default: "06:00",
    },

    closingTime: {
      type: String,
      default: "22:00",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Turf || mongoose.model("Turf", TurfSchema);
