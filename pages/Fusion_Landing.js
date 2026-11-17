import { expect } from "@playwright/test";
import { fetchLatestOTP } from "../util/EmailUtils_Fusion.js";

export class Fusion_Landing {
  constructor(page) {
    this.page = page;

    this.phoneInput = page.locator('input[type="tel"][placeholder*="300"]');
    this.sendOtpButton = page.locator('//button[normalize-space()="Send OTP"]');

    this.otpInputs = page.locator(
      '.fusion-input input[type="tel"][maxlength="1"]'
    );
    this.submitButton = page.locator('//button[normalize-space()="Submit"]');

    this.dropdownMenu = page.locator(
      'img.arrow-image[alt="down-arrow-header-img"]'
    );
    this.unsubscribeButton = page.getByText(/^UnSubscribe$/).first();
  }

  async openLandingPage(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.phoneInput).toBeVisible();
    console.log(`Navigated to Fusion Landing Page: ${url}`);
  }

  async enterPhoneNumber(phone) {
    await this.phoneInput.fill(phone);
    console.log(`Entered phone number: ${phone}`);
  }

  async clickSendOtp() {
    await this.sendOtpButton.click();
    console.log("Clicked 'Send OTP' button");
    await this.page.waitForTimeout(2000);
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

    if (!otp) throw new Error("❌ No OTP found in mailbox.");

    console.log(`OTP found: ${otp}`);

    for (let i = 0; i < otp.length; i++) {
      await this.otpInputs.nth(i).fill(otp[i]);
      await this.page.waitForTimeout(300);
    }

    console.log("OTP entered successfully");
  }

  async clickSubmit() {
    await this.submitButton.waitFor({ state: "visible", timeout: 10000 });
    await this.submitButton.click({ force: true });
    console.log("Clicked Submit button");
  }

  async unsubscribe() {
    await this.page.waitForTimeout(2000);
    await this.dropdownMenu.click();
    console.log("Drop DOwn clicked");
    await expect(this.unsubscribeButton).toBeVisible();
    console.log("Unsubscribed Successfully");
    await this.unsubscribeButton.click();
    await this.page.waitForTimeout(8000);
  }
}
