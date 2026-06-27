jest.unmock("../../context/UserContext");

import React from "react";
import { render, waitFor, act } from "@testing-library/react-native";
import { UserProvider, UseUser } from "../../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// The context leverages API wrappers that we can mock 
import { loginUser } from "../../api/user";

// The context leverages API wrappers that we can mock 
jest.mock("../../api/user", () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
  editUser: jest.fn(),
  getMe: jest.fn(),
  refreshToken: jest.fn(),
}));

jest.mock("../../functions/getLocation", () => ({
  getApproximateLocation: jest.fn().mockResolvedValue({ lat: 31.9, lng: 35.9 }),
}));

jest.mock("../../functions/notificationToken", () => ({
  unregisterPushToken: jest.fn(),
}));

// We need a dummy component to interact with the context
const DummyComponent = () => {
  const { isAuthenticated, login, logout, isShopOwner, loading } = UseUser();

  return (
    <React.Fragment>
      <span testID="auth-status">{isAuthenticated ? "auth" : "no-auth"}</span>
      <span testID="role-status">{isShopOwner ? "shop-owner" : "not-shop-owner"}</span>
      <span testID="loading-status">{loading ? "loading" : "idle"}</span>

      <button testID="login-btn" onClick={() => login({ email: "test@test.com", password: "123" })}>
        Login
      </button>
      <button testID="logout-btn" onClick={() => logout()}>
        Logout
      </button>
    </React.Fragment>
  );
};

describe("UserContext State Management", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear(); // Clear mocked AsyncStorage state
  });

  it("defaults to explicitly non-authenticated upon startup before load", () => {
    const { getByTestId } = render(
      <UserProvider>
        <DummyComponent />
      </UserProvider>
    );

    expect(getByTestId("auth-status").props.children).toBe("no-auth");
  });

  it("should accurately manage state upon successful login", async () => {
    const mockUserPayload = { 
      _id: "user123", 
      name: "Shop Keeper", 
      role: "shopOwner" 
    };

    loginUser.mockResolvedValueOnce({
      ok: true,
      status: 200,
      data: { success: true, data: mockUserPayload, message: "OK" },
      headers: { "x-auth-token": "fake-jwt-token" }
    });

    const { getByTestId } = render(
      <UserProvider>
        <DummyComponent />
      </UserProvider>
    );

    // Call login
    await act(async () => {
      getByTestId("login-btn").props.onClick();
    });

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledTimes(1);
      expect(getByTestId("auth-status").props.children).toBe("auth");
      expect(getByTestId("role-status").props.children).toBe("shop-owner");
    });

    // Check async storage saved correctly
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@servio_user", JSON.stringify(mockUserPayload));
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("@servio_token", "fake-jwt-token");
  });

  it("should clear everything on logout", async () => {
    const { getByTestId } = render(
      <UserProvider>
        <DummyComponent />
      </UserProvider>
    );

    await act(async () => {
      getByTestId("logout-btn").props.onClick();
    });

    await waitFor(() => {
      expect(getByTestId("auth-status").props.children).toBe("no-auth");
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(["@servio_user", "@servio_token"]);
    });
  });
});
