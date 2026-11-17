import { expect } from "@playwright/test";
import { checkEmailsForPINGW } from "../util/GWEmailUtil.js";

export class GW_Subscription {
  constructor(page) {
    this.page = page;
    this.msisdnInput = page.locator('[class="cform-control rounded tel-field"]');
    this.getOtpButton = page.locator('[class="otpBtn"]');
    this.otpBoxes = page.locator('[class="otpInput"] input');
    this.confirmOtpButton = page.locator('//button[@id="button-addon2"]');
    this.dropdownMenu = page.locator('[class="userProfile"]');
    this.unsubscribeLink = page.locator("//a[text()='Unsubscribe']");
  }

  async openPage(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.msisdnInput).toBeVisible();
    console.log("Navigated to GW page:", url);
    await this.page.waitForTimeout(2000);
  }

  async enterPhoneNumber(phone) {
    await this.page.waitForLoadState("domcontentloaded");
    await this.msisdnInput.fill(phone);
    console.log("Entered phone number:", phone);
    await this.page.waitForTimeout(1500);
  }

  async clickGetOtp() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.getOtpButton.click();
    console.log("Clicked Get OTP button");
    await this.page.waitForTimeout(2000);
  }

  async enterOtpFromEmail() {
    await this.page.waitForLoadState("domcontentloaded");
    console.log("Waiting for OTP from email...");
    await this.page.waitForTimeout(25000);
    let otp = null;
    const start = Date.now();
    while (Date.now()) {
      otp = await checkEmailsForPINGW();
      if (otp) break;
      console.log("OTP not found yet, retrying...");
      await this.page.waitForTimeout(5000);
    }

    if (!otp) throw new Error("❌ No OTP found in mailbox.");
    console.log("OTP found:", otp);

    for (let i = 0; i < otp.length; i++) {
      await this.otpBoxes.nth(i).fill(otp[i]);
      await this.page.waitForTimeout(400);
    }

    console.log("OTP entered successfully");
    await this.page.waitForTimeout(2000);
  }

  async confirmOtp() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.confirmOtpButton.click({ force: true });
    console.log("Clicked Confirm OTP button");
    await this.page.waitForTimeout(3000);
  }

  async logout() {
    await this.page.waitForLoadState("domcontentloaded");
    console.log("Starting Unsubscribe flow...");
    await this.dropdownMenu.click();
    console.log("Opened dropdown menu");
    await this.unsubscribeLink.click();
    console.log("Clicked Unsubscribe button");
    await this.page.waitForTimeout(8000);
  }
}
