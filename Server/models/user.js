import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [2, "Name must be at least 2 characters long"],
      maxLength: [25, "Name can't be longer than 25 characters"],
      match: [/^[a-zA-Z\s'-]+$/, "Please enter a valid name"],
      required: true,
      trim: true,
    },
    email: {
      type: String,
      minLength: [5, "Email must be at least 5 characters long"],
      maxLength: [255, "Email can't be longer than 255 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
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
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "shopOwner", "admin"],
      default: "user",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    pushNotificationTokens: [
      {
        token: String,
        platform: String, // ios or android
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      isDeleted: this.isDeleted,
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "90d" }
  );

  return token;
};

userSchema.methods.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hash(password, salt);

  return hashedPassword;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
