import mongoose from "mongoose";

const suggstionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "feature request",
        "bug report",
        "improvement",
        "question",
        "other",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const SuggestionModel = mongoose.model("Suggestion", suggstionSchema);
export default SuggestionModel;
