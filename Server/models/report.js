import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedShop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment"
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

const ReportModel = mongoose.model("Report", ReportSchema);
export default ReportModel;
