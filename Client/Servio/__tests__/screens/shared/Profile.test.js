import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import Profile from "../../../screens/shared/Profile";
import { UseUser } from "../../../context/UserContext";

jest.mock("../../../context/UserContext", () => ({
  UseUser: jest.fn(),
}));

// Mock UserCard so we can easily trigger the handleEditPress callback 
// without relying on deeply nested icon SVGs.
jest.mock("../../../components/cards/UserCard", () => {
  const { Pressable, Text } = require("react-native");
  return ({ handleEditPress }) => (
    <Pressable testID="mocked-edit-btn" onPress={handleEditPress}>
      <Text>Trigger Edit</Text>
    </Pressable>
  );
});

jest.mock("../../../hooks/useAppToast", () => {
  return jest.fn(() => ({
    success: jest.fn(),
    error: jest.fn(),
  }));
});

describe("Profile (Edit Profile Screen) Integration Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render initially closed, and reveal the Form when Edit is pressed", async () => {
    UseUser.mockReturnValue({
      user: { name: "Suad", phone: "+962123456789", _id: "u1" },
      editProfile: jest.fn(),
    });

    const { queryByPlaceholderText, getByTestId, getByPlaceholderText } = render(<Profile />);

    // Initially closed, form shouldn't exist
    expect(queryByPlaceholderText("Name")).toBeNull();

    // Trigger edit button
    fireEvent.press(getByTestId("mocked-edit-btn"));

    await waitFor(() => {
      // The form fields should now be visible and hydrated with User context
      expect(getByPlaceholderText("Name").props.value).toBe("Suad");
      expect(getByPlaceholderText("Phone").props.value).toBe("+962123456789");
    });
  });

  it("should enforce validation and prevent invalid phone numbers", async () => {
    UseUser.mockReturnValue({
      user: { name: "Ahmed", phone: "+962123456789" },
      editProfile: jest.fn(),
    });

    const { getByTestId, getByPlaceholderText, getByText, queryByText } = render(<Profile />);

    fireEvent.press(getByTestId("mocked-edit-btn"));

    // Introduce an invalid phone number
    fireEvent.changeText(getByPlaceholderText("Phone"), "123"); // Too short
    fireEvent.changeText(getByPlaceholderText("Name"), "A"); // Too short

    // Attempt Submission
    await act(async () => {
      fireEvent.press(getByText("Save"));
    });

    await waitFor(() => {
      expect(getByText("Name must be at least 2 characters long")).toBeTruthy();
      expect(getByText("Please enter a valid phone number")).toBeTruthy();
    });
  });

  it("should successfully trigger the editProfile context updater", async () => {
    const mockEditProfile = jest.fn(async () => ({ success: true, message: "OK" }));
    
    UseUser.mockReturnValue({
      user: { name: "Jbara", phone: "+962987654321" },
      editProfile: mockEditProfile,
    });

    const { getByTestId, getByPlaceholderText, getByText, queryByPlaceholderText } = render(<Profile />);

    fireEvent.press(getByTestId("mocked-edit-btn"));

    // Modify User Data
    fireEvent.changeText(getByPlaceholderText("Name"), "Jbara Updated");
    
    // Save
    fireEvent.press(getByText("Save"));

    await waitFor(() => {
      // Form should dismiss upon successful update
      expect(mockEditProfile).toHaveBeenCalledWith({
        name: "Jbara Updated",
        phone: "+962987654321"
      });
      // The form clears naturally because isEdit falls to false
      expect(queryByPlaceholderText("Name")).toBeNull(); 
    });
  });

  it("should capture and display API errors upon failed submission", async () => {
    const mockEditProfile = jest.fn(async () => ({ success: false, message: "Server connection failed" }));
    
    UseUser.mockReturnValue({
      user: { name: "Tester", phone: "+962123456780" },
      editProfile: mockEditProfile,
    });

    const { getByTestId, getByText } = render(<Profile />);

    fireEvent.press(getByTestId("mocked-edit-btn"));
    fireEvent.press(getByText("Save"));

    await waitFor(() => {
      expect(getByText("Server connection failed")).toBeTruthy();
    });
  });
});
