import { test } from "@playwright/test";
import { Fusion_Landing } from "../pages/Fusion_Landing.js";

test.describe("Fusion Landing Page Flow", () => {
  test("Full Subscription & Unsubscribe Flow", async ({ page }) => {
    const fusionPage = new Fusion_Landing(page);

    const url = process.env.JAZZ_FUSIONWEB;
    const phoneNumber = process.env.PHONE_NUMBER;

    await fusionPage.openLandingPage(url);
    await fusionPage.enterPhoneNumber(phoneNumber);
    await fusionPage.clickSendOtp();
    await fusionPage.enterOtpFromEmail();
    await fusionPage.clickSubmit();
    await fusionPage.unsubscribe();

    console.log("Fusion Landing Page Flow Completed Successfully!");
  });
});
