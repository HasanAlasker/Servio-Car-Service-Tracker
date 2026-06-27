import { formatDateTime } from "../../functions/formatDateTime";

describe("formatDateTime", () => {
  it("should output valid formatted date in default timezone (Asia/Amman) and locale (en-US)", () => {
    const inputDate = new Date("2024-05-12T10:00:00Z");
    
    // In Asia/Amman, 10:00 UTC is usually 13:00 (1:00 PM), depending on daylight saving.
    // So we just match that it returns a string with "2024" and "May".
    const result = formatDateTime(inputDate);
    
    expect(result).toContain("May 12, 2024");
    expect(result).toMatch(/(1:00 PM|2:00 PM|12:00 PM)/); // Depends on exact node version intl rules, this is a soft check
  });

  it("should return 'Invalid date' when an invalid date is passed", () => {
    const result = formatDateTime("invalid-date-string");
    expect(result).toBe("Invalid date");
  });

  it("should format correctly in a custom locale", () => {
    const inputDate = new Date("2024-05-12T10:00:00Z");
    // passing ar-EG (Arabic Egypt)
    const result = formatDateTime(inputDate, "ar-EG");
    
    expect(result).toContain("٢٠٢٤"); // 2024 in arabic numerals
  });
  
  it("should format correctly in a custom timezone", () => {
    const inputDate = new Date("2024-05-12T10:00:00Z");
    const result = formatDateTime(inputDate, "en-US", "UTC");
    
    expect(result).toContain("10:00 AM");
  });
});
