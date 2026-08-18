import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT);
    console.log("DB connected Successfully");
  } catch (error) {
    console.error("DB connection error:", error);
  }
};

export default dbConnect;
