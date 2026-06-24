import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import {
  closeReport,
  getClosedReports,
  getOpenReports,
  openReport,
} from "../../api/report";
import { useAdminStore } from "./useAdminStore";

const KEY_STORAGE = {
  OPEN_REPORTS: "@servio_open_reports",
  CLOSED_REPORTS: "@servio_closed_reports",
};

export const useReportStore = create((set, get) => ({
  open: null,
  closed: null,
  loading: false,
  error: false,

  loadReports: async () => {
    try {
      const cashedOpen = await AsyncStorage.getItem(KEY_STORAGE.OPEN_REPORTS);
      if (cashedOpen) set({ open: JSON.parse(cashedOpen) });

      const cashedClosed = await AsyncStorage.getItem(
        KEY_STORAGE.CLOSED_REPORTS,
      );
      if (cashedClosed) set({ closed: JSON.parse(cashedClosed) });
    } catch (error) {
      console.log(error);
    }

    try {
      set({ loading: true, error: false });

      const openRes = await getOpenReports();
      const closedRes = await getClosedReports();

      set({
        open: openRes.data.data,
        closed: closedRes.data.data,
        loading: false,
      });

      await AsyncStorage.setItem(
        KEY_STORAGE.OPEN_REPORTS,
        JSON.stringify(openRes.data.data),
      );
      await AsyncStorage.setItem(
        KEY_STORAGE.CLOSED_REPORTS,
        JSON.stringify(closedRes.data.data),
      );
    } catch (error) {
      set({ error: true, loading: false });
    }
  },

  closeReport: async (id) => {
    try {
      const report = get().open.find((r) => r._id === id);
      report.status = "closed";
      report.updatedAt = new Date();

      const updated = get().open.filter((r) => r._id !== id);
      set({ open: updated, closed: [report, ...get().closed] });

      const res = await closeReport(id);
      if (res.ok) useAdminStore.getState().loadDashboard();
    } catch (error) {
      console.log(error);
    }
  },

  openReport: async (id) => {
    try {
      const report = get().closed.find((r) => r._id === id);
      report.status = "open";

      const updated = get().closed.filter((r) => r._id !== id);
      set({ closed: updated, open: [report, ...get().open] });

      const res = await openReport(id);
      if (res.ok) useAdminStore.getState().loadDashboard();
    } catch (error) {
      console.log(error);
    }
  },
}));
