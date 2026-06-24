import express from "express";
import mongoose from "mongoose";
import CarMakeModel from "../models/carMake.js";
import CarModel from "../models/car.js";
import validate from "../middleware/joiValidation.js";
import admin from "../middleware/admin.js";
import auth from "../middleware/auth.js";
import { addCarSchema, editCarSchema } from "../validation/car.js";
import { updateServicesForCar } from "../services/upcomingServiceManager.js";
import {
  deleteImageFromCloudinary,
  upload,
  uploadToCloudinary,
} from "../utils/cloudinary.js";
import logIP from "../middleware/logIp.js";
import UpcomingServiceModel from "../models/upcomingService.js";
import PartModel from "../models/part.js";

const router = express.Router();

// Get all cars (admin only)
router.get("/all", [auth, admin], logIP("GET_ALL_CARS"), async (req, res) => {
  try {
    const cars = await CarModel.find({ isDeleted: false });
    return res.status(200).json({ success: true, data: cars });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Get car makes and models
router.get("/car-makes", auth, logIP("GET_CAR_MAKES"), async (req, res) => {
  try {
    const carsData = await CarMakeModel.find()
      .select("make name")
      .sort({ name: 1 });

    if (!carsData || carsData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cars data not found",
      });
    }

    return res.status(200).json({ success: true, data: carsData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Get my cars
router.get("/mine", auth, logIP("GET_MY_CARS"), async (req, res) => {
  try {
    const userId = req.user._id;

    const myCars = await CarModel.find({
      owner: userId,
      isDeleted: false,
    }).sort("-createdAt");

    return res.status(200).json({ success: true, data: myCars });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Get car by id
router.get("/:id", auth, logIP("GET_CAR_BY_ID"), async (req, res) => {
  try {
    const id = req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID",
      });
    }

    const myCar = await CarModel.findOne({
      _id: id,
      isDeleted: false,
    }).populate("owner", "name email phone");

    if (!myCar) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    if (
      myCar.owner._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this car",
      });
    }

    return res.status(200).json({ success: true, data: myCar });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Add car
router.post(
  "/add",
  upload.single("image"),
  [auth, validate(addCarSchema)],
  logIP("ADD_CAR"),
  async (req, res) => {
    let uploadedImage = null;

    try {
      const data = req.body;
      data.owner = req.user._id;

      // Validate that make and model exist
      const carMake = await CarMakeModel.findOne({
        make: data.make,
      });

      if (!carMake) {
        return res.status(400).json({
          success: false,
          message: "Invalid car make",
        });
      }

      if (!carMake.name.includes(data.name)) {
        return res.status(400).json({
          success: false,
          message: `${data.name} is not a valid model for ${data.make}`,
        });
      }

      if (req.file) {
        uploadedImage = await uploadToCloudinary(req.file.buffer);
        data.image = uploadedImage.secure_url;
        data.imagePublicId = uploadedImage.public_id;
      }

      const newCar = new CarModel(data);

      await newCar.save();

      return res.status(201).json({ success: true, data: newCar });
    } catch (error) {
      console.log(error);

      // If post creation fails and image was uploaded, delete it from Cloudinary
      if (uploadedImage && uploadedImage.public_id) {
        await deleteImageFromCloudinary(uploadedImage.public_id);
      }

      // Handle duplicate plate number error
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Plate number already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// Edit car
router.patch(
  "/edit/:id",
  upload.single("image"),
  [auth, validate(editCarSchema)],
  logIP("EDIT_CAR"),
  async (req, res) => {
    let uploadedImage = null;

    try {
      const carId = req.params.id;
      const userId = req.user._id;
      const data = req.body;

      if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid car ID",
        });
      }

      const car = await CarModel.findOne({
        _id: carId,
        isDeleted: false,
      });

      if (!car) {
        return res.status(404).json({
          success: false,
          message: "Car not found",
        });
      }

      if (car.owner.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only edit your cars",
        });
      }

      if (req.file) {
        uploadedImage = await uploadToCloudinary(req.file.buffer);
        data.image = uploadedImage.secure_url;
        data.imagePublicId = uploadedImage.public_id;
      }

      const updatedCar = await CarModel.findByIdAndUpdate(carId, data, {
        runValidators: true,
        new: true,
      });

      if (!updatedCar) {
        return res.status(500).json({
          success: false,
          message: "Car was not updated",
        });
      }

      updateServicesForCar(carId).catch((err) =>
        console.error(`Failed to recalculate services for car ${carId}:`, err),
      );

      return res.status(200).json({ success: true, data: updatedCar });
    } catch (error) {
      console.log(error);

      // If post creation fails and image was uploaded, delete it from Cloudinary
      if (uploadedImage && uploadedImage.public_id) {
        await deleteImageFromCloudinary(uploadedImage.public_id);
      }

      // Handle duplicate plate number error
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Plate number already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// Update mileage
router.patch("/mileage/:id", auth, async (req, res) => {
  try {
    const carId = req.params.id;
    const userId = req.user._id;
    const data = req.body;

    const mileage = data.mileage;

    if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID",
      });
    }

    if (mileage === undefined || mileage < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid mileage is required",
      });
    }

    const car = await CarModel.findOne({
      _id: carId,
      isDeleted: false,
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    if (car.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your cars",
      });
    }

    // Validate that new mileage is not less than current
    if (mileage < car.mileage) {
      return res.status(400).json({
        success: false,
        message: "New mileage cannot be less than current mileage",
      });
    }

    const updatedCar = await CarModel.findByIdAndUpdate(
      carId,
      { mileage },
      {
        runValidators: true,
        new: true,
      },
    );

    if (!updatedCar) {
      return res.status(500).json({
        success: false,
        message: "Car was not updated",
      });
    }

    updateServicesForCar(carId).catch((err) =>
      console.error(`Failed to recalculate services for car ${carId}:`, err),
    );

    return res.status(200).json({ success: true, data: updatedCar });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// Delete car (soft delete)
router.patch("/delete/:id", auth, logIP("DELETE_CAR"), async (req, res) => {
  try {
    const carId = req.params.id;
    const userId = req.user._id;

    if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID",
      });
    }

    const car = await CarModel.findOne({
      _id: carId,
      isDeleted: false,
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    if (car.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your cars",
      });
    }

    const deletedCar = await CarModel.findByIdAndUpdate(
      carId,
      { isDeleted: true },
      {
        runValidators: true,
        new: true,
      },
    );

    if (!deletedCar) {
      return res.status(500).json({
        success: false,
        message: "Car was not deleted",
      });
    }

    // when a car is deleted delete its parts
    const deletedParts = await PartModel.updateMany(
      { car: deletedCar._id },
      { isTracked: false },
    );

    // when a car is deleted delete its services
    const deletedServices = await UpcomingServiceModel.deleteMany({
      car: deletedCar._id,
    });

    return res.status(200).json({
      success: true,
      message: "Car deleted successfully",
      data: deletedCar,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;
