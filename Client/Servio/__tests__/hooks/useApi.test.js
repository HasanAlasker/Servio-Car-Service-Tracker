jest.unmock("../../hooks/useApi");

import { renderHook, act, waitFor } from "@testing-library/react-native";
import useApi from "../../hooks/useApi";

describe("useApi Hook", () => {
  it("should initialize with default states", () => {
    const mockApiCall = jest.fn();
    const { result } = renderHook(() => useApi(mockApiCall));

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBeDefined();
    expect(result.current.message).toBeNull();
  });

  it("should update state on a successful API request", async () => {
    const mockSuccessResponse = {
      ok: true,
      status: 200,
      data: { success: true, data: [{ id: 1 }], message: "Fetched successfully" },
    };
    
    // Simulate API delay
    const mockApiCall = jest.fn().mockResolvedValue(mockSuccessResponse);

    const { result } = renderHook(() => useApi(mockApiCall));

    await act(async () => {
      await result.current.request();
    });

    expect(result.current.success).toBe(true);
    expect(result.current.status).toBe(200);
  });

  it("should update state on a failed API request", async () => {
    const mockErrorResponse = {
      ok: false,
      status: 400,
      data: { message: "Invalid payload" },
    };
    
    const mockApiCallError = jest.fn().mockResolvedValue(mockErrorResponse);

    const { result } = renderHook(() => useApi(mockApiCallError));

    await act(async () => {
      await result.current.request();
    });

    expect(result.current.status).toBe(400);
  });
});
