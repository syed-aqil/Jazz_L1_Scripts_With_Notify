import Imap from "imap";
import { simpleParser } from "mailparser";
import dotenv from "dotenv";

dotenv.config();
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

export function extractPIN(text) {
  const otpMatch7012 = text.match(
    /Jazz Game World OTP to sign in is (\d{4})\./i
  );
  if (otpMatch7012) {
    return otpMatch7012[1];
  }

  const otpMatchJazz = text.match(
    /Your PIN is (\d{4}) Use this to log into Jazz Game World\./i
  );
  if (otpMatchJazz) {
    return otpMatchJazz[1];
  }

  return null;
}

export async function checkEmailsForPINGW() {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: EMAIL,
      password: PASSWORD,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    });

    imap.once("ready", () => {
      imap.openBox("INBOX", false, (err, box) => {
        if (err) return reject(err);

        imap.search(
          [
            "UNSEEN",
            [
              "OR",
              ["SUBJECT", "[SMSFW] New text message from '7012'"],
              ["SUBJECT", "[SMSFW] New text message from 'Jazz'"],
            ],
          ],
          (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) {
              console.log("No matching SMS forwarder emails found");
              imap.end();
              return resolve(null);
            }

            console.log(
              `Found ${results.length} matching SMS forwarder emails`
            );
            let foundPin = null;
            let messagesProcessed = 0;
            const fetch = imap.fetch(results, { bodies: "" });

            fetch.on("message", (msg, seqno) => {
              msg.on("body", (stream) => {
                let buffer = "";
                stream.on("data", (chunk) => {
                  buffer += chunk.toString("utf8");
                });
                stream.once("end", () => {
                  simpleParser(buffer, (err, mail) => {
                    if (err) return reject(err);

                    const emailText = mail.text || "";

                    const pin = extractPIN(emailText);

                    if (pin) {
                      console.log(`Found OTP: ${pin}`);
                      foundPin = pin;
                    }

                    messagesProcessed++;
                    if (messagesProcessed === results.length) {
                      imap.end();
                      resolve(foundPin);
                    }
                  });
                });
              });
            });

            fetch.once("error", reject);
          }
        );
      });
    });

    imap.once("error", reject);
    imap.connect();
  });
}
