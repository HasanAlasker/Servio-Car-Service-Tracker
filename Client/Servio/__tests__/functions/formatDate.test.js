import { formatDate } from "../../functions/formatDate";

describe("formatDate", () => {
  it("should format an ISO date string into DD/MM/YYYY format", () => {
    // Use Case: Receiving an ISO date string from MongoDB (e.g. 2024-05-12T10:00:00Z)
    const isoDate = "2024-05-12T10:00:00Z";
    expect(formatDate(isoDate)).toBe("12/5/2024");
  });

  it("should format a standard Date object into DD/MM/YYYY format", () => {
    // Use Case: Formatting a new Date() object created dynamically in the app
    const dateObj = new Date(2023, 11, 25); // December 25, 2023 (Months are 0-indexed)
    expect(formatDate(dateObj)).toBe("25/12/2023");
  });

  it("should return an empty string when passed an empty string or null", () => {
    // Use Case: Component renders before data is fully loaded and date is null
    expect(formatDate(null)).toBe("");
    expect(formatDate("")).toBe("");
    expect(formatDate(undefined)).toBe("");
  });
});
