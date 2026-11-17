import { test } from "@playwright/test";
import dotenv from "dotenv";
import { TamsahaPrime_Subscription } from "../pages/TamashaPrime_Subscription.js";

dotenv.config();

test.describe("Tamasha Prime Subscription", () => {
  test("OTP login and logout", async ({ page }) => {
    const url = process.env.JAZZ_TAMSHAPRIME;
    const msisdn = process.env.PHONE_NUMBER;
    const app = new TamsahaPrime_Subscription(page);
    await app.openLandingPage(url);
    await app.enterPhoneNumber(msisdn);
    await app.sendOTP();
    await app.enterOtpFromEmail({ timeoutMs: 60000, pollMs: 3000 });
    await app.login();
    await app.openMenu();
    await app.logout();
  });
});
