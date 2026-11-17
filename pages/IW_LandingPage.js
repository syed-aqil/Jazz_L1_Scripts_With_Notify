export class LoginPage {
  constructor(page) {
    this.page = page;
    this.subBtn = page.getByText("Subscribe");
    this.phoneNumberField = page.getByRole("textbox", { name: "3xx xxxx xxx" });
    this.getPINBtn = page.getByText("Get PIN");
    this.confirmBtn = page.getByRole("button", { name: "Subscribe" });
    this.quranSection = page.locator("(//div[text()='Quran'])[1]");
    this.searchSurah = page.locator('[placeholder="Search Surah"]');
    this.magnifier = page.locator('svg[data-icon="paper-plane"]');
    this.selectSurah = page.locator("//div[text()='العَصْر']");
    this.playBtn = page.locator(
      '[class="rhap_button-clear rhap_main-controls-button rhap_play-pause-button"]'
    );
    this.videoSection = page.locator("(//div[text()='Videos'])[1]");
    this.searchVideo = page.locator('[aria-label="Search"]');
    this.searchicon = page.locator('svg[data-icon="paper-plane"]');
    this.playVideo = page.locator(
      '//div[@class="video-item-style img-wrapper"]/img'
    );
    this.ytPlayBtn = page.locator(
      '//div/div/div[@class="ytp-cued-thumbnail-overlay"]/button[@aria-label="Play"]'
    );
    this.duaSection = page.locator("(//div[text()='DUA FOR EMOTIONS'])[1]");
    this.dua = page.locator("//div[text()='Bored']");
    this.quiz = page.locator("//div[text()='Quiz']");
    this.quotes = page.locator("//div/div[text()='Quotations']");
    this.quoteCard = page.locator(
      '(//div[@class="img-wrapper add-shadow"])[2]'
    );
    this.okBtn = page.locator("//div[text()='OK']");
    this.startQuiz = page.locator("//div[text()='Start the Quiz']");
    this.profilDropdown = page.getByText(" Logged in as");
    this.unsub = page.getByText("UNSUBSCRIBE");
    this.performanceMetrics = { apiTimings: [], fpsData: [] };
  }

  async gotoLoginPage() {
    const url = "https://islamworld.com.pk/";
    await this.page.goto(url);
    await this.page.waitForLoadState("domcontentloaded");
    console.log(`Navigated to ${url}`)

  }

  async clickLoginButton() {
    await this.subBtn.click();
  }

  async enterPhoneNumber(phone) {
    await this.phoneNumberField.fill(phone);
    await this.page.waitForTimeout(3000);
  }

  async submitLogin() {
    await this.getPINBtn.click();
  }

  async waitForPINInput() {
    await this.page.waitForTimeout(30000);
  }

  async enterPIN(pin) {
    await this.page.getByRole("textbox").nth(0).fill(pin[0]);
    await this.page.getByRole("textbox").nth(1).fill(pin[1]);
    await this.page.getByRole("textbox").nth(2).fill(pin[2]);
    await this.page.getByRole("textbox").nth(3).fill(pin[3]);
    await this.page.waitForTimeout(2000);
  }

  async submitPIN() {
    await this.confirmBtn.click();
    await this.page.waitForTimeout(3000);
  }

  async quran() {
    await this.quranSection.click();
    await this.page.waitForTimeout(5000);
  }

  async searchandPlaySurah() {
    await this.searchSurah.fill("Al-Asr");
    await this.magnifier.click();
    await this.page.waitForTimeout(2000);
    await this.selectSurah.click();
    await this.page.waitForTimeout(10000);
    await this.playBtn.click();
    await this.page.waitForTimeout(12000);
  }

  async VideoSection() {
    await this.videoSection.click();
    await this.page.waitForTimeout(2000);
    await this.searchVideo.fill("GHAAR E HIRA MAIN PEHLI WAHI KA NAZOOL");
    await this.searchicon.click();
    await this.page.waitForTimeout(3000);
    await this.playVideo.click();
    await this.page.waitForTimeout(3000);
    // await this.ytPlayBtn.click();
    await this.page.waitForTimeout(12000);
  }

  async Quotations() {
    await this.quotes.click();
    await this.page.waitForTimeout(2000);
    await this.quoteCard.click();
    await this.page.waitForTimeout(3000);
  }

  async duaForEmotions() {
    await this.duaSection.click();
    await this.page.waitForTimeout(2000);
    await this.dua.click();
    await this.page.waitForTimeout(3000);
  }

  async quizSection() {
    await this.quiz.click();
    await this.page.waitForTimeout(2000);
    await this.okBtn.click();
    await this.page.waitForTimeout(3000);
    await this.startQuiz.click();
    await this.page.waitForTimeout(3000);
  }

  async UnSubscribe() {
    await this.page.waitForTimeout(2000);
    await this.profilDropdown.click();
    await this.page.waitForTimeout(3000);
    await this.unsub.click();
    await this.page.waitForTimeout(8000);
    await this.page.waitForLoadState("domcontentloaded");
  }
}
