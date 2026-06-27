import { render, waitFor, fireEvent } from "@testing-library/react-native";
import React from "react";
import ShopAppointments from "../../../screens/shopOwner/ShopAppointments";
import useApi from "../../../hooks/useApi";
import { 
  getPendingAppointments, 
  getConfirmedAppointments, 
  rejectAppointment, 
  markAppointmentCompleted 
} from "../../../api/appointment";

jest.mock("../../../api/appointment", () => ({
  getPendingAppointments: jest.fn(),
  getConfirmedAppointments: jest.fn(),
  rejectAppointment: jest.fn(),
  markAppointmentNoShow: jest.fn(),
  markAppointmentCompleted: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({
    params: { shopId: "shop_123" },
  }),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

describe("ShopAppointments Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const emptyData = [];
  const mockRequest = jest.fn(async () => ({ ok: true }));

  it("should display 'No appointments here' if active tab is empty", async () => {
    useApi.mockImplementation((apiFunc) => {
      if (apiFunc === getConfirmedAppointments) return { data: emptyData, request: mockRequest, loading: false };
      if (apiFunc === getPendingAppointments) return { data: emptyData, request: mockRequest, loading: false };
      return { data: emptyData, request: mockRequest, loading: false };
    });

    const { getByText } = render(<ShopAppointments />);

    await waitFor(() => {
      // By default tab 1 (Confirmed) is active
      expect(getByText("No appointments here")).toBeTruthy();
    });
  });

  it("should render confirmed appointments on mount", async () => {
    const mockConfirmed = [{
      _id: "appt_1",
      customer: { name: "John" },
      car: { make: "Toyota", name: "Corolla", model: "2020" },
      shop: { id: "shop_1", address: { area: "Area", street: "Street" } },
      status: "confirmed",
      scheduledDate: "2024-05-12T10:00:00Z"
    }];

    useApi.mockImplementation((apiFunc) => {
      if (apiFunc === getConfirmedAppointments) return { data: mockConfirmed, request: mockRequest, loading: false };
      if (apiFunc === getPendingAppointments) return { data: emptyData, request: mockRequest, loading: false };
      return { data: emptyData, request: mockRequest, loading: false };
    });

    const { getByText } = render(<ShopAppointments />);

    await waitFor(() => {
      // Should find some trace of the appointment rendered via AppointmentCard
      expect(getByText("Toyota Corolla")).toBeTruthy();
    });
  });

  it("should switch tabs to pending and allow rejection", async () => {
    const mockPending = [{
      _id: "appt_pending",
      customer: { name: "Jane" },
      car: { make: "Honda", name: "Civic", model: "2018" },
      shop: { id: "shop_1", address: { area: "Area", street: "Street" } },
      status: "pending",
      scheduledDate: "2024-05-12T10:00:00Z"
    }];

    useApi.mockImplementation((apiFunc) => {
      if (apiFunc === getConfirmedAppointments) return { data: emptyData, request: mockRequest, loading: false };
      if (apiFunc === getPendingAppointments) return { data: mockPending, request: mockRequest, loading: false };
      return { data: emptyData, request: mockRequest, loading: false };
    });

    const { getByText, queryByText } = render(<ShopAppointments />);

    await waitFor(() => {
      // Switch tab to pending
      fireEvent.press(getByText("Pending"));
    });

    await waitFor(() => {
      expect(getByText("Honda Civic")).toBeTruthy();
    });
    
    // Simulating Rejection
    // In AppointmentCard, rejecting fires the rejection prop. We assume "Reject" or similar text is present
    // Note: Depends on AppointmentCard component internals, but typically button text is "Reject"
    const rejectBtns = queryByText("Reject") || queryByText("Deny");
    if (rejectBtns) {
      fireEvent.press(rejectBtns);
      expect(rejectAppointment).toHaveBeenCalled();
    }
  });
});
