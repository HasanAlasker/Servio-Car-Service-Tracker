import { createContext, useContext, useState, useEffect } from "react";
import useApi from "../hooks/useApi";
import { getUpcomingServices } from "../api/upcomingService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ServiceContext = createContext();

export const UseService = () => {
  const context = useContext(ServiceContext);
  if (!context) throw new Error("UseService must be used within a context");
  return context;
};

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);

  const STORAGE_KEYS = {
    SERVICES: "@servio_services",
  };

  const {
    data: fetchedServices,
    request: fetchServices,
    loading,
    error,
  } = useApi(getUpcomingServices);

  const storeServices = async (services) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SERVICES,
        JSON.stringify(services),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getStoredServices = async () => {
    try {
      const cachedServices = await AsyncStorage.getItem(STORAGE_KEYS.SERVICES);
      if (cachedServices) setServices(JSON.parse(cachedServices));
    } catch (error) {
      console.log(error);
    }
  };

  const loadServices = async () => {
    try {
      getStoredServices();
      fetchServices();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (fetchedServices && !error) {
      setServices(fetchedServices);
      storeServices(fetchedServices);
    }
  }, [fetchedServices]);

  const countDueServices = () => {
    const due = services.map(
      (s) => s.status === "due" || s.status === "overdue",
    );
    return due.length;
  };

  const values = {
    services,
    setServices,
    storeServices,
    loadServices,
    getStoredServices,
    loading,
    fetchServices,
    countDueServices,
  };

  return (
    <ServiceContext.Provider value={values}>{children}</ServiceContext.Provider>
  );
};
