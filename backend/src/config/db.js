import mongoose from 'mongoose';
import { setMongoConnected, initializeMemoryStore } from './memoryStore.js';

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri && mongoUri.trim().length > 0) {
    try {
      console.log(`Connecting to MongoDB URI...`);
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      setMongoConnected(true);
      return conn;
    } catch (error) {
      console.warn(`⚠️ MongoDB connection failed: ${error.message}`);
      console.log(`🔄 Switching to instant In-Memory Datastore fallback...`);
      setMongoConnected(false);
      await initializeMemoryStore();
      return null;
    }
  }

  // If no MONGO_URI is set in .env
  console.log(`ℹ️ No MONGO_URI configured in backend/.env`);
  console.log(`⚡ Activating zero-config In-Memory Datastore so the app runs out of the box!`);
  setMongoConnected(false);
  await initializeMemoryStore();
  return null;
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
  } catch {}
};
