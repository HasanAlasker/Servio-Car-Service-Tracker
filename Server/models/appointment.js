import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
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
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    serviceParts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Part",
        required: true,
      },
    ],
    status: {
      type: String,
      lowercase: true,
      enum: [
        "pending",
        "confirmed",
        "in-progress",
        "canceled",
        "completed",
        "no-show",
        "rejected",
      ],
      default: "pending",
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    cost: {
      type: Number,
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    isRated: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Prevent double booking (same car at same time)
appointmentSchema.index(
  { car: 1, scheduledDate: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "confirmed", "in-progress"] },
    },
  },
);

// Virtual for checking if appointment is upcoming
appointmentSchema.virtual("isUpcoming").get(function () {
  return (
    this.scheduledDate > new Date() &&
    ["pending", "confirmed"].includes(this.status)
  );
});

const AppointmentModel = mongoose.model("Appointment", appointmentSchema);
export default AppointmentModel;
