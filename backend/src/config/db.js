import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri =
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/veloop_rewards';

  try {
    console.log(`Connecting to MongoDB at: ${mongoUri.includes('@') ? mongoUri.replace(/:([^:@]+)@/, ':****@') : mongoUri}`);
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    console.log(`\n========================================================================`);
    console.log(`📌 HOW TO CONFIGURE MONGODB:`);
    console.log(`1. Open "backend/.env"`);
    console.log(`2. Set your free MongoDB Atlas URI or local MongoDB connection string:`);
    console.log(`   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/veloop_rewards?retryWrites=true&w=majority`);
    console.log(`   (Or if running local MongoDB: MONGO_URI=mongodb://127.0.0.1:27017/veloop_rewards)`);
    console.log(`3. Restart the backend: npm run dev`);
    console.log(`========================================================================\n`);
    throw error;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
