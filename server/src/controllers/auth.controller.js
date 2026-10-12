import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';

function safeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    addresses: user.addresses,
    createdAt: user.createdAt
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return next(createError(422, 'الاسم والبريد الإلكتروني وكلمة السر مطلوبة.'));
    }

    if (password.length < 6) {
      return next(createError(422, 'كلمة السر يجب أن تكون 6 أحرف على الأقل.'));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(createError(422, 'البريد الإلكتروني غير صالح.'));
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return next(createError(409, 'هذا البريد الإلكتروني مسجل بالفعل.'));
    }

    const user = await User.create({ name, email, phone, password });
    const token = signToken(user._id);

    res.status(201).json({ token, user: safeUser(user), message: 'تم إنشاء الحساب بنجاح!' });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(422, 'البريد الإلكتروني وكلمة السر مطلوبان.'));
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !user.active) {
      return next(createError(401, 'بيانات تسجيل الدخول غير صحيحة.'));
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return next(createError(401, 'بيانات تسجيل الدخول غير صحيحة.'));
    }

    const token = signToken(user._id);
    res.json({ token, user: safeUser(user), message: 'تم تسجيل الدخول بنجاح!' });
  } catch (error) {
    next(error);
  }
}

export async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(422, 'البريد الإلكتروني وكلمة السر مطلوبان.'));
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !user.active) {
      return next(createError(401, 'بيانات تسجيل الدخول غير صحيحة.'));
    }

    if (!['admin', 'staff'].includes(user.role)) {
      return next(createError(403, 'ليس لديك صلاحية للوصول للوحة التحكم.'));
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return next(createError(401, 'بيانات تسجيل الدخول غير صحيحة.'));
    }

    const token = signToken(user._id);
    res.json({ token, user: safeUser(user), message: 'تم تسجيل الدخول في لوحة التحكم بنجاح!' });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res) {
  res.json({ user: safeUser(req.user) });
}

export async function updateProfile(req, res, next) {
  try {
    const { name, phone, addresses } = req.body;
    const update = {};
    if (name) update.name = name;
    if (phone !== undefined) update.phone = phone;
    if (addresses !== undefined) update.addresses = addresses;

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    res.json({ user: safeUser(user), message: 'تم تحديث البيانات بنجاح.' });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return next(createError(422, 'كلمة السر الحالية والجديدة مطلوبتان.'));
    }
    if (newPassword.length < 6) {
      return next(createError(422, 'كلمة السر الجديدة يجب أن تكون 6 أحرف على الأقل.'));
    }

    const user = await User.findById(req.user._id).select('+password');
    const match = await user.comparePassword(currentPassword);
    if (!match) return next(createError(401, 'كلمة السر الحالية غير صحيحة.'));

    user.password = newPassword;
    await user.save();
    res.json({ message: 'تم تغيير كلمة السر بنجاح.' });
  } catch (error) {
    next(error);
  }
}
