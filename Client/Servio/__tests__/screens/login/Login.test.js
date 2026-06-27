import { render, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import Login from "../../../screens/login/Login";
import { UseUser } from "../../../context/UserContext";

jest.mock("../../../context/UserContext", () => ({
  UseUser: jest.fn(),
}));

describe("Login Screen (Integration Test)", () => {
  beforeEach(() => {
    UseUser.mockReturnValue({
      login: jest.fn(),
      error: false,
      message: null,
      loading: false,
    });
  });

  it("should render successfully with mocked contexts", () => {
    const { getByPlaceholderText, getByText } = render(<Login />);
    
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
  });

  it("should display validation errors for empty fields", async () => {
    const { getByText } = render(<Login />);
    
    // Press login without filling form
    fireEvent.press(getByText("Login"));

    // Validation schema should throw require errors
    await waitFor(() => {
      expect(getByText("Email is required")).toBeTruthy();
      expect(getByText("Password is required")).toBeTruthy();
    });
  });

  it("should call the Mocked login function with valid credentials", async () => {
    const mockLogin = jest.fn(async () => ({ success: true }));
    
    // Override the globally mocked UseUser for this specific test persistently
    UseUser.mockReturnValue({
      login: mockLogin,
      error: false,
      message: null,
      loading: false,
      status: 200,
    });

    const { getByPlaceholderText, getByText } = render(<Login />);
    
    // Fill the inputs
    fireEvent.changeText(getByPlaceholderText("Email"), "test@meu.edu.jo");
    fireEvent.changeText(getByPlaceholderText("Password"), "securePassword123");

    // Submit
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@meu.edu.jo",
        password: "securePassword123"
      });
    });
  });

  it("should display API or Context error messages upon unsuccessful login", async () => {
    const mockLoginFailed = jest.fn(async () => ({ success: false }));
    
    UseUser.mockReturnValue({
      login: mockLoginFailed,
      error: true,
      message: "Invalid credentials provided",
      loading: false,
      status: 401,
    });

    const { getByPlaceholderText, getByText } = render(<Login />);
    
    fireEvent.changeText(getByPlaceholderText("Email"), "wrong@user.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "wrongpass");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(getByText("Invalid credentials provided")).toBeTruthy();
    });
  });
});
