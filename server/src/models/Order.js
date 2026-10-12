import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String, required: true },
  productSlug: { type: String },
  productImage: { type: String, default: '' },
  sku: { type: String, default: '' },
  unitPrice: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  lineTotal: { type: Number, required: true, min: 0 }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  notes: { type: String, default: '' }
}, { _id: false });

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PM-${timestamp}-${random}`;
}

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    default: generateOrderNumber
  },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestEmail: { type: String, trim: true, lowercase: true },
  shippingAddress: { type: shippingAddressSchema, required: true },
  items: { type: [orderItemSchema], required: true, validate: v => v.length > 0 },
  subtotal: { type: Number, required: true, min: 0 },
  shippingCost: { type: Number, required: true, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'cod', 'online', 'instapay', 'vodafone_cash'],
    default: 'cash_on_delivery'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    note: String
  }],
  notes: { type: String, default: '' }
}, { timestamps: true });

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);
