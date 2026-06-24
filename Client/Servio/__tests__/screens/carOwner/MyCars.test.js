import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import MyCars from "../../../screens/carOwner/MyCars";
import { UseCar } from "../../../context/CarContext";
import { useNavigation } from "@react-navigation/native";

jest.mock("../../../context/CarContext", () => ({
  UseCar: jest.fn(),
}));

// Since CarCard pushes using useNavigation, we mock Navigation stack globally
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(() => ({ name: "MyCars" }))
}));

describe("Master-Detail Navigation Workflow (MyCars Screen)", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue({
      navigate: mockNavigate,
    });
  });

  it("should display a fallback message when no cars exist", () => {
    UseCar.mockReturnValue({
      cars: [],
      loading: false,
      loadCars: jest.fn(),
    });

    const { getByText } = render(<MyCars />);
    
    expect(getByText(/You haven't added any cars/i)).toBeTruthy();
    // And assert AddCar button is available regardless
    expect(getByText("Add Car")).toBeTruthy();
  });

  it("should successfully trigger Master-Detail boundary payload when a User selects a Car", async () => {
    const mockCarObjects = [
      {
        _id: "car_1",
        make: "toyota",
        name: "corolla",
        plateNumber: "1234-A",
        model: 2015,
        color: "silver",
        mileage: 65000,
        unit: "km",
        image: "https://dummy.com/car.jpg"
      },
      {
        _id: "car_2",
        make: "honda",
        name: "civic",
        plateNumber: "5678-B",
        model: 2020,
        color: "black",
        mileage: 20000,
        unit: "miles"
      }
    ];

    UseCar.mockReturnValue({
      cars: mockCarObjects,
      loading: false,
      loadCars: jest.fn(),
    });

    const { getByText, queryByText } = render(<MyCars />);

    // Assert that the context mapping successfully expanded into physical cards
    expect(getByText("Toyota Corolla")).toBeTruthy(); 
    expect(getByText("Honda Civic")).toBeTruthy();

    expect(queryByText("You haven't added any cars yet")).toBeNull();

    // Trigger user pressing the Toyota Corolla card 
    // In React Native Testing Library, tapping text triggers highest Pressable 
    fireEvent.press(getByText("Toyota Corolla"));

    await waitFor(() => {
      // Very specifically, assert the precise navigation event. 
      // This is crucial to ensure the 'detail' screen receives exactly what it needs.
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("CarParts", {
        id: "car_1",
        image: "https://dummy.com/car.jpg",
        make: "toyota",
        name: "corolla",
        plateNumber: "1234-A",
        model: 2015,
        color: "silver",
        mileage: 65000,
        unit: "km",
      });
    });
  });

  it("should navigate to AddCar flow when interacting with the floating addition card", async () => {
    UseCar.mockReturnValue({
      cars: [],
      loading: false,
      loadCars: jest.fn(),
    });

    const { getByText } = render(<MyCars />);
    
    // Trigger pressing "Add Car"
    fireEvent.press(getByText("Add Car"));

    // Assert navigation router redirects to the blank creation form
    expect(mockNavigate).toHaveBeenCalledWith("AddCar");
  });
});
