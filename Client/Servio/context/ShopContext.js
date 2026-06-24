import { createContext, useContext, useState, useEffect } from "react";
import useApi from "../hooks/useApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMyShops } from "../api/shop";

export const ShopContext = createContext();

export const UseShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("UseShop must be used within a context");
  return context;
};

export const ShopProvider = ({ children }) => {
  const [shops, setShops] = useState([]);

  const STORAGE_KEYS = {
    SHOPS: "@servio_shops",
  };

  const {
    data: fetchedShops,
    request: fetchShops,
    loading,
    error,
  } = useApi(getMyShops);

  const storeShops = async (shops) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(shops));
    } catch (error) {
      console.log(error);
    }
  };

  const getStoredShops = async () => {
    try {
      const cachedShops = await AsyncStorage.getItem(STORAGE_KEYS.SHOPS);
      if (cachedShops) setShops(JSON.parse(cachedShops));
    } catch (error) {
      console.log(error);
    }
  };

  const loadShops = async () => {
    getStoredShops();
    fetchShops();
  };

  useEffect(() => {
    if (fetchedShops && !error) {
      setShops(fetchedShops);
      storeShops(fetchedShops);
    }
  }, [fetchedShops]);

  const countShops = () => {
    const counted = shops.map((s) => !s.isDeleted && s.isVerified);
    return counted.length;
  };

  const values = {
    shops,
    setShops,
    loadShops,
    countShops,
    loading,
  };

  return <ShopContext.Provider value={values}>{children}</ShopContext.Provider>;
};
