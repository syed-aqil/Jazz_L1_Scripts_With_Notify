# Jazz L1 Scripts with Notify

Scheduled **Level-1 (L1) health checks** for 16 Jazz digital-service subscription journeys, built with **Playwright**. The suite runs in Docker on GitHub Actions three times a day, reads the real sign-up OTPs from email, and posts the result to Slack, so a broken subscription flow is noticed within hours instead of from customer complaints.

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![Slack](https://img.shields.io/badge/Slack%20alerts-4A154B?style=flat-square&logo=slack&logoColor=white)

## What it checks

Each test opens a service's landing page, enters a mobile number, requests the OTP, fetches the OTP from the inbox over IMAP and completes the subscription flow end to end.

| Area | Services covered |
|---|---|
| Entertainment | Tamasha, Tamasha Prime, Fusion |
| Games | Game Club, Game Quest, DH Games Box, GW |
| Learning | Parho, TutorG |
| Health & insurance | MediQ, Bima Sehat |
| Lifestyle & utility | DealO, FikrFree, Dehqaan, Taqdeer, IW |

## How it works

```
GitHub Actions (cron 05:00 / 09:00 / 13:00 UTC, or manual)
  └─ docker build  →  Playwright image with browsers
       └─ npx playwright test
            ├─ pages/*      page objects per service
            ├─ util/*       IMAP readers that pull the OTP / PIN from email
            └─ tests/*      one spec per service
  └─ jq parses results  →  pass / fail / flaky counts
  └─ HTML report uploaded as artifact
  └─ Slack notification with the summary
```

**Design choices**

- **Page Object Model:** one class per service in `pages/`, so a UI change is fixed in one place.
- **Real OTP handling:** `util/*EmailUtil*.js` read the inbox over IMAP and extract the code with service-specific patterns.
- **Flaky detection:** the workflow counts tests that failed first and passed on retry and reports them separately.
- **Containerised runs:** the same Docker image runs locally and in CI.
- **Rotating test numbers:** `dealoState.json` keeps an index so each run uses a fresh MSISDN.
- **No secrets in code:** everything sensitive comes from `.env` locally or GitHub Secrets in CI.

## Running locally

```bash
npm install
npx playwright install
cp .env.example .env   # fill in the values
npx playwright test
npx playwright show-report
```

With Docker:

```bash
docker compose up --build
# report: http://localhost:9323
```

On Windows you can also run `windows.bat`.

## Configuration

See [`.env.example`](.env.example). It needs the landing-page URL of each service, the inbox used to receive OTPs (IMAP, app password), a test phone number, and basic-auth credentials for environments that need them. In CI these come from repository secrets.

---

Author: [Syed Aqil Shah](https://github.com/syed-aqil) · QA Automation & Security Engineer
