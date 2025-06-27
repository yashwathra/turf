import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  // 🧑 Profile fields added directly here:
  phone: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  dob: { type: Date },
  address: { type: String },
  avatarUrl: { type: String },

  // 🚦 Role and status:
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
