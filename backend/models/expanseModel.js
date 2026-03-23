import mongoose from "mongoose";

const expanseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      default: "expanse",
    },
  },
  {
    timestamps: true,
  },
);

const expanseModel =
  mongoose.model("expanse", expanseSchema) || mongoose.models.expanse;

export default expanseModel;
