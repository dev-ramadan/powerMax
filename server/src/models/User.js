import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'المنزل' },
  fullAddress: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer' },
  addresses: [addressSchema],
  active: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
