import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      minLength: [2, "Name must be at least 2 characters long"],
      maxLength: [25, "Name can't be longer than 25 characters"],
      match: [/^[a-zA-Z\s'-]+$/, "Please enter a valid name"],
      required: true,
      trim: true,
    },

    image: String,

    imagePublicId: String,

    description: {
      type: String,
      minLength: [10, "Description must be at least 10 characters long"],
      maxLength: [50, "Description can't be longer than 50 characters"],
      match: [/^[a-zA-Z\s'-]+$/, "Please enter a valid description"],
      required: true,
      trim: true,
    },
    services: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],
    address: {
      city: {
        type: String,
        required: true,
        lowercase: true,
      },
      area: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
    },
    openHours: [
      {
        day: {
          type: String,
          required: true,
          enum: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
        },
        isOpen: {
          type: Boolean,
          required: true,
        },
        from: String,
        to: String,
      },
    ],
    phone: {
      type: String,
      trim: true,
      required: true,
      match: [
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
        "Please enter a valid phone number",
      ],
      unique: true,
    },
    link: {
      type: String,
      trim: true,
      minLength: [5, "Link must be at least 2 characters long"],
      maxLength: [500, "Link can't be longer than 500 characters"],
      required: true,
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    lng: {
      type: String,
      required: true,
    },
    lat: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const ShopModel = mongoose.model("Shop", shopSchema);
export default ShopModel;
