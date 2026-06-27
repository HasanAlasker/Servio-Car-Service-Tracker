import { formatOpenDays, formatDayRange } from "../../functions/formatOpenHours";

describe("formatOpenHours Functions", () => {
  describe("formatOpenDays", () => {
    it("should group sequential days with identical operating hours", () => {
      const inputDays = [
        { day: "monday", from: "09:00", to: "17:00" },
        { day: "tuesday", from: "09:00", to: "17:00" },
        { day: "wednesday", from: "09:00", to: "17:00" },
        { day: "thursday", from: "10:00", to: "15:00" },
      ];

      const result = formatOpenDays(inputDays);
      expect(result).toHaveLength(2); // Two groups
      expect(result[0]).toHaveLength(3); // Mon, Tue, Wed
      expect(result[1]).toHaveLength(1); // Thu
    });
  });

  describe("formatDayRange", () => {
    it("should format a single day group correctly", () => {
      const group = [{ day: "monday", from: "09:00", to: "17:00" }];
      const result = formatDayRange(group);
      
      expect(result).toBe("Monday");
    });

    it("should format a multiple day group correctly with a range indicator", () => {
      const group = [
        { day: "monday", from: "09:00", to: "17:00" },
        { day: "tuesday", from: "09:00", to: "17:00" },
        { day: "wednesday", from: "09:00", to: "17:00" },
      ];
      const result = formatDayRange(group);
      
      expect(result).toBe("Monday - Wednesday");
    });
  });
});
