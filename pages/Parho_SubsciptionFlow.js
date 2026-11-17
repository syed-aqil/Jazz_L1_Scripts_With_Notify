import { expect } from "@playwright/test";
import { checkEmailsForPINPParho } from "../util/parhoEmailUtil.js";

export class Parho_SubscriptionFlow {
  constructor(page) {
    this.page = page;

    this.phoneInput = page.locator('[class="form-control b-shadow"]');
    this.getOtpButton = page.locator("[class='get-otp mb-block']");
    this.otpInputs = page.locator("[class='number_taken_inputcol otp_input'] input");
    this.submitButton = page.locator('[class="submit-ot "]');
  }

  async openPage(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.phoneInput).toBeVisible();
    console.log("Navigated to Parho page:", url);
    await this.page.waitForTimeout(3000);
  }

  async enterPhoneNumber(phoneNumber) {
    await this.phoneInput.fill(phoneNumber);
    console.log("Entered phone number:", phoneNumber);
    await this.page.waitForTimeout(3000);
  }

  async clickGetOtp() {
    await this.getOtpButton.click();
    console.log("Clicked on Get OTP button");
    await this.page.waitForTimeout(3000);
  }

  async enterOtpFromEmail() {
    await this.page.waitForTimeout(25000);
    console.log("Waiting for OTP from email...");
    let otp = null;

    const start = Date.now();
    while (Date.now() - start < 50000) { // wait up to 30 seconds total
      otp = await checkEmailsForPINPParho();
      if (otp) break;
      console.log("OTP not found yet, retrying...");
      await this.page.waitForTimeout(5000);
    }

    if (!otp) throw new Error("No OTP found in mailbox.");

    console.log("OTP found:", otp);
    await this.page.waitForTimeout(3000);

    for (let i = 0; i < otp.length; i++) {
      await this.otpInputs.nth(i).fill(otp[i]);
      await this.page.waitForTimeout(500); // small delay per digit
    }

    await this.page.waitForTimeout(3000);
    console.log("OTP entered successfully");
  }

 async submitLogin() {
  const submitBtn = this.page.locator("button:has-text('Subscribe'), [class='submit-ot ']");
  await submitBtn.waitFor({ state: "visible", timeout: 10000 });
  await this.page.waitForTimeout(2000);
  await submitBtn.click({ force: true });
  console.log("Clicked Subscribe button — login flow complete");
  await this.page.waitForTimeout(3000);
}





//Logout Flow
// [class="dropdown-toggle text-white small show"]    this is for the dropdown 
// //span[normalize-space()='Unsubscribe']    this is for the unsubscribe button
    async logout() {
  await this.page.waitForLoadState('domcontentloaded');
  await this.page.waitForTimeout(3000);

  const menu = this.page.locator('[class="dropdown-toggle text-white small"]');
  const unsubscribe = this.page.locator("//span[normalize-space()='Unsubscribe']");

  await menu.waitFor({ state: 'visible', timeout: 10000 });
  await menu.click();
  console.log("Dropdown opened");
  await this.page.waitForTimeout(1000);
  await unsubscribe.click();

  console.log("Logged out successfully");
  await this.page.waitForTimeout(6000);
}

}
