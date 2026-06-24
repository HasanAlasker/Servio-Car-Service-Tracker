import * as Notifications from "expo-notifications";
import { addPushToken, removePushToken } from "../api/user";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async () => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      // console.log("Permission not granted for push notifications");
      return;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: "bb9f9982-0bf3-4826-8057-d9217e2a2772",
    });

    if (token?.data) {
      await addPushToken(token.data, Platform.OS);
      // console.log("Push token registered:", token.data);
    }
  } catch (err) {
    console.log("Error getting notification token:", err);
  }
};

// When user logs out
export const unregisterPushToken = async () => {
  try {
    const token = await Notifications.getExpoPushTokenAsync();

    if (token?.data) {
      await removePushToken(token.data);
    }
  } catch (error) {
    console.error("Failed to remove push token:", error);
  }
};
