import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authenticate any logged-in user (customer or admin).
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'يجب تسجيل الدخول للوصول لهذا المورد.' });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.active) {
      return res.status(401).json({ message: 'الجلسة غير صالحة. يرجى إعادة تسجيل الدخول.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجدداً.' });
    }
    next(error);
  }
}

/**
 * Require admin or staff role.
 */
export function requireAdmin(req, res, next) {
  if (!req.user || !['admin', 'staff'].includes(req.user.role)) {
    return res.status(403).json({ message: 'ليس لديك صلاحية للوصول لهذا المورد.' });
  }
  next();
}

/**
 * Require admin role specifically (not staff).
 */
export function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'يتطلب هذا الإجراء صلاحيات المدير العام.' });
  }
  next();
}

/**
 * Optional authentication — sets req.user if token is valid, but doesn't fail if absent.
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return next();

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (user && user.active) req.user = user;
  } catch {
    // Token invalid — proceed as guest
  }
  next();
}

/**
 * Sign a JWT token for a user.
 */
export function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}
