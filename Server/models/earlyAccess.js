import mongoose from "mongoose";

const EarlyAccessSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ["android", "ios"],
    required: true,
  },
  email: {
    type: String,
    minLength: [5, "Email must be at least 5 characters long"],
    maxLength: [255, "Email can't be longer than 255 characters"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  // phone: {
  //   type: String,
  //   trim: true,
  //   required: true,
  //   match: [
  //     /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
  //     "Please enter a valid phone number",
  //   ],
  //   unique: true,
  // },
  isInvitationSent: {
    type: Boolean,
    default: false,
  },
});

const EarlyAccessModel = mongoose.model("EarlyAccess", EarlyAccessSchema);
export default EarlyAccessModel;
