import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("Warning: MONGO_URI is not defined in environment variables.");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.warn("Server will continue running. Ensure MONGO_URI in .env is correct for database operations.");
  }
};

export default connectDB;