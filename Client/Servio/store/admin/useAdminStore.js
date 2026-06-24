import { create } from "zustand";
import { adminCountDocs } from "../../api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  DASHBOARD: "@servio_admin_dashboard",
};

export const useAdminStore = create((set, get) => ({
  // state
  dashboard: null,
  error: false,
  message: null,
  loading: false,

  // actions
  loadDashboard: async () => {
    // get data in asyncStorage
    try {
      const cashedData = await AsyncStorage.getItem(STORAGE_KEYS.DASHBOARD);
      if (cashedData) set({ dashboard: JSON.parse(cashedData) });
    } catch (error) {
      console.log(error);
    }

    // fetch from api (to refresh data)
    try {
      set({ loading: true, error: false });
      const dashDocs = await adminCountDocs();
      set({ dashboard: dashDocs.data.data, loading: false });
      await AsyncStorage.setItem(
        STORAGE_KEYS.DASHBOARD,
        JSON.stringify(dashDocs.data.data),
      );
    } catch (error) {
      set({
        error: true,
        loading: false,
        message: error?.response?.data?.message || "Something went wrong!",
      });
      console.log(error);
    }
  },
}));

// notes:
// 1. you can't use a react hook inside a zustand action (ex: useApi)
// 2. you have to make sure you get the right data (depending on api response stucture)
