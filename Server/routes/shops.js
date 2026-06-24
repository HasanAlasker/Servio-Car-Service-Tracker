import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import ShopModel from "../models/shop.js";
import shopOwner from "../middleware/shopOwner.js";
import validate from "../middleware/joiValidation.js";
import { addShopSchema, editShopSchema } from "../validation/shop.js";
import UserModel from "../models/user.js";
import {
  deleteImageFromCloudinary,
  upload,
  uploadToCloudinary,
} from "../utils/cloudinary.js";
import { sendPushNotification } from "../utils/notifications.js";
import logIP from "../middleware/logIp.js";
import { haversine } from "../functions/findShopDistance.js";
import AppointmentModel from "../models/appointment.js";

const router = express.Router();

// get all verified shops
router.get("/verified", auth, logIP("GET_VERIFIED_SHOPS"), async (req, res) => {
  try {
    const shops = await ShopModel.find({
      isVerified: true,
      isDeleted: false,
    })
      .sort("-createdAt")
      .populate("owner", "name email phone role");
    return res.status(200).json({ success: true, data: shops });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// get nearby shops
router.get("/nearby", auth, logIP("GET_NEARBY_SHOPS"), async (req, res) => {
  try {
    const { lat, lng, city } = req.query;

    const query = {
      isVerified: true,
      isDeleted: false,
      ...(city && { "address.city": city.toLowerCase() }),
    };

    let shops = await ShopModel.find(query)
      .sort("-createdAt")
      .populate("owner", "name email phone role");

    if (shops.length === 0)
      return res.status(200).json({
        success: true,
        message:
          "No shops in your area, ask your favorite mechanic to join Servio!",
        data: shops,
      });

    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      shops = shops
        .map((shop) => {
          const shopLat = parseFloat(shop.lat);
          const shopLng = parseFloat(shop.lng);
          const distance = haversine(userLat, userLng, shopLat, shopLng);

          const shopObj = shop.toObject();
          shopObj.distance = parseFloat(distance.toFixed(2)); // include in response
          return shopObj;
        })
        .sort((a, b) => a.distance - b.distance);
    }

    return res.status(200).json({ success: true, data: shops });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// get all unverified shops
router.get(
  "/un-verified",
  [auth, admin],
  logIP("GET_UNVERIFIED_SHOPS"),
  async (req, res) => {
    try {
      const shops = await ShopModel.find({
        isVerified: false,
        isDeleted: false,
      })
        .sort("-createdAt")
        .populate("owner", "name email phone role");
      return res.status(200).json({ success: true, data: shops });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// get my shop
router.get(
  "/mine",
  [auth, shopOwner],
  logIP("GET_MY_SHOPS"),
  async (req, res) => {
    try {
      const userId = req.user._id;

      const myShop = await ShopModel.find({
        owner: userId,
        isVerified: true,
        isDeleted: false,
      });
      if (!myShop)
        return res
          .status(404)
          .json({ success: false, message: "Shop not found" });

      return res.status(200).json({ success: true, data: myShop });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// get deleted shops
router.get(
  "/deleted",
  [auth, admin],
  logIP("GET_DELETED_SHOPS"),
  async (req, res) => {
    try {
      const shops = await ShopModel.find({ isDeleted: true });

      return res.status(200).json({ success: true, data: shops });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// get shop by id
router.get("/:id", auth, logIP("GET_SHOP_BY_ID"), async (req, res) => {
  try {
    const id = req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shop ID",
      });
    }

    const shop = await ShopModel.findById(id).populate(
      "owner",
      "name email phone role",
    );
    if (!shop)
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });

    return res.status(200).json({ success: true, data: shop });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// open shop
router.post(
  "/openShop",
  upload.single("image"),
  [auth, validate(addShopSchema)],
  logIP("OPEN_SHOP"),
  async (req, res) => {
    let uploadedImage = null;

    try {
      const data = req.body;
      data.owner = req.user._id;
      data.isVerified = false;

      if (req.file) {
        uploadedImage = await uploadToCloudinary(req.file.buffer);
        data.image = uploadedImage.secure_url;
        data.imagePublicId = uploadedImage.public_id;
      }

      const newShop = new ShopModel(data);
      await newShop.save();

      if (!newShop)
        return res
          .status(404)
          .json({ success: false, message: "Failed to create shop" });

      try {
        const admins = await UserModel.find({ role: "admin" });

        const tokens = [];
        admins.forEach((admin) => {
          if (
            admin.pushNotificationTokens &&
            admin.pushNotificationTokens.length > 0
          ) {
            admin.pushNotificationTokens.forEach((tokenObj) => {
              tokens.push(tokenObj.token);
            });
          }
        });

        if (tokens.length > 0) {
          await sendPushNotification(
            tokens,
            `New Shop`,
            `Someone sent a shop opening request!`,
          );
          console.log("📤 Attempting to send notification to:", tokens);
        }
      } catch (notificationError) {
        console.error("Failed to send push notification:", notificationError);
      }

      return res.status(201).json({
        success: true,
        message: "Admins will review your request soon",
        data: newShop,
      });
    } catch (error) {
      console.error(error);
      // If post creation fails and image was uploaded, delete it from Cloudinary
      if (uploadedImage && uploadedImage.public_id) {
        await deleteImageFromCloudinary(uploadedImage.public_id);
      }
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Shop number already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// edit shop
router.patch(
  "/edit/:id",
  upload.single("image"),
  [auth, shopOwner, validate(editShopSchema)],
  logIP("EDIT_SHOP"),
  async (req, res) => {
    let uploadedImage = null;

    try {
      const id = req.params.id;
      const data = req.body;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid shop ID",
        });
      }

      const shop = await ShopModel.findById(id);
      if (shop.owner.toString() !== req.user._id.toString())
        return res
          .status(403)
          .json({ success: false, message: "You can only update your shop" });

      if (req.file) {
        uploadedImage = await uploadToCloudinary(req.file.buffer);
        data.image = uploadedImage.secure_url;
        data.imagePublicId = uploadedImage.public_id;
      }

      const updatedShop = await ShopModel.findByIdAndUpdate(id, data, {
        runValidators: true,
        new: true,
      });

      if (!updatedShop)
        return res
          .status(404)
          .json({ success: false, message: "Failed to update shop" });

      return res.status(200).json({ success: true, data: updatedShop });
    } catch (error) {
      console.error(error);
      // If post creation fails and image was uploaded, delete it from Cloudinary
      if (uploadedImage && uploadedImage.public_id) {
        await deleteImageFromCloudinary(uploadedImage.public_id);
      }
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Shop number already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// delete shop
router.patch("/delete/:id", auth, logIP("DELETE_SHOP"), async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shop ID",
      });
    }

    const deletedShop = await ShopModel.findById(id);

    if (!deletedShop)
      return res
        .status(404)
        .json({ success: false, message: "Failed to delete shop" });

    if (
      user.role !== "admin" &&
      user._id.toString() !== deletedShop.owner._id.toString()
    )
      return res.status(401).json({
        success: false,
        message: "You can't delete shop",
      });

    deletedShop.isDeleted = true;
    deletedShop.isVerified = false;
    await deletedShop.save();

    if (user.role === "admin") {
      try {
        const shopOwner = await UserModel.findById(deletedShop.owner._id);

        if (
          shopOwner &&
          shopOwner.pushNotificationTokens &&
          shopOwner.pushNotificationTokens.length > 0
        ) {
          const tokens = shopOwner.pushNotificationTokens.map(
            (tokenObj) => tokenObj.token,
          );

          await sendPushNotification(
            tokens,
            `Shop Deleted`,
            `Servio team has deleted your shop for a policy violation!`,
          );
        }
      } catch (notificationError) {
        console.error("Failed to send push notification:", notificationError);
      }
    }

    return res.status(200).json({ success: true, data: deletedShop });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// undelete and verify shop
router.patch(
  "/un-delete/:id",
  [auth, admin],
  logIP("UN_DELETE_SHOP"),
  async (req, res) => {
    try {
      const id = req.params.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid shop ID",
        });
      }

      const deletedShop = await ShopModel.findByIdAndUpdate(
        id,
        { isDeleted: false, isVerified: true },
        {
          runValidators: true,
          new: true,
        },
      );

      if (!deletedShop)
        return res
          .status(404)
          .json({ success: false, message: "Failed to un-delete shop" });

      try {
        const shopOwner = await UserModel.findById(deletedShop.owner._id);

        if (
          shopOwner &&
          shopOwner.pushNotificationTokens &&
          shopOwner.pushNotificationTokens.length > 0
        ) {
          const tokens = shopOwner.pushNotificationTokens.map(
            (tokenObj) => tokenObj.token,
          );

          await sendPushNotification(
            tokens,
            `Shop Restored`,
            `Servio team has restored your shop for after investigation!`,
          );
          console.log("📤 Attempting to send notification to:", tokens);
        }
      } catch (notificationError) {
        console.error("Failed to send push notification:", notificationError);
      }

      return res.status(200).json({ success: true, data: deletedShop });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// verify shop & make user shopOwner
router.patch(
  "/verify/:id",
  [auth, admin],
  logIP("VERIFY_SHOP"),
  async (req, res) => {
    try {
      const id = req.params.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid shop ID",
        });
      }

      const shop = await ShopModel.findById(id);
      if (!shop)
        return res
          .status(404)
          .json({ success: false, message: "Shop not found" });

      await UserModel.findByIdAndUpdate(
        shop.owner,
        {
          role: "shopOwner",
        },
        { runValidators: true, new: true },
      );

      const verifiedShop = await ShopModel.findByIdAndUpdate(
        id,
        { isVerified: true },
        {
          runValidators: true,
          new: true,
        },
      );

      if (!verifiedShop)
        return res
          .status(404)
          .json({ success: false, message: "Failed to verify shop" });

      try {
        const shopOwner = await UserModel.findById(shop.owner._id);

        if (
          shopOwner &&
          shopOwner.pushNotificationTokens &&
          shopOwner.pushNotificationTokens.length > 0
        ) {
          const tokens = shopOwner.pushNotificationTokens.map(
            (tokenObj) => tokenObj.token,
          );

          await sendPushNotification(
            tokens,
            `Shop Request Confirmed`,
            `Servio team has reviewed and confirmed your shop opening request!`,
          );
          console.log("📤 Attempting to send notification to:", tokens);
        }
      } catch (notificationError) {
        console.error("Failed to send push notification:", notificationError);
      }

      return res.status(200).json({ success: true, data: verifiedShop });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// rate shop
router.patch("/rate/:id", auth, async (req, res) => {
  try {
    const shopId = req.params.id;
    const { rating, appointmentId } = req.body;

    if (!shopId || !mongoose.Types.ObjectId.isValid(shopId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid shop ID" });
    }

    if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid appointment ID" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const appointment = await AppointmentModel.findById(appointmentId);
    if (!appointment)
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    if (appointment.isRated)
      return res
        .status(400)
        .json({ success: false, message: "Appointment already rated!" });

    const shop = await ShopModel.findById(shopId);
    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });
    }

    appointment.isRated = true;
    const ratedAppointment = await appointment.save();
    if (!ratedAppointment) {
      return res.status(400).json({ success: false, message: "Error saving" });
    }

    const currentTotal = shop.rating * shop.ratingCount;
    const newRatingCount = shop.ratingCount + 1;
    const newAverageRating = (currentTotal + rating) / newRatingCount;

    shop.rating = newAverageRating;
    shop.ratingCount = newRatingCount;

    const ratedShop = await shop.save();
    if (!ratedShop) {
      return res.status(400).json({ success: false, message: "Error saving" });
    }

    res.status(200).json({
      message: "Rating submitted successfully",
      rating: ratedShop.rating,
      ratingCount: ratedShop.ratingCount,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

export default router;
