import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    turf: { type: mongoose.Schema.Types.ObjectId, ref: "Turf", required: true },
    date: { type: String, required: true }, // ISO format recommended
    slot: { type: String, required: true }, // e.g. "15:00"
    price: { type: Number, required: true },
    sport: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// ⛔ Prevent model overwrite in hot reload (Next.js dev server)
const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
export default Booking;
