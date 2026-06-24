import express from "express";
import mongoose from "mongoose";
import _ from "lodash";
import admin from "../middleware/admin.js";
import UserModel from "../models/user.js";
import auth from "../middleware/auth.js";
import shopOwner from "../middleware/shopOwner.js";
import validate from "../middleware/joiValidation.js";
import {
  userLoginSchema,
  userRegistrationSchema,
  userUpdateSchema,
} from "../validation/user.js";
import CarModel from "../models/car.js";
import AppointmentModel from "../models/appointment.js";
import UpcomingServiceModel from "../models/upcomingService.js";
import ShopModel from "../models/shop.js";
import SuggestionModel from "../models/suggestion.js";
import ReportModel from "../models/report.js";
import logIP from "../middleware/logIp.js";

const router = express.Router();

// get all users
router.get("/all", [auth, admin], logIP("GET_ALL_USERS"), async (req, res) => {
  try {
    const users = await UserModel.find({ isDeleted: false })
      .sort("-createdAt")
      .select("-password");
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// get deleted users
router.get(
  "/deleted",
  [auth, admin],
  logIP("GET_DELETED_USERS"),
  async (req, res) => {
    try {
      const deletedUsers = await UserModel.find({ isDeleted: true })
        .sort("-createdAt")
        .select("-password");
      return res.status(200).json({ success: true, data: deletedUsers });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// get me
router.get("/me", auth, logIP("GET_ME"), async (req, res) => {
  try {
    const id = req.user._id;

    const user = await UserModel.findById(id).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// count docs
router.get("/count", auth, logIP("COUNT_DOCS"), async (req, res) => {
  try {
    const userId = req.user._id;

    const numOfCars = await CarModel.countDocuments({ owner: userId });
    const numOfAppointments = await AppointmentModel.countDocuments({
      customer: userId,
      $and: [
        { scheduledDate: { $gte: new Date() } },
        { status: { $nin: ["canceled", "completed", "no-show"] } },
      ],
    });
    const numOfServices = await UpcomingServiceModel.countDocuments({
      $and: [{ customer: userId }, { status: { $in: ["due", "overdue"] } }],
    });

    const response = {
      cars: numOfCars,
      appointments: numOfAppointments,
      services: numOfServices,
    };

    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// count docs (admin)
router.get(
  "/admin/count",
  [auth, admin],
  logIP("ADMIN_COUNT_DOCS"),
  async (req, res) => {
    try {
      const activeUsers = await UserModel.countDocuments({ isDeleted: false });
      const deletedUsers = await UserModel.countDocuments({ isDeleted: true });
      const carOwners = await UserModel.countDocuments({
        role: "user",
        isDeleted: false,
      });
      const shopOwners = await UserModel.countDocuments({
        role: "shopOwner",
        isDeleted: false,
      });
      const adminUsers = await UserModel.countDocuments({
        role: "admin",
        isDeleted: false,
      });
      const activeShops = await ShopModel.countDocuments({
        isVerified: true,
        isDeleted: false,
      });
      const deletedShops = await ShopModel.countDocuments({
        isVerified: false,
        isDeleted: true,
      });
      const shopRequests = await ShopModel.countDocuments({
        isVerified: false,
        isDeleted: false,
      });
      const suggestions = await SuggestionModel.countDocuments();
      const reports = await ReportModel.countDocuments({ status: "open" });
      const cars = await CarModel.countDocuments();

      const response = {
        activeUsers: activeUsers,
        deletedUsers: deletedUsers,
        deletedShops: deletedShops,
        activeShops: activeShops,
        shopRequests: shopRequests,
        shopOwners: shopOwners,
        adminUsers: adminUsers,
        carOwners: carOwners,
        suggestions: suggestions,
        reports: reports,
        cars: cars,
      };

      return res.status(200).json({ success: true, data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// count docs (shopOwner)
router.get(
  "/shopOwner/count",
  [auth, shopOwner],
  logIP("SHOP_COUNT_DOCS"),
  async (req, res) => {
    try {
      const userId = req.user._id;

      const activeShops = await ShopModel.countDocuments({
        owner: userId,
        isDeleted: false,
        isVerified: true,
      });
      const newShops = await ShopModel.countDocuments({
        owner: userId,
        isDeleted: false,
        isVerified: false,
      });
      const myShopsId = await ShopModel.find({
        owner: userId,
        isDeleted: false,
        isVerified: true,
      }).select("_id");

      let idList = [];
      myShopsId.map((shop) => idList.push(shop._id));

      const requests = await AppointmentModel.countDocuments({
        shop: { $in: myShopsId },
        status: "pending",
      });

      const response = {
        activeShops: activeShops,
        newShops: newShops,
        activeShops: activeShops,
        requests: requests,
      };

      return res.status(200).json({ success: true, data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

router.get(
  "/profile/:id",
  logIP(`GET_PROFILE`),
  [auth, admin],
  async (req, res) => {
    try {
      const userId = req.params.id;
      let data = {};

      const user = await UserModel.findById(userId).select('-password -pushNotificationTokens');
      if (!user)
        return res.status(404).json({ success: false, message: "User not found" });

      data.user = user;

      if (user.role === "shopOwner") {
        const shops = await ShopModel.find({ owner: userId });
        data.shops = shops;
      }

      if (user.role !== "admin") {
        const cars = await CarModel.find({ owner: userId });
        data.cars = cars;
      }

      return res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// refresh user token
router.get(
  "/refreshToken/:id",
  auth,
  logIP("REFRESH_TOKEN"),
  async (req, res) => {
    try {
      const userId = req.params.id;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource ID",
        });
      }

      const user = await UserModel.findById(userId);

      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      const token = user.generateAuthToken();
      const response = _.omit(user.toObject(), ["password", "__v"]);
      return res.status(201).header("x-auth-token", token).json({
        success: true,
        message: "Token refreshed successfully",
        data: response,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// get by id
router.get("/:id", admin, logIP("GET_USER_BY_ID"), async (req, res) => {
  try {
    const id = req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await UserModel.findById(id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// register
router.post(
  "/register",
  validate(userRegistrationSchema),
  logIP("REGISTER"),
  async (req, res) => {
    try {
      const data = req.body;

      const existingUser = await UserModel.findOne({
        email: data.email,
      }).select("-password");
      if (existingUser)
        return res
          .status(400)
          .json({ success: false, message: "User already registered" });

      const usedPhone = await UserModel.findOne({ phone: data.phone });
      if (usedPhone)
        return res
          .status(400)
          .json({ success: false, message: "Phone number already used" });

      const newUser = new UserModel(data);

      newUser.password = await newUser.hashPassword(data.password);
      await newUser.save();

      const token = newUser.generateAuthToken();

      if (!newUser)
        return res
          .status(404)
          .json({ success: false, message: "Failed to register" });

      const response = _.omit(newUser.toObject(), ["password", "__v"]);

      return res.status(201).header("x-auth-token", token).json({
        success: true,
        message: "Registered successfully",
        data: response,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// login
router.post(
  "/login",
  validate(userLoginSchema),
  logIP("LOGIN"),
  async (req, res) => {
    try {
      const data = req.body;

      const user = await UserModel.findOne({ email: data.email });
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "Invalid email or password" });

      const validPassword = await user.comparePassword(data.password);

      if (!validPassword)
        return res
          .status(404)
          .json({ success: false, message: "Invalid email or password" });

      if (user.isDeleted)
        return res.status(404).json({
          success: false,
          message: "This account has been deactivated",
        });

      const token = await user.generateAuthToken();

      const response = _.omit(user.toObject(), ["password", "__v"]);

      return res
        .status(201)
        .header("x-auth-token", token)
        .json({ success: true, message: "Login successful", data: response });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// edit
router.patch(
  "/edit/:id",
  [auth, validate(userUpdateSchema)],
  logIP("EDIT_PROFILE"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      if (req.user._id !== id)
        return res
          .status(400)
          .json({ success: false, message: "You cant edit this user" });

      if (data.password) {
        const user = await UserModel.findById(id);
        const hashedPassword = await user.hashPassword(data.password);
        data.password = hashedPassword;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(id, data, {
        runValidators: true,
        new: true,
      }).select("-password");

      if (!updatedUser)
        return res
          .status(404)
          .json({ success: false, message: "Failed to update" });

      return res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Phone number already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// soft delete
router.patch("/delete/:id", auth, logIP("DELETE_USER"), async (req, res) => {
  try {
    const id = req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (req.user.role !== "admin" && req.user._id !== id)
      return res.status(401).json({
        success: false,
        message: "You can't delete other users accounts",
      });

    if (req.user.role !== "admin") {
      const checkAppointments = await AppointmentModel.find({
        customer: id,
        $or: [
          { status: "pending" },
          { status: "confirmed", scheduledDate: { $gt: Date.now() } },
        ],
      });

      if (checkAppointments.length > 0)
        return res.status(400).json({
          success: false,
          message: "You can't delete your account if you have appointments",
        });
    }

    const deletedUser = await UserModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      {
        runValidators: true,
        new: true,
      },
    ).select("-password");

    if (!deletedUser)
      return res
        .status(404)
        .json({ success: false, message: "Failed to delete" });

    return res.status(200).json({ success: true, data: deletedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// un delete
router.patch(
  "/un-delete/:id",
  [auth, admin],
  logIP("UN_DELETE_USER"),
  async (req, res) => {
    try {
      const id = req.params.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const deletedUser = await UserModel.findByIdAndUpdate(
        id,
        { isDeleted: false },
        {
          runValidators: true,
          new: true,
        },
      ).select("-password");

      if (!deletedUser)
        return res
          .status(404)
          .json({ success: false, message: "Failed to delete" });

      return res.status(200).json({ success: true, data: deletedUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// Add push notification token
router.post("/push-token", auth, logIP("ADD_PUSH_TOKEN"), async (req, res) => {
  try {
    const { token, platform } = req.body;
    const userId = req.user._id;

    // Validation
    if (!token || !platform) {
      return res.status(400).send("Token and platform are required");
    }

    if (!["ios", "android"].includes(platform)) {
      return res.status(400).send("Platform must be 'ios' or 'android'");
    }

    // Remove old token if it exists (same token, different device)
    await UserModel.findByIdAndUpdate(userId, {
      $pull: {
        pushNotificationTokens: { token: token },
      },
    });

    // Add new token
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          pushNotificationTokens: {
            token: token,
            platform: platform,
            addedAt: new Date(),
          },
        },
      },
      { new: true },
    );

    if (!updatedUser) return res.status(404).send("User not found");

    return res.status(200).send({
      message: "Push token added successfully",
      tokens: updatedUser.pushNotificationTokens,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// Remove push notification token (when user logs out on a device)
router.delete(
  "/push-token/:token",
  auth,
  logIP("LOG_OUT"),
  async (req, res) => {
    try {
      const { token } = req.params;
      const userId = req.user._id;

      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          $pull: {
            pushNotificationTokens: { token: token },
          },
        },
        { new: true },
      );

      if (!updatedUser) return res.status(404).send("User not found");

      return res.status(200).send({
        message: "Push token removed successfully",
        tokens: updatedUser.pushNotificationTokens,
      });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
);

export default router;
