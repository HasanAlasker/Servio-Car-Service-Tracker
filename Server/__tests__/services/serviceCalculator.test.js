import {
  calculateNextService,
  getServiceStatus,
  groupServiceableParts,
} from "../../services/serviceCalculator";

describe("ServiceCalculator", () => {
  describe("calculateNextService", () => {
    it("should calculate next service date correctly by months", () => {
      const part = {
        _id: "p1",
        name: "Oil Filter",
        lastChangeDate: "2023-01-01T00:00:00Z",
        lastChangeMileage: 10000,
        recommendedChangeInterval: { months: 6 },
      };

      const result = calculateNextService(part, 14000);
      expect(result.partId).toBe("p1");
      expect(result.partName).toBe("Oil Filter");
      expect(result.nextServiceMileage).toBeNull();
      
      expect(result.nextServiceDate.getFullYear()).toBe(2023);
      expect(result.nextServiceDate.getMonth()).toBe(6); // 0-indexed, 6 is July
      expect(result.nextServiceDate.getDate()).toBe(1);
    });

    it("should calculate next service correctly by mileage", () => {
      const part = {
        _id: "p2",
        name: "Brake Pads",
        lastChangeDate: "2023-01-01T00:00:00Z",
        lastChangeMileage: 5000,
        recommendedChangeInterval: { miles: 10000 },
      };

      const result = calculateNextService(part, 12000);
      expect(result.partId).toBe("p2");
      expect(result.nextServiceDate).toBeNull();
      expect(result.nextServiceMileage).toBe(15000);
      expect(result.milesUntilDue).toBe(3000); // 15000 - 12000
    });
    
    it("should handle both date and mileage", () => {
      const part = {
        _id: "p3",
        name: "Tires",
        lastChangeDate: "2023-01-01T00:00:00Z",
        lastChangeMileage: 5000,
        recommendedChangeInterval: { months: 12, miles: 10000 },
      };

      const result = calculateNextService(part, 14000);
      expect(result.nextServiceDate).toBeInstanceOf(Date);
      expect(result.nextServiceMileage).toBe(15000);
      expect(result.milesUntilDue).toBe(1000);
    });
  });

  describe("getServiceStatus", () => {
    it("should return overdue when days are negative", () => {
      expect(getServiceStatus(-5, 1000)).toBe("overdue");
    });

    it("should return overdue when miles are negative", () => {
      expect(getServiceStatus(100, -10)).toBe("overdue");
    });

    it("should return due when days <= 7", () => {
      expect(getServiceStatus(5, 1000)).toBe("due");
    });

    it("should return due when miles <= 100", () => {
      expect(getServiceStatus(30, 50)).toBe("due");
    });

    it("should return soon when days <= 30", () => {
      expect(getServiceStatus(20, 1000)).toBe("soon");
    });

    it("should return soon when miles <= 500", () => {
      expect(getServiceStatus(40, 400)).toBe("soon");
    });

    it("should return not active otherwise", () => {
      expect(getServiceStatus(40, 1000)).toBe("not active");
    });
  });

  describe("groupServiceableParts", () => {
    it("should group parts due within 7 days together", () => {
      const partServices = [
        {
          partId: "p1",
          nextServiceDate: new Date("2023-05-01T00:00:00Z"),
          nextServiceMileage: 10000,
        },
        {
          partId: "p2",
          nextServiceDate: new Date("2023-05-05T00:00:00Z"),
          nextServiceMileage: 12000,
        },
        {
          partId: "p3",
          nextServiceDate: new Date("2023-05-20T00:00:00Z"),
          nextServiceMileage: 15000,
        },
      ];

      const groups = groupServiceableParts(partServices);

      expect(groups.length).toBe(2);
      
      // Group 1 should contain p1 and p2 because they are within 7 days of each other (May 1 and May 5)
      expect(groups[0].parts).toContain("p1");
      expect(groups[0].parts).toContain("p2");
      expect(groups[0].parts.length).toBe(2);
      expect(groups[0].dueBy.date.toISOString()).toBe(new Date("2023-05-01T00:00:00Z").toISOString());
      expect(groups[0].dueBy.mileage).toBe(10000);

      // Group 2 should contain p3
      expect(groups[1].parts).toContain("p3");
      expect(groups[1].parts.length).toBe(1);
    });
  });
});
