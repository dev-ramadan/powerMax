/**
 * POWER MAX — Seed Script
 * Creates the first admin account + sample categories + sample products.
 *
 * Usage:
 *   node src/seed.js
 *
 * WARNING: Requires MONGODB_URI and JWT_SECRET in server/.env
 * This script will NOT overwrite existing data — it's safe to run on a populated database.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import BridalPackage from './models/BridalPackage.js';
import StoreSettings from './models/StoreSettings.js';

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@powermax.eg';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'PowerMax@2025!';
const ADMIN_NAME = 'مدير POWER MAX';

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not set. Set it in server/.env then retry.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // ─── Admin User ────────────────────────────────────────────────────────────
  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
  if (!existingAdmin) {
    await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' });
    console.log(`✅ Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    console.log('   ⚠️  Change this password immediately after first login!');
  } else {
    console.log(`ℹ️  Admin already exists: ${ADMIN_EMAIL}`);
  }

  // ─── Store Settings ─────────────────────────────────────────────────────────
  const existingSettings = await StoreSettings.findOne({ key: 'main' });
  if (!existingSettings) {
    await StoreSettings.create({
      key: 'main',
      storeName: 'POWER MAX',
      tagline: 'THE BEST IN HOME WORLD',
      logo: '/logo.png',
      phone: '01000000000',
      email: 'info@powermax.eg',
      address: 'القاهرة، مصر',
      shippingFee: 60,
      freeShippingThreshold: 500,
      announcementText: 'شحن مجاني على الطلبات فوق 500 ج.م — اطلب الآن! 🚚',
      announcementActive: true
    });
    console.log('✅ Store settings created');
  }

  // ─── Categories ─────────────────────────────────────────────────────────────
  const categoryData = [
    { name: 'أدوات الطهي', slug: 'cooking-tools', description: 'حلل، مقالي، وكل ما تحتاجه لمطبخك', sortOrder: 1 },
    { name: 'السفرة والتقديم', slug: 'dining-serving', description: 'أطباق وأدوات تقديم أنيقة', sortOrder: 2 },
    { name: 'تجهيز المطبخ', slug: 'kitchen-setup', description: 'تنظيم وتجهيز مطبخك بالكامل', sortOrder: 3 },
    { name: 'الأكواب والكناية', slug: 'cups-mugs', description: 'مجموعة متنوعة من الأكواب والمجات', sortOrder: 4 },
    { name: 'المفروشات والمناشف', slug: 'textiles-towels', description: 'مفروشات وبياضات جودة عالية', sortOrder: 5 },
    { name: 'أدوات التنظيف', slug: 'cleaning-tools', description: 'لبيتك نظيف دايماً', sortOrder: 6 },
    { name: 'تجهيزات العروسة', slug: 'bridal-essentials', description: 'كل ما تحتاجينه لبيتك الجديد', sortOrder: 7 }
  ];

  const categoryMap = {};
  for (const cat of categoryData) {
    let category = await Category.findOne({ slug: cat.slug });
    if (!category) {
      category = await Category.create(cat);
      console.log(`✅ Category created: ${cat.name}`);
    }
    categoryMap[cat.slug] = category._id;
  }

  // ─── Products ────────────────────────────────────────────────────────────────
  const productData = [
    {
      name: 'طقم حلل استانلس استيل 10 قطع',
      slug: 'stainless-steel-cookware-set-10',
      description: 'طقم حلل استانلس استيل عالي الجودة مناسب للاستخدام اليومي. يشمل مقاسات مختلفة من 16 إلى 24 سم. مناسب لجميع أنواع البوتاجازات بما فيها الإندكشن.',
      sku: 'PM-HLL-001',
      price: 3499,
      compareAtPrice: 3999,
      category: categoryMap['cooking-tools'],
      categoryName: 'أدوات الطهي',
      image: 'https://images.unsplash.com/photo-1584990347449-a8c7f7f1f1f7?auto=format&fit=crop&w=900&q=80',
      stock: 15,
      featured: true
    },
    {
      name: 'طقم أطباق سفرة بورسلان 24 قطعة',
      slug: 'porcelain-dinnerware-set-24',
      description: 'طقم أطباق سفرة أنيق من البورسلان الجودة العالية، مناسب للاستخدام اليومي والمناسبات. يشمل صحون كبيرة وصغيرة وأطباق شوربة.',
      sku: 'PM-ATB-001',
      price: 2199,
      compareAtPrice: 2499,
      category: categoryMap['dining-serving'],
      categoryName: 'السفرة والتقديم',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80',
      stock: 10,
      featured: true
    },
    {
      name: 'مجموعة أكواب زجاج 6 قطع',
      slug: 'glass-cups-set-6',
      description: 'أكواب زجاج شفاف بتصميم أنيق للاستخدام اليومي أو كهدية مميزة. سعة 350 مل، مناسبة للمشروبات الباردة والساخنة.',
      sku: 'PM-AKW-001',
      price: 449,
      category: categoryMap['cups-mugs'],
      categoryName: 'الأكواب والكناية',
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558f109e?auto=format&fit=crop&w=900&q=80',
      stock: 25,
      featured: true
    },
    {
      name: 'منظم أدوات مطبخ خشبي',
      slug: 'wooden-kitchen-organizer',
      description: 'منظم أدوات مطبخ من الخشب الطبيعي، يساعدك في تنظيم أدوات المطبخ بشكل عملي وجميل. مناسب للأسطح والأدراج.',
      sku: 'PM-MNZ-001',
      price: 299,
      category: categoryMap['kitchen-setup'],
      categoryName: 'تجهيز المطبخ',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80',
      stock: 30,
      featured: true
    },
    {
      name: 'طقم مناشف قطن 6 قطع',
      slug: 'cotton-towels-set-6',
      description: 'طقم مناشف قطن عالي الامتصاص بألوان عصرية، يشمل مناشف الجسم والوجه. ناعم على البشرة، غسيل سهل.',
      sku: 'PM-MNS-001',
      price: 599,
      compareAtPrice: 699,
      category: categoryMap['textiles-towels'],
      categoryName: 'المفروشات والمناشف',
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=80',
      stock: 20,
      featured: false
    },
    {
      name: 'مقلاة تفلون عميقة 28 سم',
      slug: 'non-stick-deep-pan-28',
      description: 'مقلاة تفلون عميقة مضادة للالتصاق مقاس 28 سم مع غطاء زجاجي. مناسبة للقلي والطهي على نار هادئة.',
      sku: 'PM-MQL-001',
      price: 389,
      compareAtPrice: 450,
      category: categoryMap['cooking-tools'],
      categoryName: 'أدوات الطهي',
      image: 'https://images.unsplash.com/photo-1584990347449-a8c7f7f1f1f7?auto=format&fit=crop&w=900&q=80',
      stock: 18,
      featured: false
    },
    {
      name: 'طقم فناجين قهوة 6 قطع',
      slug: 'coffee-cups-set-6',
      description: 'طقم فناجين قهوة عربية أنيقة من السيراميك مع الأطباق. تصميم كلاسيكي مميز، مناسب للمنزل والهدايا.',
      sku: 'PM-FNJ-001',
      price: 349,
      category: categoryMap['cups-mugs'],
      categoryName: 'الأكواب والكناية',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
      stock: 22,
      featured: false
    },
    {
      name: 'طقم أدوات تنظيف المطبخ',
      slug: 'kitchen-cleaning-set',
      description: 'مجموعة أدوات تنظيف متكاملة للمطبخ تشمل إسفنجات، فرش، وقفاز مطبخ. مواد عالية الجودة ومقاومة للتآكل.',
      sku: 'PM-TNZ-001',
      price: 199,
      category: categoryMap['cleaning-tools'],
      categoryName: 'أدوات التنظيف',
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=80',
      stock: 40,
      featured: false
    }
  ];

  for (const prod of productData) {
    const existing = await Product.findOne({ slug: prod.slug });
    if (!existing) {
      await Product.create(prod);
      console.log(`✅ Product created: ${prod.name}`);
    }
  }

  // ─── Bridal Packages ─────────────────────────────────────────────────────────
  const bridalData = [
    {
      name: 'باقة البيت الجديد — الأساسية',
      slug: 'new-home-basic',
      description: 'كل الأساسيات اللي محتاجاها لبيتك الجديد في باقة واحدة بسعر مميز.',
      price: 4999,
      compareAtPrice: 6500,
      highlight: false,
      items: [
        { name: 'طقم حلل استانلس 10 قطع', quantity: 1 },
        { name: 'طقم أطباق سفرة 18 قطعة', quantity: 1 },
        { name: 'طقم أكواب 6 قطع', quantity: 1 },
        { name: 'طقم مناشف 4 قطع', quantity: 1 },
        { name: 'منظم مطبخ', quantity: 1 }
      ]
    },
    {
      name: 'باقة العروسة الكاملة',
      slug: 'complete-bride-package',
      description: 'الباقة الأكمل لتجهيز بيت العروسة — كل حاجة من المطبخ للصالة.',
      price: 8999,
      compareAtPrice: 12000,
      highlight: true,
      items: [
        { name: 'طقم حلل استانلس 10 قطع', quantity: 1 },
        { name: 'مقلاة تفلون 28 سم', quantity: 1 },
        { name: 'طقم أطباق سفرة 24 قطعة', quantity: 1 },
        { name: 'طقم فناجين قهوة 6 قطع', quantity: 1 },
        { name: 'طقم أكواب زجاج 6 قطع', quantity: 1 },
        { name: 'طقم مناشف قطن 6 قطع', quantity: 1 },
        { name: 'منظم مطبخ خشبي', quantity: 1 },
        { name: 'طقم أدوات تنظيف', quantity: 1 }
      ]
    }
  ];

  for (const pkg of bridalData) {
    const existing = await BridalPackage.findOne({ slug: pkg.slug });
    if (!existing) {
      await BridalPackage.create(pkg);
      console.log(`✅ Bridal package created: ${pkg.name}`);
    }
  }

  console.log('\n🎉 Seed completed successfully!');
  console.log(`\n🔑 Admin login:\n   Email: ${ADMIN_EMAIL}\n   Password: ${ADMIN_PASSWORD}`);
  console.log('   Admin panel: http://localhost:5173/admin\n');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
