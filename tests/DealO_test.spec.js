import { test } from "@playwright/test";
import { DealoLoginPage } from "../pages/DealO_Subscription.js";

const PHONE = process.env.PHONE_NUMBER;

test.describe("Dealo End to End flow", () => {
  test.describe.configure({ mode: "serial" });
  let loginPage;
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    loginPage = new DealoLoginPage(page);
  });

  test("Verify that the login page is accessible", async () => {
    await loginPage.gotoLoginPage();
    await loginPage.clickLoginButton();
  });

  test("Verify that the user can request an OTP for the provided Jazz Number", async () => {
    await loginPage.enterPhoneNumber(PHONE);
    await loginPage.submitLogin();
  });

  test("Verify that the user can Login after providing a Valid OTP", async () => {
    await loginPage.waitForPINInput();
    await loginPage.enterPIN();
    await loginPage.submitPIN();
  });

  test("Verify that the user can select Food Category", async () => {
    await loginPage.selectFoodCategory();
  });

  test("Verify that the user can select a Deal in Food Category", async () => {
    await loginPage.selectaDeal();
  });

  test("Verify that the user can redeem the selected Deal in Food Category", async () => {
    await loginPage.redeemDeal();
  });

  test("Verify that the user can Unsubscribe after Successful Subscription", async () => {
    await loginPage.Logout();
  });

  test.afterAll(async () => {
    await loginPage.page.context().close();
  });
});
