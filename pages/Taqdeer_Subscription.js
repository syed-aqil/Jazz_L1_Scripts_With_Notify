import { expect } from "@playwright/test";
import { checkEmailsForPINTaqdeer } from "../util/TaqdeerEmailUtil.js";

export class Taqdeer_Subscription {
  constructor(page) {
    this.page = page;
    this.msisdnInput = page.locator('[class="landig-input"]');
    this.getOtpButton = page.locator('[class="button"]');
    this.paymentMethodMobile = page.locator('[value="mobile"]');
    this.proceedPaymentButton = page.locator('[class="default-btn"]');
    this.otpBoxes = page.locator('[class="number otp"] input');
    this.subscribeButton = page.locator(
      '[class="NewlandingSubscribeButtonDisable"]'
    );
    this.logoutButton = page.locator(
      '[class="subscribe__btn btn btn-primary"]'
    );
  }

  async openPage() {
    await this.page.goto("https://taqdeerdigital.com/landing" );
    await this.page.waitForTimeout(5000)
    console.log("Navigated to Taqdeer")
  }

  async enterPhoneNumber(phone) {
    await this.msisdnInput.fill(phone);
    console.log("Entered phone number:", phone);
    await this.page.waitForTimeout(2000);
  }

  async clickGetOtp() {
    await this.getOtpButton.click();
    console.log("Clicked Get OTP button");
    await this.page.waitForTimeout(2000);
  }

  async handlePaymentStep() {
    console.log("Handling payment method selection...");
    await this.page.waitForTimeout(3000);
    if (await this.paymentMethodMobile.isVisible()) {
      await this.paymentMethodMobile.click();
      console.log("Selected Mobile payment option");
      await this.page.waitForTimeout(1500);
      await this.proceedPaymentButton.click();
      console.log("Clicked Proceed Payment button");
      await this.page.waitForTimeout(2000);
    } else {
      console.log("already subscribed user");
    }
  }

  async enterOtpFromEmail() {
    await this.page.waitForTimeout(25000);
    console.log("Waiting for OTP from email...");
    let otp = null;
    const start = Date.now();
    while (Date.now()) {
      otp = await checkEmailsForPINTaqdeer();
      if (otp) break;
      console.log("OTP not found yet, retrying...");
      await this.page.waitForTimeout(5000);
    }
    if (!otp) throw new Error("No OTP found in mailbox.");
    console.log("OTP found:", otp);
    for (let i = 0; i < otp.length; i++) {
      await this.otpBoxes.nth(i).fill(otp[i]);
      await this.page.waitForTimeout(400);
    }
    console.log("OTP entered successfully");
  }

  async clickSubscribe() {
    const subscribeBtn = this.page.locator('[class="button otp"]');
    await subscribeBtn.click({ force: true });
    console.log("Clicked Subscribe button successfully");
    await this.page.waitForTimeout(3000);
  }
  
  async logout() {
    await this.page.waitForTimeout(4000);
    await this.logoutButton.waitFor({ state: "visible", timeout: 10000 });
    await this.logoutButton.click({ force: true });
    console.log("Logged out successfully");
    await this.page.waitForTimeout(8000);
  }
}
