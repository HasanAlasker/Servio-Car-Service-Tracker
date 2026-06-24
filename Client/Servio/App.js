import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Platform, StyleSheet, Text } from "react-native";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProvider, UseUser } from "./context/UserContext";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import Home from "./screens/carOwner/Home";
import Shops from "./screens/carOwner/Shops";
import AddCar from "./screens/carOwner/AddCar";
import Bookings from "./screens/carOwner/Bookings";
import Service from "./screens/carOwner/Service";
import Parts from "./screens/carOwner/Parts";
import MyCars from "./screens/carOwner/MyCars";
import Welcome from "./screens/login/Welcome";
import Login from "./screens/login/Login";
import Register from "./screens/login/Register";
import Dash from "./screens/admin/Dash";
import AdminShops from "./screens/admin/Shops";
import MyShop from "./screens/shopOwner/MyShop";
import Profile from "./screens/shared/Profile";
import Suggestions from "./screens/shared/Suggestions";
import CarParts from "./screens/carOwner/CarParts";
import AddPart from "./screens/carOwner/AddPart";
import AddShop from "./screens/shopOwner/AddShop";
import ShopDash from "./screens/shopOwner/ShopDash";
import Users from "./screens/admin/Users";
import Reports from "./screens/admin/Reports";
import ShopBook from "./screens/shopOwner/ShopBook";
import DeletedShops from "./screens/admin/DeletedShops";
import SeeSuggestions from "./screens/admin/SeeSuggestions";
import ShopAppointments from "./screens/shopOwner/ShopAppointments";
import MakeAppointment from "./screens/carOwner/MakeAppointment";
import { NotificationProvider } from "./context/NotificationContext";
import { SystemBars } from "react-native-edge-to-edge";
import * as NavigationBar from "expo-navigation-bar";
import { CarProvider, UseCar } from "./context/CarContext";
import { ServiceProvider, UseService } from "./context/ServiceContext";
import {
  AppointmentProvider,
  UseAppointment,
} from "./context/AppointmentContext";
import { ShopProvider, UseShop } from "./context/ShopContext";
import { ToastProvider } from "react-native-toast-notifications";
import Settings from "./screens/shared/Settings";
import History from "./screens/carOwner/History";
import CompletedAppointments from "./screens/carOwner/CompletedAppointments";
import Schedule from "./screens/shopOwner/Schedule";
import { AlertContainer } from "react-native-alert-queue";
import AppText from "./config/AppText";
import { useAdminStore } from "./store/admin/useAdminStore";
import { useShopStore } from "./store/admin/useShopStore";
import { useReportStore } from "./store/admin/useReportStore";
import { useBookingStore } from "./store/shopOwner/useBookingsStore";
import Onboard from "./screens/login/Onboard";
import UsersProfiles from "./screens/admin/UsersProfiles";

export const navigationRef = createNavigationContainerRef();
SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dash"
      screenOptions={{ headerShown: false, animation: "none" }}
    >
      <Stack.Screen name="Dash" component={Dash} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="AdminShops" component={AdminShops} />
      <Stack.Screen name="Users" component={Users} />
      <Stack.Screen name="Reports" component={Reports} />
      <Stack.Screen name="DeletedShops" component={DeletedShops} />
      <Stack.Screen name="SeeSuggestions" component={SeeSuggestions} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="UsersProfiles" component={UsersProfiles} />
    </Stack.Navigator>
  );
};

const CarOwnerStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, animation: "none" }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Shops" component={Shops} />
      <Stack.Screen name="AddCar" component={AddCar} />
      <Stack.Screen name="Bookings" component={Bookings} />
      <Stack.Screen name="Service" component={Service} />
      <Stack.Screen name="Parts" component={Parts} />
      <Stack.Screen name="MyCars" component={MyCars} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Suggestions" component={Suggestions} />
      <Stack.Screen name="CarParts" component={CarParts} />
      <Stack.Screen name="AddPart" component={AddPart} />
      <Stack.Screen name="AddShop" component={AddShop} />
      <Stack.Screen name="MakeAppointment" component={MakeAppointment} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="History" component={History} />
      <Stack.Screen
        name="CompletedAppointments"
        component={CompletedAppointments}
      />
    </Stack.Navigator>
  );
};

const ShopOwnerStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ShopDash"
      screenOptions={{ headerShown: false, animation: "none" }}
    >
      <Stack.Screen name="ShopDash" component={ShopDash} />
      <Stack.Screen name="MyShop" component={MyShop} />
      <Stack.Screen name="ShopBook" component={ShopBook} />
      <Stack.Screen name="Suggestions" component={Suggestions} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="AddShop" component={AddShop} />
      <Stack.Screen name="MyCars" component={MyCars} />
      <Stack.Screen name="CarParts" component={CarParts} />
      <Stack.Screen name="AddCar" component={AddCar} />
      <Stack.Screen name="Parts" component={Parts} />
      <Stack.Screen name="AddPart" component={AddPart} />
      <Stack.Screen name="Service" component={Service} />
      <Stack.Screen name="ShopAppointments" component={ShopAppointments} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Schedule" component={Schedule} />
      <Stack.Screen
        name="CompletedAppointments"
        component={CompletedAppointments}
      />
    </Stack.Navigator>
  );
};

const OnBoardingStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboard"
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="Onboard" component={Onboard} />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const {
    authLoaded,
    isUser,
    isShopOwner,
    isAdmin,
    isAuthenticated,
    loadUserData,
    fetchUserLocation,
    user,
    onBoarded,
  } = UseUser();
  const { loadCars } = UseCar();
  const { isDarkMode, theme } = useTheme();
  const { loadServices, loading } = UseService();
  const { loadAppointments } = UseAppointment();
  const { loadShops } = UseShop();
  const loadBook = useBookingStore((state) => state.loadBook);
  const loadReports = useReportStore((state) => state.loadReports);
  const loadDashboard = useAdminStore((state) => state.loadDashboard);
  const loadAdminShops = useShopStore((state) => state.loadShops);

  useEffect(() => {
    loadUserData();
    loadCars();
    loadServices();
    loadAppointments();
    fetchUserLocation();
  }, []);

  useEffect(() => {
    if (authLoaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [authLoaded, loading]);

  useEffect(() => {
    if (!isShopOwner) return;
    loadShops();
    loadBook();
  }, [isShopOwner]);

  useEffect(() => {
    if (!isAdmin) return;
    loadDashboard();
    loadAdminShops();
    loadReports();
  }, [isAdmin]);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setStyle(isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode]);

  return (
    <>
      <SystemBars style={isDarkMode ? "light" : "dark"} />
      <NavigationContainer ref={navigationRef}>
        {!onBoarded && !isAuthenticated ? (
          <OnBoardingStack />
        ) : !isAuthenticated ? (
          <AuthStack />
        ) : isUser ? (
          <CarOwnerStack />
        ) : isShopOwner ? (
          <ShopOwnerStack />
        ) : isAdmin ? (
          <AdminStack />
        ) : (
          <CarOwnerStack />
        )}
      </NavigationContainer>
      <AlertContainer
      // config={{ alertStyle: { backgroundColor: theme.post },  }}
      />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <ThemeProvider>
          <ServiceProvider>
            <CarProvider>
              <AppointmentProvider>
                <ShopProvider>
                  <UserProvider>
                    <NotificationProvider>
                      <AppNavigator />
                    </NotificationProvider>
                  </UserProvider>
                </ShopProvider>
              </AppointmentProvider>
            </CarProvider>
          </ServiceProvider>
        </ThemeProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});
