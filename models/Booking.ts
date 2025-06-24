// models/Booking.ts
import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
  date: { type: String, required: true }, // e.g. "2025-06-24"
  slot: { type: String, required: true }, // e.g. "2PM - 3PM"
  price: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
