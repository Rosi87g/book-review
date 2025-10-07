import mongoose from 'mongoose';

const publisherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  publisherId: { type: String, unique: true, default: null },

  // 🔐 Verification & Reset
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
}, { timestamps: true });

export default mongoose.model('Publisher', publisherSchema);