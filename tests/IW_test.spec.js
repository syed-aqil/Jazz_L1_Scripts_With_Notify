import dotenv from "dotenv";
import { test } from "@playwright/test";
import { LoginPage } from "../pages/IW_LandingPage.js";
import { checkEmailsForPINJIW } from "../util/EmailUtils_IW.js";

dotenv.config();
const PHONE = process.env.PHONE_NUMBER;

test.describe("Jazz Islam World End to End flow", () => {
  test.describe.configure({ mode: "serial" });
  let context;
  let loginPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      permissions: ["geolocation"],
      baseURL: "http://islamworld.com.pk",
    });
    const page = await context.newPage();
    loginPage = new LoginPage(page);
  });
  test("Verify that the login page is accessable", async () => {
    await loginPage.gotoLoginPage();
    await loginPage.clickLoginButton();
  });

  test("Verify that the user can request an OTP for the provided Jazz Number", async () => {
    await loginPage.enterPhoneNumber(PHONE);
    await loginPage.submitLogin();
  });

  test("Verify that the user can Login with Valid OTP", async () => {
    await loginPage.waitForPINInput();
    const pin = await checkEmailsForPINJIW();
    console.log("Resolved PIN:", pin);
    await loginPage.enterPIN(pin);
    await loginPage.submitPIN();
  });

  test("Verify that Quran Section is accessable", async () => {
    await loginPage.quran();
  });

  // test("Verify that user can search for Surah and Play the Retruned Surah", async () => {
  //   await loginPage.searchandPlaySurah();
  // });

  test("Verify that user can Access Videos Section and Search for Videos", async () => {
    await loginPage.VideoSection();
  });

  // test("Verify that user can Access Dua Section and access Dua Categories", async () => {
  //   await loginPage.duaForEmotions();
  // });

  test("Verify that user can Access Quiz Section and Start Quiz after Sub", async () => {
    await loginPage.quizSection();
  });

  test("Verify that user can Access Quotations Section", async () => {
    await loginPage.Quotations();
  });

  test("Verify that the user can logout after successful Login", async () => {
    await loginPage.UnSubscribe();
  });

  test.afterAll(async () => {
    await loginPage.page.context().close();
  });
});
