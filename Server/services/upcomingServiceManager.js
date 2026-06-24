import UpcomingServiceModel from "../models/upcomingService.js";
import PartModel from "../models/part.js";
import CarModel from "../models/car.js";
import {
  calculateNextService,
  getServiceStatus,
  groupServiceableParts,
} from "./serviceCalculator.js";

const BATCH_SIZE = 10;
export const updateServicesForCar = async (carId) => {
  const car = await CarModel.findById(carId);
  if (!car || car.isDeleted) return;

  const parts = await PartModel.find({ car: carId, isTracked: true });

  if (parts.length === 0) {
    await UpcomingServiceModel.deleteMany({ car: carId });
    return;
  }

  const partServices = parts.map((part) =>
    calculateNextService(part, car.mileage),
  );
  const serviceGroups = groupServiceableParts(partServices);

  const seenKeys = [];

  for (const group of serviceGroups) {
    const daysUntilDue = group.dueBy.date
      ? Math.ceil((group.dueBy.date - new Date()) / (1000 * 60 * 60 * 24))
      : null;
    const milesUntilDue =
      group.dueBy.mileage != null ? group.dueBy.mileage - car.mileage : null;

    const status = getServiceStatus(daysUntilDue, milesUntilDue);

    // Stable key derived from sorted part IDs — safe to use as a match field
    const partKey = [...group.parts].map(String).sort().join(",");
    seenKeys.push(partKey);

    await UpcomingServiceModel.findOneAndUpdate(
      { car: carId, partKey }, // simple scalar match — always works
      {
        $set: {
          customer: car.owner,
          parts: group.parts, // keep the array in sync
          dueBy: group.dueBy,
          status,
          partKey,
        },
        $setOnInsert: {
          reminder: true,
          notificationSent: false,
        },
      },
      { upsert: true, new: true },
    );
  }

  // Delete records whose part combination no longer exists
  await UpcomingServiceModel.deleteMany({
    car: carId,
    partKey: { $nin: seenKeys },
  });
};

export const updateServicesForAllCars = async () => {
  // Fetch only IDs to avoid holding all car documents in memory at once.
  const carIds = await CarModel.find({ isDeleted: false }).distinct("_id");

  for (let i = 0; i < carIds.length; i += BATCH_SIZE) {
    const batch = carIds.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map((id) =>
        updateServicesForCar(id).catch((err) =>
          console.error(`Error updating services for car ${id}:`, err),
        ),
      ),
    );
  }
};
