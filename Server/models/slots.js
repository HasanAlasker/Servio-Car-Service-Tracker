import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  appointment: {
    type: mongoose.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  date: Date,
  from: String,
  to: String,
});

export const SlotModel = mongoose.model("Slot", slotSchema);
