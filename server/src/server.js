import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

try {
  await connectDB();
} catch (error) {
  console.warn('MongoDB connection failed; using demo product data for this session.');
  console.warn(error.message);
}

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
