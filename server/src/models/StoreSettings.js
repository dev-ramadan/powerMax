import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true },
  storeName: { type: String, default: 'POWER MAX' },
  tagline: { type: String, default: 'THE BEST IN HOME WORLD' },
  logo: { type: String, default: '/logo.png' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  shippingFee: { type: Number, default: 60, min: 0 },
  freeShippingThreshold: { type: Number, default: 500, min: 0 },
  heroImage: { type: String, default: '' },
  announcementText: { type: String, default: 'شحن مجاني على الطلبات فوق 500 ج.م — اطلب الآن!' },
  announcementActive: { type: Boolean, default: true },
  shippingPolicy: { type: String, default: '' },
  returnPolicy: { type: String, default: '' },
  privacyPolicy: { type: String, default: '' },
  termsConditions: { type: String, default: '' },
  aboutUs: { type: String, default: '' },
  metaTitle: { type: String, default: 'POWER MAX | أفضل منتجات المنزل' },
  metaDescription: { type: String, default: 'كل احتياجات بيتك وتجهيز العروسة في مكان واحد.' }
}, { timestamps: true });

export default mongoose.model('StoreSettings', storeSettingsSchema);
