import { test, expect } from "@playwright/test";
import { Parho_SubscriptionFlow } from "../pages/Parho_SubsciptionFlow.js";
import dotenv from "dotenv";

dotenv.config();

test.describe("Parho Landing Page Subscription", () => {
  test("Subscription Flow - OTP Login", async ({ page }) => {
    const parho = new Parho_SubscriptionFlow(page);
    const url = process.env.JAZZ_Parho;
    const phone = process.env.PHONE_NUMBER;

    await parho.openPage(url);
    await parho.enterPhoneNumber(phone);
    await parho.clickGetOtp();
    await parho.enterOtpFromEmail();
    
    console.log("OTP flow completed, moving to submitLogin()");
    await parho.submitLogin();

await parho.logout();
    await page.waitForTimeout(5000);
    console.log("Parho subscription flow executed successfully");
  });
});
