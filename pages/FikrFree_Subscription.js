import { expect } from "@playwright/test";
import { fetchLatestOTP } from "../util/EmailUtils_FikrFree.js";

export class FikrFree_Subscription {
  constructor(page) {
    this.page = page;

    this.msisdnInput = page.locator('input[placeholder="Enter your Phone Number"]');
    this.loginButton = page.locator('//button[contains(normalize-space(.), "LOGIN")]');
    this.otpInputs = page.locator('.fusion-input input[type="tel"]');
    this.dropdownMenu = page.locator('//button[@id="dropdown-basic" or .//img[@alt="user"]]');
    this.logoutButton = page.locator('//a[contains(normalize-space(.), "Logout")]');
  }

  async openLandingPage(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState("domcontentloaded");
    console.log(`Navigated to FikrFree Landing Page: ${url}`);
  }

  async enterMsisdn(phone) {
    await this.msisdnInput.fill(phone);
    console.log(`Entered MSISDN: ${phone}`);
    await this.page.waitForTimeout(2000);
  }

  async clickLoginBeforeOTP() {
    await this.loginButton.click({ force: true });
    console.log("Clicked 'LOGIN' button to request OTP");
  }

async waitforOTP() {
      await this.page.waitForTimeout(25000);
  }
  
  async enterOtpFromEmail() {
    console.log("Waiting for OTP from email...");
    let otp = null;
    const start = Date.now();
    while (Date.now() ) {
      otp = await fetchLatestOTP();
      if (otp) break;
      console.log("OTP not found yet, retrying...");
      await this.page.waitForTimeout(5000);
    }
    if (!otp) throw new Error("❌ No OTP found in mailbox.");
    console.log(`OTP found: ${otp}`);
    for (let i = 0; i < otp.length; i++) {
      await this.otpInputs.nth(i).fill(otp[i]);
      await this.page.waitForTimeout(200);
    }
    console.log("OTP entered successfully");
  }

  async clickLoginAfterOTP() {
    await this.loginButton.click();
    console.log("Clicked 'LOGIN' button after entering OTP");
  }

  async logout() {
    console.log("Starting Logout flow...");
    await this.page.waitForTimeout(2000);
    await this.dropdownMenu.click({ force: true });
    await this.page.waitForTimeout(1000);
    await this.logoutButton.click({ force: true });
    console.log("Logged out successfully");
    await this.page.waitForTimeout(5000);
  }

  async subscriptionFlow(url, phone) {
    await this.openLandingPage(url);
    await this.enterMsisdn(phone);
    await this.clickLoginBeforeOTP();
    await this.waitforOTP()
    await this.enterOtpFromEmail();
    await this.clickLoginAfterOTP();
    console.log("FikrFree Subscription completed successfully!");
    await this.page.waitForTimeout(5000);
  }
}
