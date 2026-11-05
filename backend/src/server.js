import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import { seedDatabase } from './seed/seedData.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Check if demo data needs to be seeded automatically
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database empty. Automatically seeding demo data...');
      await seedDatabase();
    } else {
      console.log(`Database already initialized with ${userCount} users.`);
    }

    const server = app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 VELoop Rewards Backend API is running!`);
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });

    const shutdown = () => {
      console.log('Shutting down VELoop Rewards API server gracefully...');
      server.close(() => {
        console.log('Process terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start VELoop Rewards API server:', error);
    process.exit(1);
  }
};

startServer();

