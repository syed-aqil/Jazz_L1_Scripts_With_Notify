import { test } from "@playwright/test";
import { Taqdeer_Subscription } from "../pages/Taqdeer_Subscription.js";
import dotenv from "dotenv";

dotenv.config();

test.describe("Taqdeer Landing Page Flow", () => {
  test("Full Subscription & Logout Flow", async ({ page }) => {
    const taqdeer = new Taqdeer_Subscription(page);
    const phone = process.env.PHONE_NUMBER;

    await taqdeer.openPage();
    await taqdeer.enterPhoneNumber(phone);
    await taqdeer.clickGetOtp();
    await taqdeer.handlePaymentStep();
    await taqdeer.enterOtpFromEmail();
    await taqdeer.clickSubscribe();
    await taqdeer.logout();
    console.log("Taqdeer subscription + payment + logout flow executed successfully");
  });
});
