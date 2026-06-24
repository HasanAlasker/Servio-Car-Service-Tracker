import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState, useEffect } from "react";
import {
  getCompletedAppointmentsForUser,
  getPastAppointments,
  getUpcomingAppointments,
} from "../api/appointment";
import useApi from "../hooks/useApi";

export const AppointmentContext = createContext();

export const UseAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) throw new Error("UseAppointment must be used within a context");
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [completed, setCompleted] = useState([]);

  const STORAGE_KEYS = {
    PAST_APPOINTMENTS: "@servio_past_appointments",
    UPCOMING_APPOINTMENTS: "@servio_upcoming_appointments",
    COMPLETED_APPOINTMENTS: "@servio_completed_appointments",
  };

  const {
    data: fetchedUpcoming,
    request: fetchUpcoming,
    loading: loadingUpcoming,
    error: errUpcoming,
  } = useApi(getUpcomingAppointments);

  const {
    data: fetchedPast,
    request: fetchPast,
    loading: loadingPast,
    error: errPast,
  } = useApi(getPastAppointments);

  const {
    data: fetchedCompleted,
    request: fetchCompleted,
    loading: loadingCompleted,
    error: errCompleted,
  } = useApi(getCompletedAppointmentsForUser);

  const error = errPast || errCompleted || errUpcoming;
  const loading = loadingPast || loadingUpcoming || loadingCompleted;

  const storeAppointments = async (upcomingApp, pastApp, completdApp) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PAST_APPOINTMENTS,
        JSON.stringify(pastApp),
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.UPCOMING_APPOINTMENTS,
        JSON.stringify(upcomingApp),
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.COMPLETED_APPOINTMENTS,
        JSON.stringify(completdApp),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getStoredAppointments = async () => {
    try {
      const cachedPastApps = await AsyncStorage.getItem(
        STORAGE_KEYS.PAST_APPOINTMENTS,
      );
      const cachedUpcomingApps = await AsyncStorage.getItem(
        STORAGE_KEYS.UPCOMING_APPOINTMENTS,
      );
      const cachedCompletedApps = await AsyncStorage.getItem(
        STORAGE_KEYS.COMPLETED_APPOINTMENTS,
      );
      if (cachedPastApps) setPast(JSON.parse(cachedPastApps));
      if (cachedUpcomingApps) setUpcoming(JSON.parse(cachedUpcomingApps));
      if (cachedCompletedApps) setCompleted(JSON.parse(cachedCompletedApps));
    } catch (error) {
      console.log(error);
    }
  };

  const loadAppointments = async () => {
    getStoredAppointments();
    fetchUpcoming();
    fetchPast();
    fetchCompleted();
  };

  const countAppointments = () => {
    return upcoming.length;
  };

  const isConfirmedAppointments = () => {
    const confirmed = upcoming.map((a) => a.status === "confirmed");
    return confirmed.length > 0;
  };

  useEffect(() => {
    if (fetchedUpcoming && fetchedPast && fetchedCompleted && !error) {
      setUpcoming(fetchedUpcoming);
      setPast(fetchedPast);
      setCompleted(fetchedCompleted);
      storeAppointments(fetchedUpcoming, fetchedPast, fetchedCompleted);
    }
  }, [fetchedUpcoming, fetchedPast, fetchedCompleted]);

  const values = {
    upcoming,
    past,
    completed,
    setPast,
    setUpcoming,
    setCompleted,
    loading,
    loadAppointments,
    countAppointments,
    isConfirmedAppointments,
    fetchCompleted,
  };
  return (
    <AppointmentContext.Provider value={values}>
      {children}
    </AppointmentContext.Provider>
  );
};
