import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String, default: '', maxlength: 3000 },
  sku: { type: String, trim: true, default: '' },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  categoryName: { type: String, trim: true }, // Denormalized for performance
  image: { type: String, default: '' },
  images: [{ type: String }],
  stock: { type: Number, default: 0, min: 0 },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  tags: [{ type: String, trim: true }]
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', categoryName: 'text', tags: 'text' });
productSchema.index({ category: 1, active: 1 });
productSchema.index({ featured: 1, active: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ stock: 1 });

export default mongoose.model('Product', productSchema);
