import mongoose from "mongoose";
import { SlotModel } from "../models/slots.js";

export const deletedSlot = async (slotId) => {
  await SlotModel.findByIdAndDelete(slotId);
};
