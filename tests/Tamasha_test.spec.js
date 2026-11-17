import { test } from "@playwright/test";
import { Tamasha_Subscription } from "../pages/Tamasha_Subscription.js";

test.describe("Tamasha Landing Page Flow", () => {
  test("Subscription Flow - OTP Login & Subscribe", async ({ page }) => {
    const tamashaPage = new Tamasha_Subscription(page);

    const url = process.env.JAZZ_TAMASHA;
    const phoneNumber = process.env.PHONE_NUMBER;

    await tamashaPage.subscriptionFlow(url, phoneNumber);

    console.log("Tamasha Landing Page Subscription test executed successfully");
  });
});
