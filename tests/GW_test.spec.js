import { test, expect } from "@playwright/test";
import { GW_Subscription } from "../pages/GW_Subscription.js";
import dotenv from "dotenv";

dotenv.config();

test.describe("GW Landing Page Flow", () => {
  test("Full Subscription & Logout Flow", async ({ page }) => {
    const gw = new GW_Subscription(page);
    const url = process.env.JAZZ_GW;
    const phone = process.env.PHONE_NUMBER;

    await gw.openPage(url);
    await gw.enterPhoneNumber(phone);
    await gw.clickGetOtp();
    await gw.enterOtpFromEmail();
    await gw.confirmOtp();
    await gw.logout();

    console.log("GW subscription flow executed successfully");
  });
});
