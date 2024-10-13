import mongoose from "mongoose";

const conn = async function () {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log(`Connected to DB`);
  } catch (error) {
    console.error("Error connecting", error.message);
  }
};

export default conn;
