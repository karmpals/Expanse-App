import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://kpsheoran33:karmpalsheoran@cluster0.obvkbcs.mongodb.net/Expanse",
    )
    .then(() => {
      console.log("Connected to MongoDB");
    });
};
