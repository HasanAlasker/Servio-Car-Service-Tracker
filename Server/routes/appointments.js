import express from "express";
import mongoose from "mongoose";
import admin from "../middleware/admin.js";
import auth from "../middleware/auth.js";
import AppointmentModel from "../models/appointment.js";
import shopOwner from "../middleware/shopOwner.js";
import validate from "../middleware/joiValidation.js";
import {
  createAppointmentSchema,
  editAppointmentSchema,
} from "../validation/appointment.js";
import ShopModel from "../models/shop.js";
import { SlotModel } from "../models/slots.js";
import { deletedSlot } from "../services/deleteSlot.js";
import UserModel from "../models/user.js";
import { sendPushNotification } from "../utils/notifications.js";
import { getTimeFromDate } from "../functions/formatTime.js";
import logIP from "../middleware/logIp.js";
import CarModel from "../models/car.js";
import { paginate } from "../middleware/paginate.js";

const router = express.Router();

// get all
router.get(
  "/all",
  [auth, admin],
  logIP("GET_ALL_APPOINTMENTS"),
  async (req, res) => {
    try {
      const appointments = await AppointmentModel.find();
      return res.status(200).json({ success: true, data: appointments });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// get upcoming
router.get(
  "/upcoming",
  auth,
  logIP("GET_UPCOMING_APPOINTMENTS"),
  async (req, res) => {
    try {
      const userId = req.user._id;

      const upcoming = await AppointmentModel.find({
        customer: userId,
        $and: [
          { scheduledDate: { $gte: new Date() } },
          { status: { $nin: ["completed", "canceled", "rejected"] } },
        ],
      })
        .sort({ scheduledDate: 1 })
        .populate("car", "make name model plateNumber mileage color")
        .populate("customer", "name phone")
        .populate("shop")
        .populate("serviceParts");

      return res.status(200).json({ success: true, data: upcoming });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);


// get past
router.get("/past", auth, logIP("GET_PAST_APPOINTMENTS"), async (req, res) => {
  try {
    const userId = req.user._id;

    const past = await AppointmentModel.find({
      customer: userId,
      isDeleted: false,
      $or: [
        { scheduledDate: { $lte: new Date() } },
        { status: { $in: ["completed", "no-show", "canceled", "rejected"] } },
      ],
    })
      .sort("-scheduledDate")
      .populate("car", "make name model plateNumber mileage color")
      .populate("customer", "name phone")
      .populate("shop", "owner name services address rating ratingCount")
      .populate("serviceParts", "name");

    return res.status(200).json({ success: true, data: past });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// get completed for customer (for rating / report)
router.get("/completed", auth, logIP("GET_COMPLETED"), async (req, res) => {
  try {
    const userId = req.user._id;

    const completed = await AppointmentModel.find({
      customer: userId,
      $and: [
        { scheduledDate: { $lte: new Date() } },
        { status: { $in: ["completed", "confirmed"] } },
        { isRated: false },
      ],
    })
      .sort("-scheduledDate")
      .populate("car", "make name model plateNumber mileage color")
      .populate("customer", "name phone")
      .populate("shop", "owner name services address rating ratingCount")
      .populate("serviceParts", "name");

    return res.status(200).json({ success: true, data: completed });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// get call to action
router.get(
  "/call-to-action",
  [auth, shopOwner],
  logIP("GET_CALL_TO_ACTION_APPOINTMENTS"),
  async (req, res) => {
    try {
      const shops = await ShopModel.find({ owner: req.user._id });
      if (!shops.length) {
        return res
          .status(404)
          .json({ success: false, message: "No shops found" });
      }

      const shopIds = shops.map((s) => s._id);

      const confimed = await AppointmentModel.find({
        shop: { $in: shopIds },
        status: "confirmed",
        scheduledDate: { $lte: new Date() },
      })
        .sort("scheduledDate")
        .populate("car", "make name model plateNumber mileage color")
        .populate("customer", "name phone")
        .populate("shop", "owner name services address rating ratingCount")
        .populate("serviceParts");

      return res.status(200).json({ success: true, data: confimed });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// get upcoming (pagination)
router.get(
  "/v2/upcoming",
  auth,
  logIP("GET_UPCOMING_APPOINTMENTS"),
  paginate((req) => ({
    model: AppointmentModel,
    filter: {
      customer: req.user._id,
      scheduledDate: { $gte: new Date() },
      status: { $nin: ["completed", "canceled", "rejected"] },
    },
    sort: { scheduledDate: 1 },
    populate: [
      { path: "car", select: "make name model plateNumber mileage color" },
      { path: "customer", select: "name phone" },
      { path: "shop" },
      { path: "serviceParts" },
    ],
  })),
  (req, res) => {
    return res.status(200).json({ success: true, data: res.paginate });
  },
);

// get car history
router.get("/history/:id", auth, logIP("GET_CAR_HISTORY"), async (req, res) => {
  try {
    const userId = req.user._id;
    const carId = req.params.id;

    const car = await CarModel.findById(carId);
    if (!car)
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    if (car.owner._id.toString() !== userId.toString())
      return res.status(403).json({
        success: false,
        message: "You're not the car owner",
      });

    const past = await AppointmentModel.find({
      car: carId,
      $and: [
        { scheduledDate: { $lte: new Date() } },
        { status: { $in: ["completed", "confirmed"] } },
      ],
    })
      .sort("-scheduledDate")
      .populate("car", "make name model plateNumber mileage color")
      .populate("customer", "name phone")
      .populate("shop", "owner name services address rating ratingCount")
      .populate("serviceParts", "name");

    return res.status(200).json({ success: true, data: past });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// get confiremd
router.get(
  "/confirmed/:id",
  [auth, shopOwner],
  logIP("GET_CONFIRMED_APPOINTMENTS"),
  async (req, res) => {
    try {
      const shopId = req.params.id;

      const confimed = await AppointmentModel.find({
        shop: shopId,
        status: "confirmed",
      })
        .sort("scheduledDate")
        .populate("car", "make name model plateNumber mileage color")
        .populate("customer", "name phone")
        .populate("shop", "owner name services address rating ratingCount")
        .populate("serviceParts");

      return res.status(200).json({ success: true, data: confimed });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// get comleted
router.get(
  "/completed/:id",
  [auth, shopOwner],
  logIP("GET_COMPLETED_APPOINTMENTS"),
  async (req, res) => {
    try {
      const shopId = req.params.id;

      const completed = await AppointmentModel.find({
        shop: shopId,
        status: "completed",
      })
        .sort("-createdAt")
        .populate("car", "make name model plateNumber mileage color")
        .populate("customer", "name phone")
        .populate("shop", "owner name services address rating ratingCount")
        .populate("serviceParts");

      return res.status(200).json({ success: true, data: completed });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// get pending
router.get(
  "/pending/:id",
  [auth, shopOwner],
  logIP("GET_PENDING_APPOINTMENTS"),
  async (req, res) => {
    try {
      const shopId = req.params.id;

      const pending = await AppointmentModel.find({
        shop: shopId,
        status: "pending",
        isRejected: false,
      })
        .populate("car", "make name model plateNumber mileage color")
        .populate("customer", "name phone")
        .populate("shop", "owner name services address rating ratingCount")
        .populate("serviceParts");

      return res.status(200).json({ success: true, data: pending });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// make appointment
router.post(
  "/book",
  [auth, validate(createAppointmentSchema)],
  logIP("BOOK_APPOINTMENT"),
  async (req, res) => {
    try {
      const data = req.body;
      data.customer = req.user._id;

      const shop = await ShopModel.findById(data.shop);
      if (!shop) {
        return res.status(404).json({
          success: false,
          message: "Shop not found",
        });
      }

      if (shop.isDeleted)
        return res
          .status(400)
          .json({ success: false, message: "Shop was deleted" });

      const appointment = new AppointmentModel({
        shop: data.shop,
        scheduledDate: data.scheduledDate,
        customer: data.customer,
        car: data.car,
        serviceParts: data.serviceParts,
      });
      await appointment.save();

      const [hours, minutes] = data.time.split(":");
      const totalMinutes =
        parseInt(hours, 10) * 60 + parseInt(minutes, 10) + 30;
      const toTime = `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;

      const newSlot = new SlotModel({
        shop: data.shop,
        appointment: appointment._id,
        date: data.scheduledDate,
        from: data.time,
        to: toTime,
      });
      await newSlot.save();

      if (!appointment)
        res
          .status(400)
          .json({ success: false, message: "Failed to make appointment" });

      try {
        const shop = await ShopModel.findById(appointment.shop._id);
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
            `New Appointment`,
            `Someone booked an appointment in ${shop.name} at ${getTimeFromDate(appointment.scheduledDate)}!`,
          );
          console.log("📤 Attempting to send notification to:", tokens);
        }
      } catch (notificationError) {
        console.error("Failed to send push notification:", notificationError);
      }

      return res.status(201).json({ success: true, data: appointment });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// delete many (past)
router.patch(
  "/delete-many",
  auth,
  logIP("DELETE_APPOINTMENTS"),
  async (req, res) => {
    try {
      const userId = req.user._id;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const appointments = await AppointmentModel.updateMany(
        {
          customer: userId,
          scheduledDate: { $lt: new Date() },
        },
        { $set: { isDeleted: true } },
      );

      if (appointments.modifiedCount === 0)
        return res
          .status(200)
          .json({ success: true, message: "No past appointments" });

      return res.status(200).json({
        success: true,
        message: "Deleted all past appointments successfully",
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

// delete one (past)
router.patch(
  "/delete/:id",
  auth,
  logIP("DELETE_ONE_APPOINTMENT"),
  async (req, res) => {
    try {
      const id = req.params.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid appointment ID",
        });
      }

      const appointment = await AppointmentModel.findById(id);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      if (appointment.customer.toString() !== req.user._id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }

      const isActiveStatus = ![
        "canceled",
        "rejected",
        "no-show",
        "completed",
      ].includes(appointment.status);
      const isFuture = new Date(appointment.scheduledDate) > Date.now();

      if (isActiveStatus && isFuture) {
        return res.status(400).json({
          success: false,
          message: "You can't delete an appointment unless it's in the past",
        });
      }

      appointment.isDeleted = true;
      const saved = await appointment.save();

      if (!saved)
        return res
          .status(400)
          .json({ success: false, message: "Failed to delete appointment" });

      return res.status(200).json({ success: true, data: appointment });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// confirm appointment (shopOwner)
router.patch(
  "/confirm/:id",
  [auth, shopOwner, validate(editAppointmentSchema)],
  logIP("CONFIRM_APPOINTMENT"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const to = req.body.to;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid car ID",
        });
      }

      const confirmed = await AppointmentModel.findByIdAndUpdate(
        id,
        {
          status: "confirmed",
        },
        { runValidators: true, new: true },
      );

      const slot = await SlotModel.findOne({ appointment: confirmed._id });

      const confirmedSlot = await SlotModel.findByIdAndUpdate(
        slot._id,
        {
          to: to,
        },
        { runValidators: true, new: true },
      );

      if (!confirmed || !confirmedSlot)
        res
          .status(400)
          .json({ success: false, message: "Failed to confirm appointment" });

      try {
        const customer = await UserModel.findById(confirmed.customer._id);
        const shop = await ShopModel.findById(confirmed.shop._id);

        if (
          customer &&
          customer.pushNotificationTokens &&
          customer.pushNotificationTokens.length > 0
        ) {
          const tokens = customer.pushNotificationTokens.map(
            (tokenObj) => tokenObj.token,
          );

          await sendPushNotification(
            tokens,
            `Appointment Confirmed`,
            `${shop.name} confirmed your appointment at ${getTimeFromDate(confirmed.scheduledDate)}!`,
          );
          console.log("📤 Attempting to send notification to:", tokens);
        }
      } catch (notificationError) {
        console.error("Failed to send push notification:", notificationError);
      }

      return res.status(200).json({ success: true, data: confirmed });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// reject appointment (shopOwner)
router.patch(
  "/reject/:id",
  [auth, shopOwner],
  logIP("REJECT_APPOINTMENT"),
  async (req, res) => {
    try {
      const id = req.params.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid appointment ID", // Fixed message
        });
      }

      const rejected = await AppointmentModel.findByIdAndUpdate(
        id,
        {
          isRejected: true,
          status: "rejected",
        },
        { runValidators: true, new: true },
      );

      if (!rejected) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      const slot = await SlotModel.findOne({ appointment: rejected._id });
      if (slot) {
        await deletedSlot(slot._id);
      }

      try {
        const customer = await UserModel.findById(rejected.customer._id);
        const shop = await ShopModel.findById(rejected.shop._id);

        if (
          customer &&
          customer.pushNotificationTokens &&
          customer.pushNotificationTokens.length > 0
        ) {
          const tokens = customer.pushNotificationTokens.map(
            (tokenObj) => tokenObj.token,
          );

          await sendPushNotification(
            tokens,
            `Appointment Rejected`,
            `${shop.name} rejected your appointment at ${getTimeFromDate(rejected.scheduledDate)}, try another time!`,
          );
          console.log("📤 Attempting to send notification to:", tokens);
        }
      } catch (notificationError) {
        console.error("Failed to send push notification:", notificationError);
      }

      return res.status(200).json({ success: true, data: rejected });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// mark completed (shopOwner)
router.patch(
  "/mark-completed/:id",
  [auth, shopOwner, validate(editAppointmentSchema)],
  logIP("COMPLETE_APPOINTMENT"),
  async (req, res) => {
    try {
      const id = req.params.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid car ID",
        });
      }

      const completed = await AppointmentModel.findByIdAndUpdate(
        id,
        {
          status: "completed",
        },
        { runValidators: true, new: true },
      );

      if (!completed)
        res
          .status(400)
          .json({ success: false, message: "Failed to confirm appointment" });

      const slot = await SlotModel.findOne({ appointment: completed._id });
      if (slot) {
        await deletedSlot(slot._id);
      }

      try {
        const customer = await UserModel.findById(completed.customer._id);
        const shop = await ShopModel.findById(completed.shop._id);

        if (
          customer &&
          customer.pushNotificationTokens &&
          customer.pushNotificationTokens.length > 0
        ) {
          const tokens = customer.pushNotificationTokens.map(
            (tokenObj) => tokenObj.token,
          );

          await sendPushNotification(
            tokens,
            `Appointment Completed`,
            `${shop.name} marked your appointment at ${getTimeFromDate(completed.scheduledDate)} as completed!`,
          );
          console.log("📤 Attempting to send notification to:", tokens);
        }
      } catch (notificationError) {
        console.error("Failed to send push notification:", notificationError);
      }

      return res.status(200).json({ success: true, data: completed });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// mark no-show (shopOwner)
router.patch(
  "/no-show/:id",
  [auth, shopOwner, validate(editAppointmentSchema)],
  logIP("NO_SHOW_APPOINTMENT"),
  async (req, res) => {
    try {
      const id = req.params.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid car ID",
        });
      }

      const noShow = await AppointmentModel.findByIdAndUpdate(
        id,
        {
          status: "no-show",
        },
        { runValidators: true, new: true },
      );

      if (!noShow)
        res
          .status(400)
          .json({ success: false, message: "Failed to confirm appointment" });

      const slot = await SlotModel.findOne({ appointment: noShow._id });
      if (slot) {
        await deletedSlot(slot._id);
      }

      try {
        const customer = await UserModel.findById(noShow.customer._id);
        const shop = await ShopModel.findById(noShow.shop._id);

        if (
          customer &&
          customer.pushNotificationTokens &&
          customer.pushNotificationTokens.length > 0
        ) {
          const tokens = customer.pushNotificationTokens.map(
            (tokenObj) => tokenObj.token,
          );

          await sendPushNotification(
            tokens,
            `Appointment Not Attended`,
            `${shop.name} marked your appointment at ${getTimeFromDate(noShow.scheduledDate)} as no-show!`,
          );
          console.log("📤 Attempting to send notification to:", tokens);
        }
      } catch (notificationError) {
        console.error("Failed to send push notification:", notificationError);
      }

      return res.status(200).json({ success: true, data: noShow });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// cancel (car owner if not accepted yet)

router.patch(
  "/cancel/:id",
  auth,
  logIP("CANCEL_APPOINTMENT"),
  async (req, res) => {
    try {
      const id = req.params.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid appointment ID",
        });
      }

      const appointment = await AppointmentModel.findById(id);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      if (appointment.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "You can't cancel an appointment unless it's pending",
        });
      }

      const canceled = await AppointmentModel.findByIdAndUpdate(
        id,
        {
          status: "canceled",
        },
        { runValidators: true, new: true },
      );
      if (!canceled)
        res
          .status(400)
          .json({ success: false, message: "Failed to confirm appointment" });

      const slot = await SlotModel.findOne({ appointment: canceled._id });
      if (slot) {
        await deletedSlot(slot._id);
      }

      return res.status(200).json({ success: true, data: canceled });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

export default router;
