import { expect } from "@playwright/test";
import { checkEmailsForPINMed } from "../util/MedEmailUtil.js"; // Email OTP utility

export class Med_Subscription {
  constructor(page) {
    this.page = page;
    this.msisdnInput = page.locator("//input");
    this.getOtpButton = page.locator("//div/button[text()='SEND PIN']");
    this.otpBoxes = page.locator('[class="otp_input"] input');
    this.confirmOtpButton = page.locator("//button[text()='Subscribe']");
    this.dropdownMenu = page.locator(
      '//img[@src="/static/media/profile-icon.d3f88d1c33a29be43d87.webp"]'
    );
    this.unsubscribeLink = page.locator("//div/a[text()='Logout']");
  }

  async openPage(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.msisdnInput).toBeVisible();
    console.log("Navigated to MED page:", url);
    await this.page.waitForTimeout(2000);
  }

  async enterPhoneNumber(phone) {
    await this.msisdnInput.fill(phone);
    console.log("Entered phone number:", phone);
    await this.page.waitForTimeout(1500);
  }

  async clickGetOtp() {
    await this.getOtpButton.click();
    console.log("Clicked SEND PIN button");
    await this.page.waitForTimeout(1000);
  }
  async waitforOTP() {
    await this.page.waitForTimeout(21000);
  }

  async enterOtpFromEmail() {
    console.log("Waiting for OTP from email...");
    let otp = null;
    const start = Date.now();
    while (Date.now()) {
      otp = await checkEmailsForPINMed();
      if (otp) break;
      console.log("OTP not found yet, retrying...");
      await this.page.waitForTimeout(5000);
    }

    if (!otp) throw new Error("No OTP found in mailbox.");
    console.log("OTP found:", otp);

    for (let i = 0; i < otp.length; i++) {
      await this.otpBoxes.nth(i).fill(otp[i]);
      await this.page.waitForTimeout(300);
    }

    console.log("OTP entered successfully");
    await this.page.waitForTimeout(1000);
  }

  async confirmOtp() {
    await this.confirmOtpButton.click({ force: true });
    console.log("Clicked Subscribe button");
    await this.page.waitForTimeout(3000);
  }

  async logout() {
    console.log("Starting Logout flow...");
    await this.page.waitForTimeout(4000);
    await this.dropdownMenu.click();
    console.log("Clicked on dropdown");
    await this.unsubscribeLink.click({ force: true });
    console.log("Clicked Logout button successfully");
    await this.page.waitForTimeout(8000);
  }
}
