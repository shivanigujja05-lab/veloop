import mongoose from 'mongoose';

let mongoMemoryServerInstance = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (mongoUri) {
      console.log('Connecting to provided MongoDB URI...');
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }

    // Fallback for local development/evaluation if no URI is provided
    console.log('No MONGO_URI provided in environment. Initializing local in-memory MongoDB fallback...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServerInstance = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServerInstance.getUri();
    
    const conn = await mongoose.connect(memoryUri);
    console.log(`In-Memory MongoDB Connected at: ${memoryUri}`);
    return conn;
  } catch (error) {
    console.warn(`Initial MongoDB connection failed (${error.message}). Attempting in-memory fallback...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServerInstance = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServerInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`In-Memory MongoDB fallback Connected at: ${memoryUri}`);
      return conn;
    } catch (fallbackError) {
      console.error(`MongoDB connection error: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServerInstance) {
    await mongoMemoryServerInstance.stop();
  }
};
