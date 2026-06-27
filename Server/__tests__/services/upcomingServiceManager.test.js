import { jest } from '@jest/globals';

jest.unstable_mockModule("../../models/car.js", () => ({
  default: {
    findById: jest.fn(),
    find: jest.fn()
  }
}));

jest.unstable_mockModule("../../models/part.js", () => ({
  default: {
    find: jest.fn()
  }
}));

jest.unstable_mockModule("../../models/upcomingService.js", () => ({
  default: {
    deleteMany: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn()
  }
}));

jest.unstable_mockModule("../../services/notificationService.js", () => ({
  sendDueServiceNotifications: jest.fn()
}));

const CarModel = (await import("../../models/car.js")).default;
const PartModel = (await import("../../models/part.js")).default;
const UpcomingServiceModel = (await import("../../models/upcomingService.js")).default;
const { updateServicesForCar, updateServicesForAllCars } = await import("../../services/upcomingServiceManager.js");

describe("upcomingServiceManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateServicesForCar", () => {
    it("should calculate services, group them, and save upcoming services", async () => {
      // Mock Car
      CarModel.findById.mockResolvedValue({
        _id: "car1",
        isDeleted: false,
        mileage: 50000,
        owner: "user1",
      });

      // Mock Parts
      PartModel.find.mockResolvedValue([
        {
          _id: "part1",
          car: "car1",
          isTracked: true,
          name: "Oil Filter",
          lastChangeDate: new Date(),
          lastChangeMileage: 40000,
          recommendedChangeInterval: { miles: 10000 },
        },
        {
          _id: "part2",
          car: "car1",
          isTracked: true,
          name: "Air Filter",
          lastChangeDate: new Date(),
          lastChangeMileage: 45000,
          recommendedChangeInterval: { miles: 5000 },
        }
      ]);

      UpcomingServiceModel.deleteMany.mockResolvedValue({});
      UpcomingServiceModel.create.mockResolvedValue({});

      await updateServicesForCar("car1");

      // Verify DB operations
      expect(CarModel.findById).toHaveBeenCalledWith("car1");
      expect(PartModel.find).toHaveBeenCalledWith({ car: "car1", isTracked: true });
      expect(UpcomingServiceModel.deleteMany).toHaveBeenCalledWith({
        car: "car1",
        partKey: { $nin: expect.any(Array) },
      });
      
      // Since parts are due at 50,000 miles and car is at 50,000 miles, they will be grouped
      expect(UpcomingServiceModel.findOneAndUpdate).toHaveBeenCalled();
      const filterArg = UpcomingServiceModel.findOneAndUpdate.mock.calls[0][0];
      const createCallArg = UpcomingServiceModel.findOneAndUpdate.mock.calls[0][1].$set;
      expect(filterArg.car).toBe("car1");
      expect(createCallArg.customer).toBe("user1");
      expect(createCallArg.status).toBeDefined();
    });

    it("should do nothing if car is not found or deleted", async () => {
      CarModel.findById.mockResolvedValue(null);
      
      await updateServicesForCar("car1");
      
      expect(PartModel.find).not.toHaveBeenCalled();
      expect(UpcomingServiceModel.deleteMany).not.toHaveBeenCalled();
    });

    it("should do nothing if no tracked parts exist", async () => {
      CarModel.findById.mockResolvedValue({ _id: "car1", isDeleted: false, mileage: 10000 });
      PartModel.find.mockResolvedValue([]);
      
      await updateServicesForCar("car1");
      
      expect(UpcomingServiceModel.deleteMany).toHaveBeenCalledWith({ car: "car1" });
    });
  });

  describe("updateServicesForAllCars", () => {
    it("should loop through all non-deleted cars and update their services", async () => {
      CarModel.find.mockReturnValue({
        distinct: jest.fn().mockResolvedValue(["car1", "car2"])
      });
      
      CarModel.findById.mockImplementation((id) => {
        return Promise.resolve({ _id: id, isDeleted: false, mileage: 10000, owner: "owner_" + id });
      });
      PartModel.find.mockResolvedValue([]); 

      await updateServicesForAllCars();

      expect(CarModel.find).toHaveBeenCalledWith({ isDeleted: false });
      expect(CarModel.findById).toHaveBeenCalledWith("car1");
      expect(CarModel.findById).toHaveBeenCalledWith("car2");
    });
  });
});
