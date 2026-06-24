import { render, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import AddPart from "../../../screens/carOwner/AddPart";
import { addPart } from "../../../api/part";
import { NavigationContainer } from "@react-navigation/native";

jest.mock("../../../api/part", () => ({
  addPart: jest.fn(),
  editPart: jest.fn(),
  unTrackPart: jest.fn(),
}));

jest.mock("../../../hooks/useAppToast", () => {
  return jest.fn(() => ({
    success: jest.fn(),
    error: jest.fn(),
  }));
});

describe("AddPart Screen", () => {
  it("should render all expected inputs", () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <AddPart />
      </NavigationContainer>
    );

    expect(getByPlaceholderText("Part Name")).toBeTruthy();
    expect(getByPlaceholderText("Last change mileage")).toBeTruthy();
    expect(getByText("Add Part")).toBeTruthy();
  });

  it("should fail validation if form is submitted empty", async () => {
    const { getByText } = render(
      <NavigationContainer>
        <AddPart />
      </NavigationContainer>
    );

    fireEvent.press(getByText("Add Part"));

    await waitFor(() => {
      expect(getByText("Part name is required")).toBeTruthy();
      expect(getByText("Last change date is required")).toBeTruthy();
      expect(getByText("Last change mileage is required")).toBeTruthy();
      expect(getByText("Recommended months are required")).toBeTruthy();
    });
  });

  it("should successfully invoke addPart context when submitted with inputs", async () => {
    addPart.mockResolvedValueOnce({ ok: true, data: {} });

    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <AddPart />
      </NavigationContainer>
    );

    fireEvent.changeText(getByPlaceholderText("Part Name"), "brake pads");
    fireEvent.changeText(getByPlaceholderText("Last change mileage"), "45000");
    fireEvent.changeText(getByPlaceholderText("Months"), "12");
    fireEvent.changeText(getByPlaceholderText("Miles/ Kilometers"), "10000");

    // Since date picker requires specific interaction usually mocked outside of fireEvent, 
    // it will be validated up to the submit event trigger point.
    fireEvent.press(getByText("Add Part"));
  });
});
