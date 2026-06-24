import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import UpcomingServiceModel from "../models/upcomingService.js";
import logIP from "../middleware/logIp.js";

const router = express.Router();

// get my upcoming services
router.get("/", auth, logIP("GET_UPCOMING_SERVICES"), async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const services = await UpcomingServiceModel.find({
      customer: userId,
      status: { $nin: ["not active"] },
    })
      .sort({ "dueBy.Date": 1 })
      .populate("car", "make name model plateNumber mileage unit")
      .populate(
        "parts",
        "name lastChangeDate lastChangeMileage recommendedChangeInterval",
      );

    return res.status(200).json({ success: true, data: services });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.get("/wake-up", async (req, res) => {
  try {
    return res.status(200).json({ success: true, message: "Awake" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// dont send notifications
router.patch(
  "/dont-remind/:id",
  auth,
  logIP("DON'T_REMIND"),
  async (req, res) => {
    try {
      const id = req.params.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource ID",
        });
      }

      const service = await UpcomingServiceModel.findById(id);
      if (!service)
        return res
          .status(404)
          .json({ success: false, message: "Service not found" });

      service.reminder = false;
      await service.save();

      return res.status(200).json({ success: true, data: service });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// send notifications
router.patch("/remind/:id", auth, logIP("REMIND"), async (req, res) => {
  try {
    const id = req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    const service = await UpcomingServiceModel.findById(id);
    if (!service)
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });

    service.reminder = true;
    await service.save();

    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;
