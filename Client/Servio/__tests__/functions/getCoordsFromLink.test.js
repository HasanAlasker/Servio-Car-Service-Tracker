import { getLatLngFromGoogleMapsLink } from "../../functions/getCoordsFromLink";

// Mock global fetch
global.fetch = jest.fn();

describe("getCoordsFromLink.js", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getLatLngFromGoogleMapsLink", () => {
    it("should extract coordinates successfully from an @lat,lng matched URL", async () => {
      // Mock follow redirect logic structure returning simulated expanded google maps structure
      fetch.mockResolvedValueOnce({
        url: "https://www.google.com/maps/place/SomePlace/@31.9566,35.9458,15z",
        text: jest.fn(),
      });

      const coords = await getLatLngFromGoogleMapsLink("https://goo.gl/maps/short123");

      expect(coords).toEqual({ lat: 31.9566, lng: 35.9458 });
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("should extract coordinates from a !3d... !4d... structural string pattern", async () => {
      fetch.mockResolvedValueOnce({
        url: "https://www.google.com/maps/place/SomePlace/data=!3m1!4b1!4m5!3m4!1s0x151b5f!8m2!3d31.9566!4d35.9458",
        text: jest.fn(),
      });

      const coords = await getLatLngFromGoogleMapsLink("https://goo.gl/maps/randomstring456");

      expect(coords).toEqual({ lat: 31.9566, lng: 35.9458 });
    });

    it("should scrape HTML using regex parsing if coordinates are not in URL but are in meta tag output", async () => {
      const mockHtmlData = `<html><head><meta content="center=31.9566%2C35.9458"></head></html>`;

      fetch
        .mockResolvedValueOnce({
          url: "https://maps.app.goo.gl/unknownpattern77",
          text: jest.fn(),
        }) // The redirect follow stub
        .mockResolvedValueOnce({
          text: jest.fn().mockResolvedValueOnce(mockHtmlData),
        }); // The page body stub

      const coords = await getLatLngFromGoogleMapsLink("https://maps.app.goo.gl/unknownpattern77");
      
      expect(coords).toEqual({ lat: 31.9566, lng: 35.9458 });
      expect(fetch).toHaveBeenCalledTimes(2); // Follow hit + html scrape hit
    });

    it("should return null gracefully if matchers completely fail or error arises", async () => {
      fetch.mockRejectedValueOnce(new Error("Network Failure"));

      const coords = await getLatLngFromGoogleMapsLink("https://fake-maps-link.com");
      expect(coords).toBeNull();
    });
  });
});
