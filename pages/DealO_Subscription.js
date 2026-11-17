import fs from "fs";
import { checkEmailsForPINDealo } from "../util/dealoEmailUtil";
export class DealoLoginPage {
  constructor(page) {
    this.page = page;
    this.loginbtn = page.locator("a.nav-link.dropdown-toggle");
    this.subbtn = page.getByRole("link", { name: "Subscribe" });
    this.landingForm = page.locator("#landingForm");
    this.msisdn = page.locator("#msisdn");
    this.getOTP = page.locator("button.submit_otp.mb-block");
    this.otpInput = page.locator('[class="number_taken_inputcol otp_input"]');
    this.foodSection = page.locator("//div/ul/li/a[text() = 'Food']");
    this.currentIndex = this.getCurrentIndex();
    this.selecDeal = page.locator(
      `(//div[@class="online_store_grid_col"]/figure)[${this.currentIndex}]`
    );
    this.selectOutlet = page.locator("//div[text() = 'Select Outlet']");
    this.location = page.locator('(//ul[@class="select-options"])[2]/li[2]');
    this.getDiscountbtn = page.getByRole("button", { name: "Get Discount" });
    this.continuebtn = page.locator("(//a[text()='Continue'])[1]");
    this.crossbtn = page.locator('button.close[aria-label="Close"]');
    this.pinInputs = page.getByRole("textbox");
    this.submitOTP = page.locator(
      "button.submit_otp.mb-block.ajax_button_submit"
    );
    this.redeembtn = page.getByRole("button", { name: "Continue" });
    this.logoutLink = page.locator("a.dropdown-item.gtm_unsubscribe");
  }

  getCurrentIndex() {
    try {
      if (!fs.existsSync("dealoState.json")) {
        const initialState = { currentIndex: 1 };
        fs.writeFileSync(
          "dealoState.json",
          JSON.stringify(initialState, null, 2)
        );
        console.log("Initialized dealoState.json with index 1");
        return 1;
      }
      const data = fs.readFileSync("dealoState.json", "utf8");
      console.log("State data:", data);
      const state = JSON.parse(data);
      return state.currentIndex || 1;
    } catch (error) {
      console.error("Error reading state file:", error);
      return 1;
    }
  }

  updateIndex() {
    try {
      let newIndex;
      if (!fs.existsSync("dealoState.json")) {
        newIndex = 1;
      } else {
        const data = fs.readFileSync("dealoState.json", "utf8");
        const state = JSON.parse(data);
        newIndex = (state.currentIndex || 1) + 1;
        if (newIndex > 31) {
          newIndex = 1;
        }
      }
      const state = { currentIndex: newIndex };
      fs.writeFileSync("dealoState.json", JSON.stringify(state, null, 2));
      console.log("Index updated to:", newIndex);
      this.currentIndex = newIndex;
      this.selecDeal = this.page.locator(
        `(//div[@class="online_store_grid_col"]/figure)[${this.currentIndex}]`
      );
    } catch (error) {
      console.error("Error updating state file:", error);
    }
  }

  
  async gotoLoginPage() {
    try {
      await this.page.goto("https://dealo.com.pk/home/islamabad");
    } catch (error) {
      console.error("gotoLoginPage error:", error);
      throw error;
    }
    await this.page.waitForLoadState("domcontentloaded");
  }

  async clickLoginButton() {
    await this.loginbtn.click();
    await this.subbtn.click();
    await this.page.waitForTimeout(3000);
  }

  async enterPhoneNumber(phone) {
    await this.landingForm.click();
    await this.page.waitForTimeout(2000);
    await this.msisdn.type(phone);
    await this.page.waitForTimeout(3000);
  }

  async submitLogin() {
    await this.getOTP.click();
  }

  async waitForPINInput() {
    await this.page.waitForTimeout(1000);
    await this.otpInput.click();
    await this.page.waitForTimeout(20000);
  }

  async enterPIN() {
    let pin = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`Attempt ${attempt} to fetch subscription OTP`);
      pin = await checkEmailsForPINDealo();
      console.log("Resolved PIN For Sub is", pin);
      if (pin) break;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    await this.pinInputs.nth(0).fill(pin[0]);
    await this.pinInputs.nth(1).fill(pin[1]);
    await this.pinInputs.nth(2).fill(pin[2]);
    await this.pinInputs.nth(3).fill(pin[3]);
    await this.page.waitForTimeout(1000);
  }

  async submitPIN() {
    await this.submitOTP.click();
  }

  async selectFoodCategory() {
    await this.page.waitForTimeout(2000);
    await this.foodSection.click();
    await this.page.waitForTimeout(3000);
  }

  async selectaDeal() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.foodSection.click();
    for (let i = 0; i < 12; i++) {
      await this.page.keyboard.press("PageDown");
      await this.page.waitForTimeout(3000);
    }
    await this.selecDeal.click();
    await this.page.waitForTimeout(3000);
    await this.updateIndex();
    await this.page.waitForTimeout(2000);
  }

  async redeemDeal() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.selectOutlet.click();
    await this.location.click();
    await this.getDiscountbtn.click();
    await this.continuebtn.click();
    await this.page.waitForTimeout(3000);
    await this.pinInputs.nth(0).fill("8");
    await this.pinInputs.nth(1).fill("3");
    await this.pinInputs.nth(2).fill("6");
    await this.pinInputs.nth(3).fill("5");
    await this.redeembtn.click();
    await this.page.waitForTimeout(4000);
    if (await this.crossbtn.isVisible()) {
      await this.crossbtn.click();
    } else {
      console.log("Deal Already Redeemed");
    }
    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async Logout() {
    await this.page.waitForTimeout(3000);
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(3000);
    await this.page.locator("a.nav-link.dropdown-toggle").click();
    await this.logoutLink.click();
    await this.page.waitForTimeout(5000);
  }
}
