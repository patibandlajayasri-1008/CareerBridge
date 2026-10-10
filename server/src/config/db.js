import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

/**
 * Connect to MongoDB Atlas or local MongoDB instance
 */
export const connectDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    });

    isConnected = true;
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    // Keep server running in cloud and schedule reconnect retry
    setTimeout(() => {
      console.log('Retrying MongoDB connection attempt in 5 seconds...');
      connectDB().catch(() => {});
    }, 5000);
    return null;
  }
};

/**
 * Disconnect from MongoDB (useful in test teardowns)
 */
export const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
};

export default connectDB;
