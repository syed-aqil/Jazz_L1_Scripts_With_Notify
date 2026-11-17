import { expect } from "@playwright/test";
import { fetchLatestOTP } from "../util/EmailUtil_Prime.js";

export class TamsahaPrime_Subscription {
  constructor(page) {
    this.page = page;
    this.PhoneNumber = page.locator('//input[@placeholder="3xx xxxx xxx"]');
    this.sendOTPbtn = page.getByRole("button", { name: "Send OTP" });
    this.loginbtn = page.getByRole("button", { name: "Log In" });
    this.SideMenu = page.locator("div.new__menubar");
    this.profileLogout = page.locator("//a[text()='Logout']");
    this.otpSingle = page.locator(
      'input[autocomplete="one-time-code"], input[name*="otp" i], input[placeholder*="OTP" i]'
    );
    this.otpDigits = page.locator(
      'input[maxlength="1"][type="tel"], input[maxlength="1"][inputmode="numeric"]'
    );
  }

  async openLandingPage(url) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    console.log(`Navigated to ${url}`)
    await expect(this.PhoneNumber).toBeVisible();
  }

  async enterPhoneNumber(msisdn) {
    await this.PhoneNumber.fill(msisdn);
    await expect(this.sendOTPbtn).toBeEnabled();
  }

  async sendOTP() {
    await this.sendOTPbtn.click();
    await this.page.waitForTimeout(25000);
  }

  async enterOtpFromEmail({ timeoutMs = 60000, pollMs = 3000 } = {}) {
    const start = Date.now();
    let pin = null;
    while (Date.now() - start < timeoutMs) {
      pin = await fetchLatestOTP();
      if (pin) break;
      await this.page.waitForTimeout(pollMs);
    }
    if (!pin) throw new Error("No OTP found in mailbox within timeout.");
    if (
      await this.otpDigits
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      const count = await this.otpDigits.count();
      for (let i = 0; i < Math.min(pin.length, count); i++) {
        await this.otpDigits.nth(i).fill(pin[i]);
      }
    } else {
      await expect(this.otpSingle).toBeVisible();
      await this.otpSingle.fill(pin);
    }
  }

  async login() {
    await expect(this.loginbtn).toBeEnabled();
    await this.loginbtn.click();
  }

  async openMenu() {
    await expect(this.SideMenu).toBeVisible();
    await this.SideMenu.click();
    await this.page.waitForTimeout(3000)
  }

  async logout() {
    await this.profileLogout.click();
    await this.page.waitForTimeout(5000);
  }
}
