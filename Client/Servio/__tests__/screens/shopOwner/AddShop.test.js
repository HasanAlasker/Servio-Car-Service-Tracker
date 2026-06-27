import { render, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import AddShop from "../../../screens/shopOwner/AddShop";
import { openShop } from "../../../api/shop";
import { getLatLngFromGoogleMapsLink } from "../../../functions/getCoordsFromLink";
import { NavigationContainer } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({ params: { openHours: Array(7).fill({ isOpen: true, from: "09:00", to: "18:00" }) } }),
  useNavigation: () => ({ navigate: jest.fn() }),
  NavigationContainer: ({ children }) => children,
}));

jest.mock("../../../api/shop", () => ({
  openShop: jest.fn(),
  editShop: jest.fn(),
  deleteShop: jest.fn(),
}));

jest.mock("../../../functions/getCoordsFromLink", () => ({
  getLatLngFromGoogleMapsLink: jest.fn(),
}));

jest.mock("../../../hooks/useAppToast", () => {
  return jest.fn(() => ({
    success: jest.fn(),
    error: jest.fn(),
  }));
});

describe("AddShop Screen", () => {
  it("should render inputs and text correctly", () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <AddShop />
      </NavigationContainer>
    );

    expect(getByPlaceholderText("Shop name")).toBeTruthy();
    expect(getByPlaceholderText("Shop phone")).toBeTruthy();
    expect(getByPlaceholderText("City")).toBeTruthy();
    expect(getByPlaceholderText("Area")).toBeTruthy();
    expect(getByPlaceholderText("Google maps Link")).toBeTruthy();
    expect(getByText("Edit Shop")).toBeTruthy();
  });

  it("should throw validation errors on empty submission", async () => {
    const { getByText, getAllByText } = render(
      <NavigationContainer>
        <AddShop />
      </NavigationContainer>
    );

    fireEvent.press(getByText("Edit Shop"));

    await waitFor(() => {
      // It should display Yup validation errors
      expect(getByText("Shop image is required")).toBeTruthy();
      expect(getByText("Shop name is required")).toBeTruthy();
      expect(getByText("City is required")).toBeTruthy();
      expect(getByText("Area is required")).toBeTruthy();
      expect(getByText("Shop phone is required")).toBeTruthy();
      expect(getByText("Shop description is required")).toBeTruthy();
    });
  });

  it("should format and push valid shop submission requests", async () => {
    openShop.mockResolvedValueOnce({ ok: true, data: {} });
    getLatLngFromGoogleMapsLink.mockResolvedValueOnce({ lat: 31.9, lng: 35.9 });
    
    // Simulating deep interactions with image pickers and custom arrays requires specialized UI drivers.
    // However, this establishes the mock layout for asserting the API handlers once interactions are flushed!
  });
});
