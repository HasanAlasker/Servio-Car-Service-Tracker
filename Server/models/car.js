import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: { type: String },
    imagePublicId: { type: String },
    make: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: Number,
      min: [1900, "Year must be 1900 or later"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
      required: true,
    },
    color: {
      type: String,
      trim: true,
    },
    plateNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    mileage: {
      type: Number,
      min: [0, "Mileage cannot be negative"],
      required: true,
    },
    unit: {
      type: String,
      enum: ["km", "mile"],
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const CarModel = mongoose.model("Car", carSchema);
export default CarModel;
