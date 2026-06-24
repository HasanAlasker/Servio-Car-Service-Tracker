// services/notificationService.js
import UpcomingServiceModel from "../models/upcomingService.js";
import UserModel from "../models/user.js";
import { sendPushNotification } from "../utils/notifications.js";

export const sendDueServiceNotifications = async () => {
  const services = await UpcomingServiceModel.find({
    status: { $in: ["soon", "due", "overdue"] },
    reminder: true,
    // notificationSent: false, // skip already-notified services
  })
    .populate("car")
    .populate("customer")
    .populate("parts");

  for (const service of services) {
    try {
      const owner = await UserModel.findById(service.customer);

      if (owner?.pushNotificationTokens?.length > 0) {
        const tokens = owner.pushNotificationTokens.map((t) => t.token);

        const carName = service.car?.name ?? "your car";
        const partNames = service.parts.map((p) => p.name).join(", ");
        const urgency =
          service.status === "overdue" || service.status === "due"
            ? "requires immediate attention"
            : "is coming up soon";

        const body = `Service for ${carName} ${urgency}: ${partNames}`;

        await sendPushNotification(tokens, "Service Reminder", body);
        console.log(`📤 Notification sent to ${owner._id} for car ${carName}`);
      }

      // Mark as notified so it doesn't fire again tomorrow.
      service.notificationSent = true;
      await service.save();
    } catch (error) {
      console.error(
        `Error sending notification for service ${service._id}:`,
        error,
      );
    }
  }
};
