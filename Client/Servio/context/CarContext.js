import { useContext, createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "../hooks/useApi";
import { getMyCars } from "../api/car";
import { useEffect } from "react";
import { UseService } from "./ServiceContext";

export const CarContext = createContext();

export const UseCar = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error("UseCar must be used within a provider");
  }
  return context;
};

export const CarProvider = ({ children }) => {
  const { loadServices } = UseService();
  const [cars, setCars] = useState([]);

  const {
    data: carsData,
    request: fetchCars,
    error,
    loading,
    message,
    success,
  } = useApi(getMyCars);

  const STORAGE_KEYS = {
    CARS: "@servio_cars",
  };

  const storeCars = async (cars) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
    } catch (error) {
      console.log(error);
    }
  };

  const getStoredCars = async () => {
    try {
      const cachedCars = await AsyncStorage.getItem(STORAGE_KEYS.CARS);
      if (cachedCars) setCars(JSON.parse(cachedCars));
    } catch (error) {
      console.log(error);
    }
  };

  const loadCars = () => {
    getStoredCars();
    fetchCars();
  };

  useEffect(() => {
    if (carsData && !error) {
      setCars(carsData);
      storeCars(carsData);
    }
  }, [carsData]);

  const addNewCar = async (newCar) => {
    const updated = [newCar, ...cars];
    setCars(updated);
    storeCars(updated);
    await loadServices();
  };

  const updateCars = async (updatedCar) => {
    const updated = cars.map((c) =>
      c._id === updatedCar._id ? updatedCar : c,
    );
    setCars(updated);
    storeCars(updated);
    await loadServices();
  };

  const removeCar = async (removedCar) => {
    const updated = cars.filter((c) => c._id !== removedCar._id);
    setCars(updated);
    storeCars(updated);
    await loadServices();
  };

  const countCars = () => {
    return cars.length;
  };

  const value = {
    cars,
    error,
    message,
    loading,
    loadCars,
    addNewCar,
    updateCars,
    removeCar,
    countCars,
  };

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
};
