import express from "express";
import auth from "../middleware/auth.js";
import { SlotModel } from "../models/slots.js";
import logIP from "../middleware/logIp.js";
import ShopModel from "../models/shop.js";
import mongoose from "mongoose";

const router = express.Router();

// GET /busy/:id?date=YYYY-MM-DD
// Returns all 30-min intervals for the shop's open hours that day,
// marking each as busy or free based on saved slots.
router.get("/:id", auth, logIP("GET_SLOTS"), async (req, res) => {
  try {
    const shopId = req.params.id;
    const { date } = req.query;

    if (!shopId || !mongoose.Types.ObjectId.isValid(shopId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid shop ID" });
    }

    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Date is required" });
    }

    const shop = await ShopModel.findById(shopId);
    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Shop not found" });
    }

    // Match the day name to the date provided
    const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const dayOfWeek = dayNames[new Date(date).getDay()];
    const todayHours = shop.openHours.find((h) => h.day === dayOfWeek);

    if (
      !todayHours ||
      !todayHours.isOpen ||
      !todayHours.from ||
      !todayHours.to
    ) {
      return res.status(200).json({
        success: true,
        data: {
          isOpen: false,
          slots: [],
        },
      });
    }

    // Fetch all booked slots for that day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedSlots = await SlotModel.find({
      shop: shopId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // Helper: "09:00" -> minutes since midnight
    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    // Helper: minutes -> "09:00"
    const toTimeStr = (minutes) => {
      const h = Math.floor(minutes / 60)
        .toString()
        .padStart(2, "0");
      const m = (minutes % 60).toString().padStart(2, "0");
      return `${h}:${m}`;
    };

    const openMinutes = toMinutes(todayHours.from);
    const closeMinutes = toMinutes(todayHours.to);
    const INTERVAL = 30;

    // Build all 30-min intervals for the open window
    const allSlots = [];
    for (let t = openMinutes; t + INTERVAL <= closeMinutes; t += INTERVAL) {
      const slotFrom = toTimeStr(t);
      const slotTo = toTimeStr(t + INTERVAL);

      // A generated slot is busy if ANY booked slot overlaps it.
      // Overlap condition: bookedFrom < slotTo && bookedTo > slotFrom
      const isBusy = bookedSlots.some((booked) => {
        const bookedFrom = toMinutes(booked.from);
        const bookedTo = toMinutes(booked.to);
        return bookedFrom < t + INTERVAL && bookedTo > t;
      });

      allSlots.push({ from: slotFrom, to: slotTo, isBusy });
    }

    return res.status(200).json({
      success: true,
      data: {
        isOpen: true,
        openHours: { from: todayHours.from, to: todayHours.to },
        slots: allSlots,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// check slot
router.post("/checkSlot/:id", auth, logIP("CHECK_SLOT"), async (req, res) => {
  try {
    const shopId = req.params.id;
    const { date, from } = req.body;

    if (!date || !from) {
      return res.status(400).json({
        success: false,
        message: "Date and from time are required",
      });
    }

    // Get the date part only (ignore time for date matching)
    const appointmentDate = new Date(date);
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Calculate end time as string (2 hours after from)
    const [hours, minutes] = from.split(":");
    const endHour = (parseInt(hours, 10) + 2).toString().padStart(2, "0");
    const to = `${endHour}:${minutes}`;

    // Find overlapping slots on the same date
    const overlappingSlots = await SlotModel.find({
      shop: shopId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      $or: [
        // New slot starts during existing slot
        {
          from: { $lte: from },
          to: { $gt: from },
        },
        // New slot ends during existing slot
        {
          from: { $lt: to },
          to: { $gte: to },
        },
        // Existing slot is completely inside new slot
        {
          from: { $gte: from },
          to: { $lte: to },
        },
      ],
    });

    if (overlappingSlots.length > 0) {
      return res.status(200).json({
        success: true,
        available: false,
        message: "Time slot is already booked",
        overlappingSlots: overlappingSlots,
      });
    }

    return res.status(200).json({
      success: true,
      available: true,
      message: "Time slot is available",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;
