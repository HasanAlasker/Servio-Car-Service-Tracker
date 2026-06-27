import request from "supertest";
import mongoose from "mongoose";
import { jest } from "@jest/globals";

import app from "../index.js";

import CarMakeModel from "../models/carMake.js";
import UserModel from "../models/user.js";
import ShopModel from "../models/shop.js";
import AppointmentModel from "../models/appointment.js";
import { SlotModel } from "../models/slots.js";
import SuggestionModel from "../models/suggestion.js";
import EarlyAccessModel from "../models/earlyAccess.js";

// NOTE: This file aims to cover the core API contracts (authz + happy paths)
// across all routers with realistic fixtures in Mongo.

jest.setTimeout(30000);

let customerUser;
let adminUser;
let shopOwnerCandidate;

let customerToken;
let adminToken;
let shopOwnerToken; // refreshed after shop verification

let shop;
let car;
let part;
let appointment;
let pastAppointment;

let report;
let suggestion;
let earlyAccess;

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect(process.env.DATABASE_URL);
  await mongoose.connection.db.dropDatabase();

  // Seed minimal car makes needed by /api/cars/add
  await CarMakeModel.deleteMany({});
  await CarMakeModel.create({ make: "toyota", name: ["corolla"] });

  // Create users (roles are used by auth/admin/shopOwner middleware)
  await UserModel.deleteMany({});
  customerUser = await UserModel.create({
    name: "Customer",
    email: "customer@test.com",
    phone: "5551002000",
    password: "Password123!",
    role: "user",
  });
  adminUser = await UserModel.create({
    name: "Admin",
    email: "admin@test.com",
    phone: "5553004000",
    password: "Password123!",
    role: "admin",
  });
  shopOwnerCandidate = await UserModel.create({
    name: "Shop Owner Candidate",
    email: "shopowner@test.com",
    phone: "5555006000",
    password: "Password123!",
    role: "user",
  });

  customerToken = customerUser.generateAuthToken();
  adminToken = adminUser.generateAuthToken();

  // Create an unverified shop for /api/shops/verify and shopOwner endpoints.
  const openHours = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map(
    (day) => ({
      day,
      isOpen: true,
      from: "09:00",
      to: "17:00",
    }),
  );

  await ShopModel.deleteMany({});
  shop = await ShopModel.create({
    owner: shopOwnerCandidate._id,
    name: "Test Shop",
    description: "Great service for your car",
    services: [{ name: "oil change" }],
    address: { city: "Amman", area: "Downtown", street: "Main Street" },
    openHours,
    phone: "5554443333",
    link: "https://www.google.com/maps",
    lng: "35.0",
    lat: "31.0",
    isVerified: false,
    isDeleted: false,
    ratingCount: 0,
    rating: 0,
  });

  // Verify the shop (admin-only) -> updates shop.isVerified and owner role.
  const verifyRes = await request(app)
    .patch(`/api/shops/verify/${shop._id}`)
    .set("x-auth-token", adminToken);
  expect(verifyRes.statusCode).toBe(200);

  // Refresh token so JWT contains updated role=shopOwner
  const refreshRes = await request(app)
    .get(`/api/users/refreshToken/${shopOwnerCandidate._id}`)
    .set("x-auth-token", adminToken);
  shopOwnerToken = refreshRes.headers["x-auth-token"];
  expect(shopOwnerToken).toBeDefined();

  // Create a car via API (multipart route but only scalar fields, no real image)
  const carRes = await request(app)
    .post("/api/cars/add")
    .set("x-auth-token", customerToken)
    .field("make", "toyota")
    .field("name", "corolla")
    .field("model", "2020")
    .field("plateNumber", "ABC-123")
    .field("mileage", "1000")
    .field("unit", "km");

  expect(carRes.statusCode).toBe(201);
  car = carRes.body.data;
  expect(car._id).toBeDefined();

  // Create a part via API and trigger service recalculation via /api/parts/edit.
  // (parts/add calls updateServicesForCar BEFORE save, so we force recalculation after.)
  const addPartRes = await request(app)
    .post(`/api/parts/add/${car._id}`)
    .set("x-auth-token", customerToken)
    .send({
      name: "BrakePad",
      recommendedChangeInterval: { miles: 50 },
      lastChangeDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      lastChangeMileage: 950,
      note: "Initial part tracking",
    });
  expect(addPartRes.statusCode).toBe(201);
  part = addPartRes.body.data;

  const editPartRes = await request(app)
    .patch(`/api/parts/edit/${part._id}`)
    .set("x-auth-token", customerToken)
    .send({ note: "Edit to trigger service recalculation" });
  expect(editPartRes.statusCode).toBe(200);

  // Book appointment via API -> creates Appointment + Slot
  const apptDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const apptRes = await request(app)
    .post("/api/appointments/book")
    .set("x-auth-token", customerToken)
    .send({
      car: car._id.toString(),
      shop: shop._id.toString(),
      serviceParts: [part._id.toString()],
      scheduledDate: apptDate.toISOString(),
      time: "09:00",
    });

  expect(apptRes.statusCode).toBe(201);
  appointment = apptRes.body.data;

  // Confirm appointment as shopOwner -> status confirmed + updates Slot.to
  const confirmRes = await request(app)
    .patch(`/api/appointments/confirm/${appointment._id}`)
    .set("x-auth-token", shopOwnerToken)
    .send({ to: "11:00" });

  expect(confirmRes.statusCode).toBe(200);

  // Create past appointment directly for delete test
  pastAppointment = await AppointmentModel.create({
    car: car._id,
    customer: customerUser._id,
    shop: shop._id,
    serviceParts: [part._id],
    status: "pending",
    scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isDeleted: false,
  });

  // Create report for the confirmed appointment
  const reportRes = await request(app)
    .post(`/api/reports/create/${appointment._id}`)
    .set("x-auth-token", customerToken)
    .send({ reason: "Issue reported by customer" });
  expect(reportRes.statusCode).toBe(201);
  report = reportRes.body.data;

  // Create suggestion for the customer
  const suggestionRes = await request(app)
    .post("/api/suggestions/add")
    .set("x-auth-token", customerToken)
    .send({
      title: "Need more parts",
      message: "Could you add parts for brake wear updates?",
      type: "improvement",
    });
  expect(suggestionRes.statusCode).toBe(201);

  suggestion = await SuggestionModel.findOne({ title: "Need more parts" });
  expect(suggestion).toBeTruthy();

  // Request early access (no auth required)
  const earlyAccessRes = await request(app)
    .post("/api/earlyAccess/request")
    .send({ email: "ea@test.com", platform: "ios" });
  expect(earlyAccessRes.statusCode).toBe(201);
  earlyAccess = earlyAccessRes.body.data;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("API Suite (core routers)", () => {
  test("Users: /me requires auth", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.statusCode).toBe(401);
  });

  test("Users: /me returns the authenticated user", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("x-auth-token", customerToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(customerUser.email);
  });

  test("Shops: /verified returns the verified shop", async () => {
    const res = await request(app)
      .get("/api/shops/verified")
      .set("x-auth-token", customerToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.map((s) => s._id.toString())).toContain(
      shop._id.toString(),
    );
  });

  test("Shops: /un-verified is admin-only", async () => {
    const res = await request(app)
      .get("/api/shops/un-verified")
      .set("x-auth-token", customerToken);
    expect(res.statusCode).toBe(403);
  });

  test("Cars: /mine returns cars for the user", async () => {
    const res = await request(app)
      .get("/api/cars/mine")
      .set("x-auth-token", customerToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.map((c) => c._id.toString())).toContain(
      car._id.toString(),
    );
  });

  test("Cars: /mileage/:id does not allow decreasing", async () => {
    const res = await request(app)
      .patch(`/api/cars/mileage/${car._id}`)
      .set("x-auth-token", customerToken)
      .send({ mileage: 900 });
    expect(res.statusCode).toBe(400);
  });

  test("Parts: /tracked/:carId returns tracked part", async () => {
    const res = await request(app)
      .get(`/api/parts/tracked/${car._id}`)
      .set("x-auth-token", customerToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.map((p) => p._id.toString())).toContain(
      part._id.toString(),
    );
  });

  test("UpcomingServices: returns at least one upcoming due service", async () => {
    const res = await request(app)
      .get("/api/upcomingServices/")
      .set("x-auth-token", customerToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].status).not.toBe("not active");
  });

  test("Appointments: /upcoming includes the confirmed appointment", async () => {
    const res = await request(app)
      .get("/api/appointments/upcoming")
      .set("x-auth-token", customerToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.map((a) => a._id.toString())).toContain(
      appointment._id.toString(),
    );
  });

  test("Slots: /:shopId returns available slots and marks busy ones", async () => {
    const apptSlot = await SlotModel.findOne({ appointment: appointment._id });
    expect(apptSlot).toBeTruthy();

    const day = apptSlot.date.toISOString();
    const res = await request(app)
      .get(`/api/slots/${shop._id}`)
      .set("x-auth-token", customerToken)
      .query({ date: day });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isOpen).toBe(true);
    expect(Array.isArray(res.body.data.slots)).toBe(true);
    
    // We booked an appointment at 09:00
    const busySlot = res.body.data.slots.find(s => s.from === "09:00");
    expect(busySlot).toBeDefined();
    expect(busySlot.isBusy).toBe(true);
  });

  test("Slots: /checkSlot detects overlap", async () => {
    const apptSlot = await SlotModel.findOne({ appointment: appointment._id });
    const day = apptSlot.date.toISOString();

    const res = await request(app)
      .post(`/api/slots/checkSlot/${shop._id}`)
      .set("x-auth-token", customerToken)
      .send({ date: day, from: "09:00" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.available).toBe(false);
  });

  test("Slots: /checkSlot returns available when no overlap", async () => {
    const apptSlot = await SlotModel.findOne({ appointment: appointment._id });
    const day = apptSlot.date.toISOString();

    const res = await request(app)
      .post(`/api/slots/checkSlot/${shop._id}`)
      .set("x-auth-token", customerToken)
      .send({ date: day, from: "13:00" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.available).toBe(true);
  });

  test("Appointments: shopOwner can list confirmed appointments", async () => {
    const res = await request(app)
      .get(`/api/appointments/confirmed/${shop._id}`)
      .set("x-auth-token", shopOwnerToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.map((a) => a._id.toString())).toContain(
      appointment._id.toString(),
    );
  });

  test("Appointments: customer can soft-delete a past appointment", async () => {
    const res = await request(app)
      .patch(`/api/appointments/delete/${pastAppointment._id}`)
      .set("x-auth-token", customerToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const updated = await AppointmentModel.findById(pastAppointment._id);
    expect(updated.isDeleted).toBe(true);
  });

  test("Reports: admin can close a report", async () => {
    const res = await request(app)
      .patch(`/api/reports/close/${report._id}`)
      .set("x-auth-token", adminToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("closed");
  });

  test("Suggestions: admin can list and delete suggestions", async () => {
    const listRes = await request(app)
      .get("/api/suggestions/all")
      .set("x-auth-token", adminToken);
    expect(listRes.statusCode).toBe(200);
    expect(listRes.body.success).toBe(true);
    expect(listRes.body.data.map((s) => s._id.toString())).toContain(
      suggestion._id.toString(),
    );

    const delRes = await request(app)
      .delete(`/api/suggestions/delete/${suggestion._id}`)
      .set("x-auth-token", adminToken);
    expect(delRes.statusCode).toBe(200);
  });

  test("EarlyAccess: admin can list pending/sent and mark sent", async () => {
    const pendingRes = await request(app)
      .get("/api/earlyAccess/pending")
      .set("x-auth-token", adminToken);
    expect(pendingRes.statusCode).toBe(200);
    expect(pendingRes.body.success).toBe(true);

    const markRes = await request(app)
      .patch(`/api/earlyAccess/mark-sent/${earlyAccess._id}`)
      .set("x-auth-token", adminToken);
    expect(markRes.statusCode).toBe(200);
    expect(markRes.body.success).toBe(true);
    expect(markRes.body.data.isInvitationSent).toBe(true);

    const sentRes = await request(app)
      .get("/api/earlyAccess/sent")
      .set("x-auth-token", adminToken);
    expect(sentRes.statusCode).toBe(200);
    expect(sentRes.body.success).toBe(true);
  });

  test("Shops: /rate/:id updates shop rating and rejects re-rating", async () => {
    const rateRes = await request(app)
      .patch(`/api/shops/rate/${shop._id}`)
      .set("x-auth-token", customerToken)
      .send({ rating: 5, appointmentId: appointment._id });
    expect(rateRes.statusCode).toBe(200);
    expect(rateRes.body.message).toMatch(/Rating submitted/i);

    const rateAgainRes = await request(app)
      .patch(`/api/shops/rate/${shop._id}`)
      .set("x-auth-token", customerToken)
      .send({ rating: 4, appointmentId: appointment._id });
    expect(rateAgainRes.statusCode).toBe(400);
  });
});

