import cron from "node-cron";
import { updateServicesForAllCars } from "../services/upcomingServiceManager.js";
import { sendDueServiceNotifications } from "../services/notificationService.js";

export function startServiceScheduler() {
  // 2 AM -> recalculate all services
  cron.schedule("0 2 * * *", async () => {
    console.log("Running daily service calculation...");
    try {
      await updateServicesForAllCars();
      console.log("Service calculation completed");
    } catch (error) {
      console.error("Error in service calculation:", error);
    }
  });

  // 6 AM -> send notifications
  cron.schedule("0 6 * * *", async () => {
    console.log("Checking for services needing notifications...");
    try {
      await sendDueServiceNotifications();
      console.log("Notification check completed");
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  });
}
