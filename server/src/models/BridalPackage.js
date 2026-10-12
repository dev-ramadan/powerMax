import mongoose from 'mongoose';

const bridalPackageItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  description: { type: String, default: '' }
}, { _id: false });

const bridalPackageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  image: { type: String, default: '' },
  images: [{ type: String }],
  items: [bridalPackageItemSchema],
  highlight: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('BridalPackage', bridalPackageSchema);
