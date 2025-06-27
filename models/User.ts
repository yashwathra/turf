import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'owner', 'user'],
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true, 
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
