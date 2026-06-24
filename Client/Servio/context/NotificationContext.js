// contexts/NotificationContext.js
import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { UseUser } from "./UserContext";
import { addPushToken } from "../api/user";
import { scheduleMonthlyNotification } from "../functions/ScheduleMonthly";

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { user, isAuthenticated } = UseUser();

  // Register for push notifications
  const registerForPushNotifications = async () => {
    try {
      // Check if we're on a physical device
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      // Request permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        // console.log("Failed to get push token for push notification!");
        return null;
      }

      // Get the token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: "bba45793-f511-4f58-be49-7e5320905842",
      });

      // console.log("Push notification token:", token.data);
      return token.data;
    } catch (error) {
      console.error("Error getting push token:", error);
      return null;
    }
  };

  // Save token to backend
  const saveTokenToBackend = async (token) => {
    if (!user || !token) return;

    try {
      const platform = Platform.OS; // 'ios' or 'android'
      await addPushToken(token, platform);
      // console.log("Token saved to backend");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  // Initialize notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && Platform.OS !== "web") {
      registerForPushNotifications().then((token) => {
        if (token) {
          setExpoPushToken(token);
          saveTokenToBackend(token);
        }

        scheduleMonthlyNotification({
          dayOfMonth: 1,
          hour: 9,
          minute: 0,
          title: "Update Your Mileage",
          body: "Don't forget to update your cars mileage!",
          data: { type: "update_mileage", isMonthly: true },
        });
      });

      // Listen for notifications received while app is in foreground
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          // console.log("Notification received:", notification);
          setNotification(notification);
        });

      // Listen for user interactions with notifications
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          // console.log("Notification tapped:", response);
          handleNotificationTap(response);
        });

      return () => {
        notificationListener.current?.remove();
        responseListener.current?.remove();
      };
    }
  }, [isAuthenticated, user?.id]);

  // Handle notification tap (navigate to relevant screen)
  const handleNotificationTap = (response) => {
    const data = response.notification.request.content.data;

    // Navigate based on notification type
    if (data.type === "request_accepted") {
      // navigation.navigate("Requests");
    } else if (data.type === "item_returned") {
      // navigation.navigate("Book");
    } else if (data.type === "new_message") {
      // navigation.navigate("Chat", { chatId: data.chatId });
    }

    // You'll need to pass navigation ref here
  };

  const value = {
    expoPushToken,
    notification,
    registerForPushNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
