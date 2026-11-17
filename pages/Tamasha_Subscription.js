import { expect } from "@playwright/test";
import { fetchLatestOTP } from "../util/EmailUtils_Tamasha.js";

export class Tamasha_Subscription {
  constructor(page) {
    this.page = page;

    this.msisdnInput = page.locator('input[placeholder="3XX - XXXXXXX"]');
    this.otpInputs = page.locator('.otpinputWraper input');
    this.subscribeButton = page.locator("//div/div/button[text()='Subscribe Now']");
  }

  async openLandingPage(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.msisdnInput).toBeVisible({ timeout: 25000 });
    console.log(`Navigated to Tamasha Landing Page: ${url}`);
  }

  async enterMsisdn(phone) {
    await this.msisdnInput.fill(phone);
    console.log(`Entered MSISDN: ${phone}`);
    await this.page.waitForTimeout(2000);
    await this.page.locator("//div/button[text()='Send Otp']").click()
  }

  async enterOtpFromEmail() {
    console.log("Waiting for OTP from email...");
    await this.page.waitForTimeout(25000);
    let otp = null;
    const start = Date.now();

    while (Date.now()) {
      otp = await fetchLatestOTP();
      if (otp) break;
      console.log("OTP not found yet, retrying...");
      await this.page.waitForTimeout(5000);
    }

    if (!otp) throw new Error("No OTP found in mailbox.");
    console.log(`OTP found: ${otp}`);

    for (let i = 0; i < otp.length; i++) {
      await this.otpInputs.nth(i).fill(otp[i]);
      await this.page.waitForTimeout(300);
    }

    console.log("OTP entered successfully");
  }

  async clickSubscribe() {
    await this.subscribeButton.click({ force: true });
    console.log("Clicked 'Subscribe' button successfully");
  }

  async subscriptionFlow(url, phone) {
    await this.openLandingPage(url);
    await this.enterMsisdn(phone);
    await this.enterOtpFromEmail();
    await this.clickSubscribe();
    console.log("Tamasha Subscription Flow completed successfully!");
    await this.page.waitForTimeout(8000);
  }
}
