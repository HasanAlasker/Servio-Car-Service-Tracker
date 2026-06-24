import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export const scheduleMonthlyNotification = async ({
  dayOfMonth = 1,
  hour = 9,
  minute = 0,
  title = "Monthly Reminder",
  body = "Don't forget to update your car's mileage!",
  data = { type: "update_mileage" },
}) => {
  try {
    if (Platform.OS === "android" && !Device.isDevice) {
      return null;
    }

    await cancelMonthlyNotifications();

    const trigger =
      Platform.OS === "ios"
        ? {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            repeats: true,
            day: dayOfMonth,
            hour,
            minute,
          }
        : {
            type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
            day: dayOfMonth,
            hour,
            minute,
          };

    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body, data, sound: true },
      trigger,
    });

    return id;
  } catch (error) {
    console.error("Failed to schedule monthly notification:", error);
  }
};

// Cancel all scheduled notifications tagged as monthly
export const cancelMonthlyNotifications = async () => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const monthly = scheduled.filter((n) => n.content.data?.isMonthly === true);
  await Promise.all(
    monthly.map((n) =>
      Notifications.cancelScheduledNotificationAsync(n.identifier),
    ),
  );
};
