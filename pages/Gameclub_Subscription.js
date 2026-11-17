import { expect } from "@playwright/test";
import { fetchLatestOTP } from "../util/EmailUtils_GameClub.js";

export class GameClub_Subscription {
  constructor(page) {
    this.page = page;
    this.msisdnInput = page.locator('input[placeholder="XXX - XXX - XXXX"]');
    this.getOtpButton = page.locator('span.otpdisabled');
    this.otpInputs = page.locator('[data-testid="otp-input-root"] input[data-testid="input"]');
  }

  async openLandingPage(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.msisdnInput).toBeVisible();
    console.log(`Navigated to GameClub Landing Page: ${url}`);
  }

  async enterMsisdn(phone) {
    await this.msisdnInput.fill(phone);
    console.log(`Entered MSISDN: ${phone}`);
  }

  async clickGetOtp() {
    await this.getOtpButton.waitFor({ state: "visible", timeout: 10000 });
    await this.getOtpButton.click({ force: true });
    console.log("Clicked 'Get OTP' button");
  }

  async enterOtpFromEmail() {
    console.log("Waiting for OTP from email...");
    await this.page.waitForTimeout(25000);
    let otp = null;
    const start = Date.now();
    while (Date.now() - start) {
      otp = await fetchLatestOTP();
      if (otp) break;
      console.log("OTP not found yet, retrying...");
      await this.page.waitForTimeout(5000); }
    if (!otp) throw new Error("❌ No OTP found in mailbox.");
    console.log(`OTP found: ${otp}`);
    for (let i = 0; i < otp.length; i++) {
      await this.otpInputs.nth(i).fill(otp[i]);
      await this.page.waitForTimeout(300);
    }
    console.log("OTP entered successfully");
    await this.getOtpButton.click({ force: true });
    console.log("Clicked Submit button after entering OTP");
  }

  async subscriptionFlow(url, phone) {
    await this.openLandingPage(url);
    await this.enterMsisdn(phone);
    await this.clickGetOtp();
    await this.enterOtpFromEmail();
    console.log("GameClub subscription completed successfully!");
    await this.page.waitForTimeout(8000);
  }
}
