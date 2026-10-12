/**
 * Centralized error handler middleware.
 */
export function errorHandler(err, _req, res, _next) {
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(422).json({ message: messages.join(' | '), errors: err.errors });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'الحقل';
    return res.status(409).json({ message: `القيمة المدخلة في حقل "${field}" موجودة بالفعل.` });
  }

  // Mongoose CastError (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'معرّف غير صالح.' });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'حدث خطأ غير متوقع في الخادم.';

  // Don't leak stack traces in production
  const body = { message };
  if (process.env.NODE_ENV !== 'production') {
    body.stack = err.stack;
  }

  res.status(status).json(body);
}

/**
 * Helper to create a structured API error.
 */
export function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
