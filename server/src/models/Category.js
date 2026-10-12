import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String, default: '', maxlength: 1000 },
  image: { type: String, default: '' },
  icon: { type: String, default: '' },
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

categorySchema.index({ active: 1, sortOrder: 1 });

export default mongoose.model('Category', categorySchema);
