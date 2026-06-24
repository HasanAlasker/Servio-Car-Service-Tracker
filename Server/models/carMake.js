import mongoose from "mongoose";

const carMakeSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: [
    {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  ],
});

const CarMakeModel = mongoose.model("CarMake", carMakeSchema);
export default CarMakeModel;
