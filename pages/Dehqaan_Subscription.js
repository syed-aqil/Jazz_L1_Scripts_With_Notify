import { expect } from "@playwright/test";
import { fetchLatestOTP } from "../util/EmailUtils_Dehqaan.js";

export class Dehqaan_Subscription {
  constructor(page) {
    this.page = page;
    this.msisdnInput = page.locator('//input[@type="tel" and @placeholder="3xxxxxxxxx"]');
    this.getOtpButton = page.locator('//button[contains(normalize-space(.), "Get OTP")]');
    this.otpInputs = page.locator('.tutor-input input[type="tel"]');
    this.verifyButton = page.locator('//button[contains(normalize-space(.), "Verify")]');
    this.dropdownButton = page.locator('//img[contains(@src, "login-img") and @alt="Login"]');
    this.unsubscribeButton = page.locator('//a[contains(@class,"dropdown-item")]//*[contains(text(),"Unsubscribe")]'
    );
  }

  async openLandingPage(url) {
    await this.page.goto(url);
    await expect(this.msisdnInput).toBeVisible({ timeout: 15000 });
    console.log(`Navigated to Dehqaan Landing Page: ${url}`);
  }

  async enterMsisdn(phone) {
    await this.msisdnInput.fill(phone);
    console.log(`Entered phone number: ${phone}`);
  }

  async clickGetOtp() {
    await this.page.waitForTimeout(5000);
    await this.getOtpButton.click();
    console.log("Clicked 'Get OTP' button");
    await this.page.waitForTimeout(25000);
  }

  async enterOtpFromEmail() {
    console.log("Waiting for OTP from email...");
    let otp = null;
    const start = Date.now();

    while (Date.now()) {
      otp = await fetchLatestOTP();
      if (otp) break;
      console.log("OTP not found yet, retrying...");
      await this.page.waitForTimeout(5000);
    }

    if (!otp) throw new Error("❌ No OTP found in mailbox.");
    console.log(`OTP found: ${otp}`);

      await this.otpInputs.nth(0).fill(otp[0]);
      await this.otpInputs.nth(1).fill(otp[1]);
      await this.otpInputs.nth(2).fill(otp[2]);
      await this.otpInputs.nth(3).fill(otp[3]);
      await this.page.waitForTimeout(1000);
    console.log("OTP entered successfully");
  }

  async clickVerifyButton() {
    await this.verifyButton.click();
    await this.page.waitForTimeout(2000);
    await this.page.screenshot({ path: 'Dehqaan_Verified.png', fullPage: true });
    console.log("Clicked 'Verify' button");
  }

  async logout() {
    await this.dropdownButton.click();
    await this.page.waitForTimeout(1000);
    await this.unsubscribeButton.click();
    console.log("Clicked 'Unsubscribe' button");
    await this.page.waitForTimeout(5000);
  }
}
