import { capFirstLetter } from "../../functions/CapFirstLetterOfWord";

describe("capFirstLetter", () => {
  it("should capitalize the first letter of a single word", () => {
    // Use Case: Simple lowercase word
    expect(capFirstLetter("hello")).toBe("Hello");
  });

  it("should capitalize the first letter of multiple words", () => {
    // Use Case: Full name inputted entirely in lowercase
    expect(capFirstLetter("john doe")).toBe("John Doe");
  });

  it("should handle already capitalized words", () => {
    // Use Case: User types properly capitalized words
    expect(capFirstLetter("Toyota Camry")).toBe("Toyota Camry"); // Leaves it intact
  });

  it("should handle null or empty inputs gracefully", () => {
    // Use Case: Form fields left empty or uninitialized variables
    expect(capFirstLetter("")).toBe(null);
    expect(capFirstLetter(null)).toBe(null);
    expect(capFirstLetter(undefined)).toBe(null);
  });
});
