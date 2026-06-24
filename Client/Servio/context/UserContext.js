import { useContext, createContext, useState } from "react";
import {
  editUser,
  getMe,
  loginUser,
  refreshToken,
  registerUser,
} from "../api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isServerAwake } from "../api/upcomingService";
import { jwtDecode } from "jwt-decode";
import { UseCar } from "./CarContext";
import { UseService } from "./ServiceContext";
import { UseAppointment } from "./AppointmentContext";
import { UseShop } from "./ShopContext";
import { unregisterPushToken } from "../functions/notificationToken";
import { getApproximateLocation } from "../functions/getLocation";
import useAppToast from "../hooks/useAppToast";
import { Alert, Linking } from "react-native";
import * as Device from "expo-device";

export const UserContext = createContext();

export const UseUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UseUser must be used within a provider");
  }
  return context;
};

const isTokenExpired = (token) => {
  try {
    if (!token) return true;

    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [appStart, setAppStart] = useState(false);
  const [status, setStatus] = useState(null);
  const [serverAwake, setServerAwake] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [onBoarded, setOnBoarded] = useState(false);
  const [showPartNote, setPartNote] = useState(true);
  const [showServiceNote, setServiceNote] = useState(true);

  const { loadCars } = UseCar();
  const { loadServices } = UseService();
  const { loadAppointments } = UseAppointment();
  const { loadShops } = UseShop();
  const toast = useAppToast();

  const mockLocation = {
    city: "Amman",
    lat: 31.963158,
    lng: 31.963158,
  };

  const STORAGE_KEYS = {
    USER: "@servio_user",
    TOKEN: "@servio_token",
    ONBOARDED: "@servio_onboarded",
    PARTNOTE: "@servio_part_note",
    SERVICENOTE: "@servio_service_note",
  };

  const onBoardUser = async () => {
    setOnBoarded(true);
    await AsyncStorage.setItem("@servio_onboarded", "true");
  };

  const hideNote = async (noteType) => {
    noteType === "partNote" ? setPartNote(false) : setServiceNote(false);
    await AsyncStorage.setItem(
      noteType === "partNote" ? "@servio_part_note" : "@servio_service_note",
      "false",
    );
  };

  const fetchUserLocation = async () => {
    try {
      const location = Device.isDevice
        ? await getApproximateLocation()
        : mockLocation;

      // console.log("Location", location);

      if (!location) {
        toast.error("Nearby shops unknown");
        return;
      }

      if (location.denied) {
        toast.error("Nearby shops unknown");

        if (Platform.OS !== "web") {
          Alert.alert(
            "Location Permission",
            "Please enable location access in your device settings to find shops nearby.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() },
            ],
          );
        } else {
          window.alert(
            "Please enable location access in your browser to find shops nearby.",
          );
        }
        return;
      }

      setUserLocation(location);

      // console.log(location);
    } catch (e) {
      console.log("Error ", e);
      toast.error("Nearby shops unknown");
    }
  };

  const refreshUserToken = async (userId) => {
    try {
      if (!userId) {
        console.log("No user ID provided");
        return { success: false, message: "No user ID" };
      }

      const res = await refreshToken(userId);

      const responseMessage = res.data?.message;
      const responseStatus = res.status;

      if (!res.ok) {
        setError(true);
        setMessage(responseMessage);
        setStatus(responseStatus);
        return {
          success: false,
          message: responseMessage,
          status: responseStatus,
        };
      }

      const refreshedUser = res.data.data;
      const refreshedtoken = res.headers["x-auth-token"];

      if (refreshedUser.isDeleted) logout();

      const tokenIsExpired = isTokenExpired(refreshedtoken);
      if (tokenIsExpired) logout();

      setUser(refreshedUser);
      setMessage(responseMessage);
      setStatus(responseStatus);
      await storeUserData(refreshedUser, refreshedtoken);

      return {
        success: true,
        message: responseMessage,
        status: responseStatus,
      };
    } catch (error) {
      console.error("Error removing user data", error);
    }
  };

  const loadUserData = async () => {
    setLoading(false);
    setAppStart(false);
    try {
      setLoading(true);
      setAppStart(true);
      const loadedOnBoarded = await AsyncStorage.getItem(
        STORAGE_KEYS.ONBOARDED,
      );
      const loadedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const loadedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const loadedPartNote = await AsyncStorage.getItem(STORAGE_KEYS.PARTNOTE);
      const loadedServiceNote = await AsyncStorage.getItem(
        STORAGE_KEYS.SERVICENOTE,
      );

      if (loadedOnBoarded === "true") setOnBoarded(true);
      if (loadedPartNote === "false") setPartNote(false);
      if (loadedServiceNote === "false") setServiceNote(false);

      if (loadedUser && loadedToken) {
        const parsedUser = JSON.parse(loadedUser);
        setUser(parsedUser);
        setToken(loadedToken);
        setIsAuthenticated(true);

        await refreshUserToken(parsedUser._id);
      }
    } catch (error) {
      console.error("Error loading stored user", error);
    } finally {
      setLoading(false);
      setAppStart(false);
      setAuthLoaded(true);
    }
  };

  const storeUserData = async (user, token) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error("Error storing user data", error);
    }
  };

  const removeUserData = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.TOKEN]);
    } catch (error) {
      console.error("Error removing user data", error);
    }
  };

  const checkServerConnection = async () => {
    try {
      setLoading(true);
      setError(false);
      setMessage(null);
      setStatus(null);
      setServerAwake(false);

      const res = await isServerAwake();

      const responseMessage = res.data?.message;
      const responseStatus = res.status;

      if (!res.ok) {
        setError(true);
        setMessage(responseMessage);
        setStatus(responseStatus);
        return {
          success: false,
          message: responseMessage,
          status: responseStatus,
        };
      }

      setMessage(responseMessage);
      setStatus(responseStatus);
      setServerAwake(true);

      return {
        success: true,
        message: responseMessage,
        status: responseStatus,
      };
    } catch (error) {
      console.error("Connection error:", error);
      setError(true);
      setMessage(
        error.message || "An error occurred while connecting to the server",
      );
      return {
        success: false,
        message:
          error.message || "An error occurred while connecting to the server",
      };
    } finally {
      setLoading(false);
    }
  };

  const getMyProfile = async () => {
    try {
      setLoading(true);
      setError(false);
      setMessage(null);
      setStatus(null);

      const res = await getMe();

      const responseMessage = res.data?.message;
      const responseStatus = res.status;

      if (!res.ok) {
        setError(true);
        setMessage(responseMessage);
        setStatus(responseStatus);
        return {
          success: false,
          message: responseMessage,
          status: responseStatus,
        };
      }

      const userData = res.data.data;

      setUser(userData);
      setMessage(responseMessage);
      setStatus(responseStatus);

      await storeUserData(userData, token);

      return {
        success: true,
        message: responseMessage,
        status: responseStatus,
      };
    } catch (error) {
      console.error("User fetch error:", error);
      setError(true);
      setMessage(error.message || "An error occurred while fetching");
      return {
        success: false,
        message: error.message || "An error occurred while fetching",
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    try {
      setLoading(true);
      setError(false);
      setMessage(null);
      setStatus(null);

      const res = await loginUser(data);

      const responseMessage = res.data?.message;
      const responseStatus = res.status;

      if (!res.ok) {
        setError(true);
        setMessage(responseMessage); // Don't clear user/token here
        setStatus(responseStatus);
        return {
          success: false,
          message: responseMessage,
          status: responseStatus,
        };
      }

      const userData = res.data.data;
      const tokenData = res.headers["x-auth-token"];

      setUser(userData);
      setToken(tokenData);
      setMessage(responseMessage);
      setStatus(responseStatus);
      setIsAuthenticated(true);

      await storeUserData(userData, tokenData);

      await loadCars();
      await loadServices();
      await loadAppointments();
      if (userData.role === "shopOwner") await loadShops();
      return {
        success: true,
        message: responseMessage,
        status: responseStatus,
      };
    } catch (error) {
      console.error("Login error:", error);
      setError(true);
      setMessage(error.message || "An error occurred during login");
      return {
        success: false,
        message: error.message || "An error occurred during login",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    try {
      setLoading(true);
      setError(false);
      setMessage(null);
      setStatus(null);

      const res = await registerUser(data);
      let responseMessage = res.data?.message;

      if (responseMessage === "Validation error") {
        let validationErr = res.data?.errors[0].message;
        responseMessage = validationErr;
        setMessage(validationErr);
      }
      const responseStatus = res.status;
      setMessage(responseMessage);
      setStatus(responseStatus);

      if (!res.ok) {
        setError(true);

        return {
          success: false,
          message: responseMessage,
          status: responseStatus,
        };
      }

      const userData = res.data.data;
      const tokenData = res.headers["x-auth-token"];

      setUser(userData);
      setToken(tokenData);
      setMessage(responseMessage);
      setStatus(responseStatus);
      setIsAuthenticated(true);

      await storeUserData(userData, tokenData);
      await loadCars();
      await loadServices();
      await loadAppointments();

      return {
        success: true,
        message: responseMessage,
        status: responseStatus,
      };
    } catch (error) {
      console.error("Registration error:", error);
      setError(true);
      setMessage(error.message || "An error occurred during registration");
      return {
        success: false,
        message: error.message || "An error occurred during registration",
      };
    } finally {
      setLoading(false);
    }
  };

  const editProfile = async (data) => {
    try {
      setLoading(true);
      setError(false);
      setMessage(null);
      setStatus(null);

      const res = await editUser(user._id, data);

      const responseMessage = res.data?.message;
      const responseStatus = res.status;

      if (!res.ok) {
        setError(true);
        return {
          success: false,
          message: responseMessage,
          setError: true,
          status: responseStatus,
        };
      }

      const userData = res.data.data;

      setUser(userData);
      setMessage(responseMessage);
      setStatus(responseStatus);

      await storeUserData(userData, token);
      return {
        success: true,
        message: responseMessage,
        status: responseStatus,
      };
    } catch (error) {
      console.error("Editing error:", error);
      setError(true);
      setMessage(error.message || "An error occurred during editing");
      return {
        success: false,
        message: error.message || "An error occurred during editing",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);

      await unregisterPushToken(); // remove push token
      await removeUserData();
    } catch (error) {
      console.error("Error logging out user", error);
    }
  };

  const role = user?.role;
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";
  const isShopOwner = user?.role === "shopOwner";
  const [firstName, lastName] = (user?.name ?? "").split(" ");

  const value = {
    user,
    firstName,
    lastName,
    token,
    isAuthenticated,
    authLoaded,
    loading,
    appStart,
    onBoardUser,
    onBoarded,
    error,
    message,
    status,
    getMyProfile,
    login,
    register,
    refreshUserToken,
    editProfile,
    logout,
    role,
    isAdmin,
    isUser,
    isShopOwner,
    loadUserData,
    serverAwake,
    checkServerConnection,
    userLocation,
    fetchUserLocation,
    showServiceNote,
    showPartNote,
    hideNote
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
