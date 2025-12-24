import { CronJob } from "cron";
import { autoReturnBookings } from "../services/autoReturn.service";


// Runs every day at 12:00 AM (server local time)
export const autoReturnJob = new CronJob(
    "0 0 * * *",
    async () => {
        console.log("Running auto-return cron job...");
        await autoReturnBookings();
    },
    null,
    false,
    "Asia/Dhaka"
);
