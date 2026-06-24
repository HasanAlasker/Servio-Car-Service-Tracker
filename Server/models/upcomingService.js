import mongoose from "mongoose";

const upcomingServiceSchema = new mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Part",
      required: true,
    },
  ],
  dueBy: {
    date: {
      type: Date,
      index: true,
    },
    mileage: {
      type: Number,
      min: 0,
    },
  },
  status: {
    type: String,
    enum: ["not active", "soon", "due", "overdue"],
    default: "not active",
  },
  reminder: {
    type: Boolean,
    default: true,
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  partKey: {
    type: String,
    required: true,
    index: true,
  },
});

const UpcomingServiceModel = mongoose.model(
  "UpcomingService",
  upcomingServiceSchema,
);
export default UpcomingServiceModel;
