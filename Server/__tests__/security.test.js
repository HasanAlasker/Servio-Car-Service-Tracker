import request from "supertest";
import mongoose from "mongoose";
import app from "../index.js";
import UserModel from "../models/user.js";
import { jest } from "@jest/globals";

jest.setTimeout(30000); // Allowing extra timeout for brute force simulation

let activeUser;

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect(process.env.DATABASE_URL);
  await mongoose.connection.db.dropDatabase();

  activeUser = await UserModel.create({
    name: "Safe User",
    email: "safe@test.com",
    phone: "5551002000",
    password: "Password123!",
    role: "user",
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Explicit Security & Vulnerability Defense Checks", () => {
  
  test("1. Password Architecture: Proves passwords undergo cryptographic hashing in the DB", async () => {
    // We register a dummy user explicitly through the Node API route
    await request(app)
      .post("/api/users/register")
      .send({
        name: "Hash User",
        email: "hashme@test.com",
        phone: "5551239999",
        password: "SuperSecretPassword1!"
      });

    // We look up the explicitly created user directly in Mongo
    const dbUser = await UserModel.findOne({ email: "hashme@test.com" });
    
    // Test that the stored password length conforms to bcrypt output bounds (~60 chars)
    expect(dbUser.password.length).toBeGreaterThan(50);
    // Crucially, test that the raw string is completely unrecognizable
    expect(dbUser.password).not.toEqual("SuperSecretPassword1!");
    expect(dbUser.password).not.toContain("SuperSecret");
  });

  test("2. Input Validation (Joi): Proves XSS / Malicious Character Rejection", async () => {
    // Attempting to register with executable Javascript hooks in the name field
    const res = await request(app)
      .post("/api/users/register")
      .send({
        name: "<script>alert('Stealing Data')</script>",
        email: "xss@test.com",
        phone: "5551002000",
        password: "Password123!"
      });

    // Expecting HTTP 400 Bad Request because internal regex validation fails
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/validation error/i);
  });

  test("3. Input Validation (Joi): Proves NoSQL Object Injection Mitigation", async () => {
    // Simulating replacing a standard email string with a NoSQL logical selector {"$ne": null}
    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: { "$ne": null },
        password: "Password123!"
      });

    // Joi strictly verifies `email` as a fundamental primitive "string" object, thereby implicitly
    // killing NoSQL object injection payloads prior to reaching mongoose execution logic.
    expect(res.statusCode).toBe(400);
  });

  test("4. Brute Force Protection: Proves global rate limiter prevents catastrophic spam attacks", async () => {
    let finalStatusCode;

    // The current global limiter limits 600 requests per 15 minutes per IP.
    // We simulate a bot dynamically spraying 605 rapid authentication attempts.
    for (let i = 0; i < 605; i++) {
        // Hitting login excessively 
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: "spam@test.com",
          password: "SpamPassword1!"
        });
      
      finalStatusCode = res.statusCode; 
    }

    // Expect the 605th consecutive request to successfully trip the express-rate-limit 
    // and yield the "429 Too Many Requests" response code.
    expect(finalStatusCode).toBe(429);
  });

});
