import { test } from "@playwright/test";
import { Dehqaan_Subscription } from "../pages/Dehqaan_Subscription.js";
import dotenv from "dotenv";
dotenv.config();

test.use({
  httpCredentials: {
    username: process.env.DEHQAN_USER,
    password: process.env.DEHQAN_PASS,
  },
});

test.describe("Dehqaan Landing Page Flow", () => {
    
  test("Full Subscription & Unsubscribe Flow", async ({ page }) => {

    
    const dehqaan = new Dehqaan_Subscription(page);
    await page.goto("http://dehqan.com.pk/landing");
    await dehqaan.enterMsisdn(process.env.PHONE_NUMBER);
    await dehqaan.clickGetOtp();
    await dehqaan.enterOtpFromEmail();
    await dehqaan.clickVerifyButton();
    await dehqaan.logout();
  });
});
