import cron from "node-cron";
import { sendExpiringNotifications } from "./services/notificationService.js";
import "./app/notificationScheduler.js";

// Run every day at 9 AM
cron.schedule("0 9 * * *", () => {
  console.log("Checking for expiring warranties...");
  sendExpiringNotifications();
});
