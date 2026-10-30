import StoreSettings from '../models/StoreSettings.js';
import { createError } from '../middleware/errorHandler.js';

const SETTINGS_KEY = 'main';

async function getOrCreateSettings() {
  let settings = await StoreSettings.findOne({ key: SETTINGS_KEY });
  if (!settings) {
    settings = await StoreSettings.create({ key: SETTINGS_KEY });
  }
  return settings;
}

export async function getSettings(req, res, next) {
  try {
    const settings = await getOrCreateSettings();
    // Return public-safe fields for storefront
    const { key: _, __v, ...safeSettings } = settings.toObject();
    res.json({ settings: safeSettings });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const allowed = [
      'storeName', 'tagline', 'logo', 'heroImage', 'phone', 'email', 'address',
      'facebook', 'instagram', 'whatsapp',
      'shippingFee', 'freeShippingThreshold',
      'announcementText', 'announcementActive',
      'shippingPolicy', 'returnPolicy', 'privacyPolicy', 'termsConditions', 'aboutUs',
      'metaTitle', 'metaDescription'
    ];

    const update = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) update[field] = req.body[field];
    }

    const settings = await StoreSettings.findOneAndUpdate(
      { key: SETTINGS_KEY },
      update,
      { new: true, upsert: true }
    );

    res.json({ settings, message: 'تم حفظ إعدادات المتجر بنجاح.' });
  } catch (error) {
    next(error);
  }
}
