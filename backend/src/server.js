import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { isMongoConnected } from './config/memoryStore.js';
import User from './models/User.js';
import { seedDatabase } from './seed/seedData.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // If connected to real MongoDB, seed if empty
    if (isMongoConnected) {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('MongoDB is empty. Seeding initial records...');
        await seedDatabase();
      } else {
        console.log(`MongoDB active with ${userCount} existing users.`);
      }
    }

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 VELoop Rewards Backend API is RUNNING!`);
      console.log(`📍 Port: ${PORT}`);
      console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
      console.log(`⚡ Mode: ${isMongoConnected ? 'MongoDB Connected' : 'Zero-Config In-Memory Storage'}`);
      console.log(`===============================================`);
    });

    const shutdown = () => {
      console.log('Shutting down VELoop Rewards API server gracefully...');
      server.close(() => {
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
