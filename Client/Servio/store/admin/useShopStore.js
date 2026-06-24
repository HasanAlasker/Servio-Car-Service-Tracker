import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import {
  deleteShop,
  getDeletedShops,
  getUnVerifiedShops,
  getVerifiedShops,
  undeleteShop,
  verifyShop,
} from "../../api/shop";
import { useAdminStore } from "./useAdminStore";

const STORAGE_KEYS = {
  VERIFIED: "@servio_admin_v_shops",
  UNVERIFIED: "@servio_admin_un_v_shops",
  DELETED: "@servio_admin_deleted_shops",
};

export const useShopStore = create((set, get) => ({
  // state
  verifiedShops: null,
  unVerifiedShops: null,
  deletedShops: null,
  loading: false,
  error: false,

  // actions
  loadShops: async () => {
    try {
      const chashedVShops = await AsyncStorage.getItem(STORAGE_KEYS.VERIFIED);
      if (chashedVShops) set({ verifiedShops: JSON.parse(chashedVShops) });

      const cashedUnVShops = await AsyncStorage.getItem(
        STORAGE_KEYS.UNVERIFIED,
      );
      if (cashedUnVShops) set({ unVerifiedShops: JSON.parse(cashedUnVShops) });

      const cashedDeletedShops = await AsyncStorage.getItem(
        STORAGE_KEYS.DELETED,
      );
      if (cashedDeletedShops)
        set({ deletedShops: JSON.parse(cashedDeletedShops) });
    } catch (error) {
      console.log(error);
    }

    try {
      set({ loading: true, error: false });
      const fetchedVshops = await getVerifiedShops();
      const fetchedUnVshops = await getUnVerifiedShops();
      const fetchedDeletedshops = await getDeletedShops();

      set({
        verifiedShops: fetchedVshops.data.data,
        unVerifiedShops: fetchedUnVshops.data.data,
        deletedShops: fetchedDeletedshops.data.data,
        loading: false,
        error: false,
      });

      await AsyncStorage.setItem(
        STORAGE_KEYS.VERIFIED,
        JSON.stringify(fetchedVshops.data.data),
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.UNVERIFIED,
        JSON.stringify(fetchedUnVshops.data.data),
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.DELETED,
        JSON.stringify(fetchedDeletedshops.data.data),
      );

      await useAdminStore.getState().loadDashboard();
    } catch (error) {
      set({ error: true, loading: false });
    }
  },

  // i put A at the end to prevent clashing with api names
  verifyShopA: async (id, routeName) => {
    const source =
      routeName === "AdminShops" ? get().unVerifiedShops : get().deletedShops;

    const shop = source.find((s) => s._id === id);
    shop.isVerified = true;
    shop.isDeleted = false;

    if (routeName === "AdminShops") {
      set({
        unVerifiedShops: get().unVerifiedShops.filter((s) => s._id !== id),
        verifiedShops: [shop, ...get().verifiedShops],
      });
      try {
        await verifyShop(id);
      } catch (error) {
        console.log(error);
      }
    } else {
      set({
        deletedShops: get().deletedShops.filter((s) => s._id !== id),
        verifiedShops: [shop, ...get().verifiedShops],
      });
      try {
        await undeleteShop(id);
      } catch (error) {
        console.log(error);
      }
    }

    await useAdminStore.getState().loadDashboard();
  },

  deleteShopA: async (id, activeTab) => {
    const source =
      activeTab === "1" ? get().verifiedShops : get().unVerifiedShops;

    const shop = source.find((s) => s._id === id);
    shop.isVerified = false;
    shop.isDeleted = true;

    if (activeTab === "2") {
      set({
        unVerifiedShops: get().unVerifiedShops.filter((s) => s._id !== id),
      });
    } else if (activeTab === "1") {
      set({ verifiedShops: get().verifiedShops.filter((s) => s._id !== id) });
    }

    if (shop) {
      set({ deletedShops: [shop, ...get().deletedShops] });
    }

    try {
      await deleteShop(id);
    } catch (error) {
      console.log(error);
    }

    await useAdminStore.getState().loadDashboard();
  },
}));
