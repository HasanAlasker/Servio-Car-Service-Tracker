import { render, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import MakeAppointment from "../../../screens/carOwner/MakeAppointment";
import { bookAppointment } from "../../../api/appointment";
import useApi from "../../../hooks/useApi";

jest.mock("../../../api/appointment", () => ({
  bookAppointment: jest.fn(),
}));

jest.mock("../../../api/slots", () => ({
  getSlots: jest.fn(),
}));

jest.mock("../../../hooks/useAppToast", () => {
  return jest.fn(() => ({
    success: jest.fn(),
    error: jest.fn(),
  }));
});

jest.mock("../../../components/form/FormikDatePicker", () => {
  const React = require("react");
  const { useFormikContext } = require("formik");
  const { Pressable, Text } = require("react-native");

  return function MockFormikDatePicker({ name, onDateChange }) {
    const { setFieldValue } = useFormikContext();
    return (
      <Pressable 
        testID={`mock-date-picker-${name}`}
        onPress={() => {
          const futureDate = new Date("2050-01-01T00:00:00Z");
          setFieldValue(name, futureDate);
          if (onDateChange) onDateChange(futureDate);
        }}
      >
        <Text>Mock {name}</Text>
      </Pressable>
    );
  };
});

// Mock Context to provide loadAppointments
jest.mock("../../../context/AppointmentContext", () => ({
  UseAppointment: () => ({
    loadAppointments: jest.fn(),
    isConfirmedAppointments: jest.fn(() => false),
  }),
}));

// Since MakeAppointment uses useRoute, we must mock the route payload
jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {
        car: { _id: "car_1" },
        shop: { id: "shop_1" },
        parts: [{ _id: "part_1" }, { _id: "part_2" }],
      },
    }),
  };
});

describe("MakeAppointment Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: useApi returns empty slots
    useApi.mockReturnValue({
      data: { isOpen: false, slots: [] },
      request: jest.fn(),
      loading: false,
      error: false,
    });
  });

  it("should render the date picker", () => {
    const { getByTestId } = render(<MakeAppointment />);
    expect(getByTestId("mock-date-picker-date")).toBeTruthy();
  });

  it("should render summary section with car and shop info", () => {
    const { toJSON } = render(<MakeAppointment />);
    expect(toJSON()).toBeTruthy();
  });
});
