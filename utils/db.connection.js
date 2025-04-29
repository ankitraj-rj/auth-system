import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`✅ Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to DB: ${error.message}`);
    process.exit(1); // Forcefully exit if DB not connected
  }
};

export default dbConnect;