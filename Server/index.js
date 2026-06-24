import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import users from "./routes/users.js";
import cars from "./routes/cars.js";
import shops from "./routes/shops.js";
import appointments from "./routes/appointments.js";
import slots from "./routes/slots.js";
import upcomingServices from "./routes/upcomingServices.js";
import parts from "./routes/parts.js";
import reports from "./routes/reports.js";
import suggestions from "./routes/suggestions.js";
import earlyAccess from "./routes/earlyAccess.js";
import { globalLimit } from "./middleware/limiter.js";

import seedDatabase from "./seed/seedCarMakes.js";
import { startServiceScheduler } from "./jobs/serviceSchedular.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://servio-maintenance.netlify.app", "http://localhost:8081", "https://servio.expo.app"]
        : "http://localhost:5173",
    exposedHeaders: ["x-auth-token"],
  }),
);

const port = process.env.PORT || 4000;

if (!process.env.JWT_SECRET) {
  console.log("fatal error, no jwt defined");
}

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to mongoDB... ✅"))
  .catch((err) =>
    console.log("Error connecting to mongoDB... ❌", err.message),
  );

app.use(express.json());
app.use(globalLimit);

app.use("/api/users", users);
app.use("/api/cars", cars);
app.use("/api/parts", parts);
app.use("/api/shops", shops);
app.use("/api/appointments", appointments);
app.use("/api/upcomingServices", upcomingServices);
app.use("/api/suggestions", suggestions);
app.use("/api/reports", reports);
app.use("/api/slots", slots);
app.use("/api/earlyAccess", earlyAccess);
// await seedDatabase()

startServiceScheduler();
console.log("Service scheduler started 📆");

app.listen(port, () => {
  console.log(`Server running on ${port} 🌍`);
  console.log(`Accessible at http://YOUR_IP:${port} 🖥️`);
});
