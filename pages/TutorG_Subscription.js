import { checkEmailsForPINtutorG } from "../util/EmailUtil_TutorG.js";
export class tutorGLoginPage {
  constructor(page) {
    this.page = page;
    this.chooseGrade = page.locator('(//div[@class="category-container "])[1]');
    this.selectGrade = page.locator("//div/span[text()='O-Levels']");
    this.burgerMenu = page.locator('[src="/static/media/hamburger.6397917057bcd7678e1a.webp"]');
    this.profileMenu = page.locator("//span[text()='Profile']");
    this.profileLoginlink = page.locator("//a[text()='Login']");
    this.profileLogoutlink = page.locator("//a[text()='Logout']");
    this.downloads = page.locator("//a[text()='Downloads']");
    this.otpInput = page.locator('//input[@maxlength="1"]');
    this.msisdn = page.locator('div.tutor-input>input[placeholder="3xxxxxxxxx"]');
    this.changeClassDropDown = page.locator("div.sub_select");
    this.changeGrade = page.locator("//div/span[text()='Grade V']");
    this.lockcontent = page.locator('(//div[@class="unlock-overlay"])[1]');
    this.selectGradebtn = page.getByRole("button", { name: "Select Grade" });
    this.courseVideos = page.locator("(//li/a[text()='Course Videos'])[1]");
    this.pastPapers = page.locator("(//li/a[text()='Past Papers'])[1]");
    this.assesments = page.locator("(//li/a[text()='Assessments'])[1]");
    this.notes = page.locator("(//li/a[text()='Notes'])[1]");
    this.selectSubject = page.locator("//div[text()='Islamiyat']");
    this.selectSubjectPastpaper = page.locator("//div[text()='English']");
    this.pastpaperYear = page.locator("//button[text()='Select Year']");
    this.pastpaperYearDropdown = page.locator('(//a[@class="dropdown-item"])[1]');
    this.enrolmentbtn = page.getByRole("button", { name: "Enroll Now" });
    this.selectPartner = page.locator('//img[@alt="outclass box"]');
    this.pastpaper = page.locator('(//img[@alt="biology"])[1]');
    this.selectChapter = page.locator('(//div[@class="subject-card"])[1]');
    this.nextBtn = page.getByRole("button", { name: "Next" });
    this.proceedbtn = page.getByRole("button", { name: "Proceed" });
    this.checkbox = page.locator('//input[@type="checkbox"]');
    this.sendOTP = page.getByRole("button", { name: "Send OTP" });
    this.yourSubscription = page.locator("//a[text()='Your Enrollments']");
    this.contentunlocked = page.locator('(//div[@class="subject-image"])[2]');
    this.downloadNotesBtn = page.getByRole("button", { name: "Download" });
    this.downloadedNotesCard = page
      .getByRole("img", { name: "biology" })
      .first();
    this.selectChapterLectures = page.locator('(//img[@alt="biology"])[3]');
    this.downloadedBtn = page.getByRole("button", { name: "Downloaded" });
    this.performanceMetrics = { apiTimings: [], fpsData: [] };
  }

  async gotoLoginPage() {
    try {
      await this.page.goto("https://tutorg.ecnstg.com");
      console.log("Navigated to TutorG Home Page")
    } catch (error) {
      console.error("gotoLoginPage error:", error);
      throw error;
    }
  }

  async clickLoginButton() {
    await this.chooseGrade.isVisible();
    await this.chooseGrade.click();
    await this.selectGrade.click();
    await this.selectGradebtn.click();
    await this.burgerMenu.click();
    await this.profileMenu.click();
    await this.profileLoginlink.click();
    await this.page.waitForTimeout(3000);
  }

  async enterPhoneNumber(phone) {
    await this.page.waitForTimeout(2000);
    await this.msisdn.click();
    await this.msisdn.type(phone);
    await this.page.waitForTimeout(3000);
  }

  async submitLogin() {
    await this.page.getByRole("button", { name: "Get OTP" }).click();
  }

  async waitForPINInput() {
    await this.page.waitForTimeout(23000);
  }

  async enterPIN(pin) {
    await this.page.getByRole("textbox").nth(0).fill(pin[0]);
    await this.page.getByRole("textbox").nth(1).fill(pin[1]);
    await this.page.getByRole("textbox").nth(2).fill(pin[2]);
    await this.page.getByRole("textbox").nth(3).fill(pin[3]);
  }

  async submitPIN() {
    await this.page.getByRole("button", { name: "Verify" }).click();
    await this.page.waitForTimeout(2000);
  }

  async accessVideoLectures() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(2000);
    await this.courseVideos.click();
    await this.selectSubject.click();
    await this.page.waitForTimeout(3000);
    await this.selectPartner.click();
    await this.page.waitForTimeout(3000);
    await this.selectChapterLectures.click();
    await this.page.waitForTimeout(3000);
  }

  async Subscribe() {
    await this.page.waitForTimeout(2000);
    await this.lockcontent.click();
    await this.enrolmentbtn.click();
    await this.nextBtn.click();
    await this.proceedbtn.click();
    await this.page.waitForTimeout(2000);
    await this.checkbox.click();
    await this.page.waitForTimeout(2000);
    await this.sendOTP.click();
    await this.page.waitForTimeout(2000);
    let subpin = null;
    await this.page.waitForTimeout(25000);
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`Attempt ${attempt} to fetch subscription OTP`);
      subpin = await checkEmailsForPINtutorG();
      console.log("Resolved PIN For Sub is", subpin);
      if (subpin) break;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    await this.otpInput.nth(0).fill(subpin[0]);
    await this.otpInput.nth(1).fill(subpin[1]);
    await this.otpInput.nth(2).fill(subpin[2]);
    await this.otpInput.nth(3).fill(subpin[3]);
    await this.page.getByRole("button", { name: "Subscribe" }).click();
    await this.page.locator("//button[text()='Ok']").click();
    await this.page.waitForTimeout(3000);
  }

  async accessPaidContent() {
    await this.page.reload();
    await this.page.waitForTimeout(3000);
    await this.contentunlocked.click();
    await this.page.waitForTimeout(3000);
  }

  async accessAssesments() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(2000);
    await this.assesments.click();
    await this.selectSubject.click();
    await this.page.waitForTimeout(3000);
    await this.selectPartner.click();
    await this.page.waitForTimeout(3000);
    await this.selectChapterLectures.click();
    await this.page.waitForTimeout(3000);
  }

  async accessPastPapers() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(2000);
    await this.pastPapers.click();
    await this.selectSubjectPastpaper.click();
    await this.pastpaperYear.click();
    await this.pastpaperYearDropdown.click();
    await this.pastpaper.click();
    await this.page.waitForTimeout(3000);
    await this.page.screenshot({ fullPage: true, path: "pastpapers.png" });
    await this.page.waitForTimeout(3000);
  }

  async accessNotes() {
    await this.page.waitForTimeout(3000);
    await this.notes.click();
    await this.selectSubject.click();
    await this.selectPartner.click();
    await this.page.waitForTimeout(2000);
    await this.selectChapter.click();
  }

  async DownloadNotes() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(2000);
    await this.downloadNotesBtn.click();
    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState("domcontentloaded");
    await this.burgerMenu.click();
    await this.profileMenu.click();
    await this.downloads.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.downloadedNotesCard.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(3000);
    await this.downloadedBtn.click();
    await this.page.waitForTimeout(3000);
  }

  async Unsub() {
    await this.page.waitForTimeout(3000);
    await this.page.waitForLoadState("domcontentloaded");
    await this.burgerMenu.click();
    await this.profileMenu.click();
    await this.yourSubscription.click();
    await this.selectPartner.click();
    await this.page.waitForTimeout(2000);
    await this.page.locator("//button[text()='Unsubscribe']").click();
    await this.page.waitForTimeout(3000);
  }

  async Logout() {
    await this.page.waitForTimeout(3000);
    await this.page.reload();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(3000);
    await this.burgerMenu.click();
    await this.profileMenu.click();
    await this.profileLogoutlink.click();
    await this.page.waitForTimeout(8000);
  }
}
