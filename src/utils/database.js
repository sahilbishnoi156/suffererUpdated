import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strict', true);

  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    // Check if there is an existing mongoose connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "sufferer",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      isConnected = true;

      console.log('MongoDB connected');
    } else {
      console.log('MongoDB is already connected');
    }
  } catch (error) {
    console.error(error);
  }
};
