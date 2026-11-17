import { test } from "@playwright/test";
import { FikrFree_Subscription } from "../pages/FikrFree_Subscription.js";

test.describe("FikrFree Landing Page Flow", () => {
  test("Full Subscription & Logout Flow", async ({ page }) => {
    const fikrFree = new FikrFree_Subscription(page);

    const url = process.env.JAZZ_FIKRFREE;
    const phoneNumber = process.env.PHONE_NUMBER;

    await fikrFree.subscriptionFlow(url, phoneNumber);
    await fikrFree.logout();

    console.log("FikrFree Subscription and Logout flow executed successfully");
  });
});
