import { expect } from "@playwright/test";
import { fetchLatestOTP } from "../util/EmailUtils_Quest.js";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class Quest_Subscription {
  constructor(page) {
    this.page = page;
    this.msisdnInput = page.locator('//input[@type="tel" and @placeholder="3xxxxxxxxx"]');
    this.otpInputs = page.locator('[data-testid="otp-input-root"] [data-testid="input"]');
    this.buyNowButton = page.locator('//button[contains(normalize-space(.), "Buy Now")]');
  }

  async navigateToLanding(url) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    await expect(this.msisdnInput).toBeVisible();
    console.log(`Navigated to Quest Landing Page: ${url}`);
  }

  async enterPhoneNumber(phoneNumber) {
  console.log(`Typing phone number one by one: ${phoneNumber}`);  
  await this.msisdnInput.fill('');
    for (const digit of phoneNumber) {
    await this.msisdnInput.type(digit, { delay: 200 }); 
  }
  console.log("Phone number entered successfully (typed one by one)");
}

  async waitForOtpField() {
    console.log("Waiting for OTP input fields to appear...");
    console.log("OTP fields are now visible");
  }

  async enterOtpFromEmail() {
    await this.page.waitForTimeout(25000);
    console.log("Waiting for OTP email...");
    let otp = null;
    for (let attempt = 1; attempt <= 4; attempt++) {
      otp = await fetchLatestOTP();
      if (otp) break;
      console.log("OTP not found yet, retrying...");
    }

    if (!otp) throw new Error("No OTP found in mailbox.");
    console.log(`OTP found: ${otp}`);
    for (let i = 0; i < otp.length; i++) {
      await this.otpInputs.nth(i).fill(otp[i]);
    }
    console.log("OTP entered successfully");
  }

  async clickBuyNow() {
    await this.buyNowButton.waitFor({ state: "visible", timeout: 10000 });
    await this.buyNowButton.click();
    console.log("Clicked 'Buy Now' button successfully");
  }

  async fullSubscriptionFlow(url, phoneNumber) {
    await this.navigateToLanding(url);
    await this.enterPhoneNumber(phoneNumber);
    await this.waitForOtpField();
    await this.enterOtpFromEmail();
    await this.clickBuyNow();
    await this.page.waitForTimeout(8000);
  }
}
