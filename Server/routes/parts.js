import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import PartModel from "../models/part.js";
import validate from "../middleware/joiValidation.js";
import { addPartSchema, editPartSchema } from "../validation/part.js";
import { updateServicesForCar } from "../services/upcomingServiceManager.js";
import logIP from "../middleware/logIp.js";
import CarModel from "../models/car.js";
import UpcomingServiceModel from "../models/upcomingService.js";

const router = express.Router();

// get part by id
router.get("/:id", auth, logIP("GET_PART_BY_ID"), async (req, res) => {
  try {
    const id = req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    const part = await PartModel.findById(id).populate(
      "car",
      "owner make name model plateNumber mileage",
    );
    if (!part) {
      return res.status(404).json({
        success: false,
        message: "Part not found",
      });
    }

    return res.status(200).json({ success: true, data: part });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// get tracked parts for a car
router.get("/tracked/:id", auth, logIP("GET_CAR_PARTS"), async (req, res) => {
  try {
    const carId = req.params.id;

    if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    const parts = await PartModel.find({
      car: carId,
      isTracked: true,
    }).populate("car", "owner make name model plateNumber mileage");

    return res.status(200).json({ success: true, data: parts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// get my untracked parts
router.get(
  "/un-tracked/:id",
  auth,
  logIP("GET_DELETED_CAR_PARTS"),
  async (req, res) => {
    try {
      const carId = req.params.id;

      if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource ID",
        });
      }

      const parts = await PartModel.find({
        car: carId,
        isTracked: false,
      }).populate("car", "owner make name model plateNumber mileage");

      return res.status(200).json({ success: true, data: parts });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// add part
router.post(
  "/add/:id",
  [auth, validate(addPartSchema)],
  logIP("ADD_PART"),
  async (req, res) => {
    try {
      const carId = req.params.id;
      const data = req.body;

      data.car = carId;

      if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource ID",
        });
      }

      const newPart = new PartModel(data);
      if (!newPart) {
        return res.status(404).json({
          success: false,
          message: "Part not added",
        });
      }

      updateServicesForCar(carId).catch((err) =>
        console.error(`Failed to recalculate services for car ${carId}:`, err),
      );

      await newPart.save();

      return res.status(201).json({ success: true, data: newPart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// edit part
router.patch(
  "/edit/:id",
  [auth, validate(editPartSchema)],
  logIP("EDIT_PART"),
  async (req, res) => {
    try {
      const partId = req.params.id;
      const data = req.body;

      if (!partId || !mongoose.Types.ObjectId.isValid(partId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource ID",
        });
      }

      const part = await PartModel.findById(partId);
      if (!part) {
        return res.status(404).json({
          success: false,
          message: "Part not found",
        });
      }

      const updatedPart = await PartModel.findByIdAndUpdate(partId, data, {
        runValidators: true,
        new: true,
      });
      if (!updatedPart) {
        return res.status(404).json({
          success: false,
          message: "Failed to edit part",
        });
      }

      updateServicesForCar(updatedPart.car._id).catch((err) =>
        console.error(`Failed to recalculate services for car ${carId}:`, err),
      );

      return res.status(200).json({ success: true, data: updatedPart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// untrack part
router.patch(
  "/un-track/:id",
  [auth, validate(editPartSchema)],
  logIP("UN_TRACK_PART"),
  async (req, res) => {
    try {
      const partId = req.params.id;

      if (!partId || !mongoose.Types.ObjectId.isValid(partId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource ID",
        });
      }

      const part = await PartModel.findById(partId);
      if (!part) {
        return res.status(404).json({
          success: false,
          message: "Part not found",
        });
      }

      const updatedPart = await PartModel.findByIdAndUpdate(
        partId,
        { isTracked: false },
        {
          runValidators: true,
          new: true,
        },
      );
      if (!updatedPart) {
        return res.status(404).json({
          success: false,
          message: "Failed to edit part",
        });
      }

      const deletedService = await UpcomingServiceModel.deleteMany({
        car: updatedPart.car._id,
      });

      updateServicesForCar(part.car._id).catch((err) =>
        console.error(`Failed to recalculate services for car ${carId}:`, err),
      );

      return res.status(200).json({ success: true, data: updatedPart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// part fixed
router.patch("/service/:id", auth, async (req, res) => {
  try {
    const partId = req.params.id;
    const part = await PartModel.findById(partId);
    if (!part)
      return res
        .status(404)
        .json({ success: false, message: "Part not found" });

    const carId = part.car._id;
    const car = await CarModel.findById(carId);
    if (car.owner._id.toString() !== req.user._id.toString())
      return res.status(401).json({
        success: false,
        message: "You are not allowed to edit this part",
      });

    part.lastChangeDate = new Date();
    part.lastChangeMileage = car.mileage;
    const savedPart = await part.save();

    if (!savedPart)
      return res
        .status(400)
        .json({ success: false, message: "Part not edited" });

    updateServicesForCar(carId).catch((err) =>
      console.error(`Failed to recalculate services for car ${carId}:`, err),
    );

    return res.status(200).json({ success: true, data: savedPart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;
