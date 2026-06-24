import mongoose from "mongoose";

const partSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    recommendedChangeInterval: {
      months: {
        type: Number,
        min: 0,
      },
      miles: {
        type: Number,
        min: 0,
      },
    },
    lastChangeDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v <= new Date();
        },
        message: "Last change date cannot be in the future",
      },
    },
    lastChangeMileage: {
      type: Number,
      required: true,
      min: [0, "Mileage cannot be negative"],
    },
    isTracked: {
      type: Boolean,
      default: true,
    },
    note: {
      type: String,
      maxLength: [100, "Note can't be longer than 100 characters"],
      match: [/^[a-zA-Z0-9\s'-]+$/, "Please enter a valid note"],
      trim: true,
    },
  },
  { timestamps: true },
);

const PartModel = mongoose.model("Part", partSchema);
export default PartModel;
