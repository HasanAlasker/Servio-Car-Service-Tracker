import { addOneHour, to24Hour } from "../../functions/addOneHour";

describe("addOneHour Utilities", () => {
  describe("addOneHour", () => {
    it("should accurately add one hour to a given Date object", () => {
      // Use Case: Calculating the default end-time for a booking slot based on a start-time
      const initialDate = new Date("2024-05-12T10:00:00Z");
      const updatedDate = addOneHour(initialDate);
      
      expect(updatedDate.getHours()).toBe(initialDate.getHours() + 1);
    });
  });

  describe("to24Hour", () => {
    it("should correctly convert standard 12-hour AM times to 24-hour format", () => {
      // Use Case: A user selects '09:00 AM' from a picker, and backend requires '09:00'
      expect(to24Hour("09:00 AM")).toBe("09:00");
      expect(to24Hour("11:30 AM")).toBe("11:30");
    });

    it("should correctly convert standard 12-hour PM times to 24-hour format", () => {
      // Use Case: A user selects '02:00 PM', backend requires '14:00'
      expect(to24Hour("02:00 PM")).toBe("14:00");
      expect(to24Hour("11:59 PM")).toBe("23:59");
    });

    it("should handle 12:00 AM (Midnight) edge cases properly", () => {
      // Use Case: User books service exactly at midnight
      expect(to24Hour("12:00 AM")).toBe("00:00");
    });

    it("should handle 12:00 PM (Noon) edge cases properly", () => {
      // Use Case: User books service exactly at lunchtime
      expect(to24Hour("12:00 PM")).toBe("12:00");
    });
  });
});
