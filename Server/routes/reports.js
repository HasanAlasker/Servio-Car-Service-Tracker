import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import ReportModel from "../models/report.js";
import validate from "../middleware/joiValidation.js";
import { createReport } from "../validation/report.js";
import logIP from "../middleware/logIp.js";
import AppointmentModel from "../models/appointment.js";

const router = express.Router();

// get all reports
router.get(
  "/open",
  [auth, admin],
  logIP("GET_OPEN_REPORTS"),
  async (req, res) => {
    try {
      const reports = await ReportModel.find({ status: "open" })
        .sort("-createdAt")
        .populate(
          "reporter",
          "-password -pushNotificationTokens -role -createdAt -updatedAt",
        )
        .populate({
          path: "reportedShop",
          select:
            "-openHours -services -imagePublicId -isVerified -updatedAt -createdAt",
          populate: {
            path: "owner",
            select:
              "-password -pushNotificationTokens -role -createdAt -updatedAt",
          },
        })
        .populate({
          path: "appointment",
          select:
            "-customer -shop -serviceParts -isRejected -isDeleted -createdAt -updatedAt",
          populate: "car",
          select:
            "-owner -image -imagePublicId -mileage -unit -isDeleted -updatedAt",
        });

      return res.status(200).json({ success: true, data: reports });
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
  "/closed",
  [auth, admin],
  logIP("GET_CLOSED_REPORTS"),
  async (req, res) => {
    try {
      const reports = await ReportModel.find({ status: "closed" })
        .sort("-createdAt")
        .populate(
          "reporter",
          "-password -pushNotificationTokens -role -createdAt -updatedAt",
        )
        .populate({
          path: "reportedShop",
          select:
            "-openHours -services -imagePublicId -isVerified -updatedAt -createdAt",
          populate: {
            path: "owner",
            select:
              "-password -pushNotificationTokens -role -createdAt -updatedAt",
          },
        })
        .populate({
          path: "appointment",
          select:
            "-customer -shop -serviceParts -isRejected -isDeleted -createdAt -updatedAt",
          populate: "car",
          select:
            "-owner -image -imagePublicId -mileage -unit -isDeleted -updatedAt",
        });
      return res.status(200).json({ success: true, data: reports });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// make report
router.post("/create/:id", auth, logIP("REPORT"), async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const data = req.body;
    data.reporter = req.user._id;

    if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    const reportedApp = await AppointmentModel.findById(appointmentId);
    if (!reportedApp)
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });

    if (reportedApp.isReported)
      return res.status(400).json({
        success: false,
        message: "Appointment already reported",
      });

    reportedApp.isReported = true;

    data.appointment = reportedApp._id;
    data.reportedShop = reportedApp.shop._id;

    const savedApp = await reportedApp.save();
    if (!savedApp) {
      return res.status(404).json({
        success: false,
        message: "Report not saved",
      });
    }

    const report = await ReportModel(data);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not created",
      });
    }
    const savedReport = await report.save();
    return res.status(201).json({ success: true, data: savedReport });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// close report
router.patch(
  "/close/:id",
  [auth, admin],
  logIP("CLOSE_REPORT"),
  async (req, res) => {
    try {
      const id = req.params.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource ID",
        });
      }

      const report = await ReportModel.findById(id);

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        });
      }

      const closedReport = await ReportModel.findByIdAndUpdate(
        id,
        { status: "closed" },
        { timestamps: true, new: true },
      );

      return res.status(200).json({ success: true, data: closedReport });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
);

// close report
router.patch(
  "/open/:id",
  [auth, admin],
  logIP("OPEN_REPORT"),
  async (req, res) => {
    try {
      const id = req.params.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource ID",
        });
      }

      const report = await ReportModel.findById(id);

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        });
      }

      const openedReport = await ReportModel.findByIdAndUpdate(
        id,
        { status: "open" },
        { timestamps: true, new: true },
      );

      return res.status(200).json({ success: true, data: openedReport });
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
