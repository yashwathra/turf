import mongoose from "mongoose";

const TurfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },

    // Turf level opening/closing time
    openingTime: {
      type: String,
      default: "06:00",
    },
    closingTime: {
      type: String,
      default: "22:00",
    },

    // Sports with their own timing and pricing
    sports: [
      {
        name: { type: String, required: true },
        available: { type: Boolean, default: true },

        // This sport available within turf time
        startTime: { type: String, required: true }, // like 09:00
        endTime: { type: String, required: true },   // like 18:00

        pricing: [
          {
            startTime: { type: String, required: true }, // "06:00"
            endTime: { type: String, required: true },   // "07:00"
            rate: { type: Number, required: true },      // ₹800
            label: { type: String, default: "Regular" }, // Optional: "Rush Hour"
            days: {
              type: [String],
              default: ["All"], // Or ["Saturday", "Sunday"]
            },
          },
        ],
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
  },
  { timestamps: true }
);

export default mongoose.models.Turf || mongoose.model("Turf", TurfSchema);
