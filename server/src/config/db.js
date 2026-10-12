import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI is not set. API will use demo data.');
    return null;
  }

  // Reuse existing connection if ready
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    }).then((m) => {
      console.log('MongoDB connected successfully');
      return m;
    }).catch((err) => {
      console.warn('MongoDB connection failed; using demo fallback data:', err.message);
      cached.promise = null;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    return null;
  }
}
