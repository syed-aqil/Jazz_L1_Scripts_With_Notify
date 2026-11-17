import dotenv from "dotenv";
import { test } from "@playwright/test";
import { tutorGLoginPage } from "../pages/TutorG_Subscription.js";
import { checkEmailsForPINtutorG } from "../util/EmailUtil_TutorG.js";

dotenv.config();
const PHONE = process.env.PHONE_NUMBER;
let loginPage;
test.describe("TutorG End to End flow", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    loginPage = new tutorGLoginPage(page);
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
    const pin = await checkEmailsForPINtutorG();
    console.log("Resolved PIN:", pin);
    await loginPage.enterPIN(pin);
    await loginPage.submitPIN();
  });

  test("Verify that the user can Access Course Videos after Login", async () => {
    await loginPage.accessVideoLectures();
  });

  // test("Verify that the user can Subscribe after Login", async () => {
  //   await loginPage.Subscribe();
  //   await loginPage.accessPaidContent();
  // });

  test("Verify that the the user can Subscribe for Notes and access it", async () => {
    await loginPage.accessNotes();
  });

  test("Verify that the user can Access Past Papers after Subscription", async () => {
    await loginPage.accessPastPapers();
  });

  test("Verify that the user can Access Assesments after Subscription", async () => {
    await loginPage.accessAssesments();
  });

  // test("Verify that the user can Unsubscribe after Successful Subscription", async () => {
  //   await loginPage.Unsub();
  // });

  test("Verify that the user can Logout", async () => {
    await loginPage.Logout();
  });

  test.afterAll(async () => {
    await loginPage.page.context().close();
  });
});
