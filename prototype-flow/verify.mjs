/*
  Vision-free verification. Measures scroll positions against known section
  tops. Run: node verify.mjs
*/
import { spawn } from "child_process";
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 5180;
const URL = `http://localhost:${PORT}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
    cwd: process.cwd(),
    stdio: "pipe",
  });
  await sleep(2500);

  const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

  await page.goto(URL, { waitUntil: "networkidle0" });

  const tops = await page.evaluate(() =>
    Object.fromEntries(
      [...document.querySelectorAll("section[id]")].map((el) => [
        el.id,
        Math.round(el.getBoundingClientRect().top + window.scrollY),
      ])
    )
  );
  const ids = Object.keys(tops);
  console.log("screens:", ids.length, "order:", ids.join(", "));

  const scrollY = () => page.evaluate(() => Math.round(window.scrollY));
  const click = (selector) =>
    page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) throw new Error(`not found: ${sel}`);
      el.click();
    }, selector);
  const go = (id) =>
    page.evaluate(
      (i) => document.getElementById(i)?.scrollIntoView({ block: "start" }),
      id
    );
  const expect = (label, actual, expected, tol = 60) =>
    console.log(
      `${label}: scrollY=${actual} expected~${expected} ${Math.abs(actual - expected) <= tol ? "PASS" : "FAIL"}`
    );
  const settle = async () => {
    for (let i = 0; i < 40; i++) {
      const a = await scrollY();
      await sleep(250);
      const b = await scrollY();
      if (Math.abs(a - b) <= 2) return;
    }
  };

  /* 1. Sign in -> Signing In */
  await click("#signin button.bg-brand");
  await settle();
  expect("sign-in->loading", await scrollY(), tops["signin-loading"]);

  /* 2. Any click on the loading screen -> MFA (loading state advance) */
  await page.mouse.click(720, 450);
  await settle();
  expect("loading-anyclick->mfa", await scrollY(), tops["mfa"]);

  /* 3. MFA Confirm -> Choose Role */
  await click("#mfa button.bg-brand");
  await settle();
  expect("mfa-confirm->choose-role", await scrollY(), tops["choose-role"]);

  /* 4. Choose Role: Lecturer card -> Lecturer dashboard */
  await page.evaluate(() => {
    const card = [...document.querySelectorAll("#choose-role button")].find((b) =>
      b.textContent.includes("Lecturer")
    );
    card.click();
  });
  await settle();
  expect("choose-lecturer->dash-lecturer", await scrollY(), tops["dash-lecturer"]);

  /* 5. Forgot password link + reverse link */
  await go("signin");
  await sleep(400);
  await click("#signin a");
  await settle();
  expect("signin-forgot->forgot", await scrollY(), tops["forgot"]);
  await click("#forgot a.text-brand");
  await settle();
  expect("forgot-back->signin", await scrollY(), tops["signin"]);

  /* 6. Single app-level nav: prev/next/auth/top */
  await go("dash-officer");
  await settle();
  const navCount = await page.evaluate(() => document.querySelectorAll("nav.fixed").length);
  console.log("nav instances on page:", navCount, navCount === 1 ? "PASS" : "FAIL");
  const prevDisabled = await page.evaluate(
    () => document.querySelector("nav.fixed button[aria-label='Previous dashboard']")?.hasAttribute("disabled")
  );
  console.log("nav prev disabled on first dashboard:", prevDisabled, prevDisabled ? "PASS" : "FAIL");

  await page.evaluate(() => document.querySelector("nav.fixed button[aria-label='Next dashboard']").click());
  await settle();
  expect("nav-next->dash-lecturer", await scrollY(), tops["dash-lecturer"]);

  await page.evaluate(() => document.querySelector("nav.fixed button[aria-label='Next dashboard']").click());
  await settle();
  expect("nav-next->dash-ta", await scrollY(), tops["dash-ta"]);

  await page.evaluate(() => document.querySelector("nav.fixed button[aria-label='Previous dashboard']").click());
  await settle();
  expect("nav-prev->dash-lecturer", await scrollY(), tops["dash-lecturer"]);

  await page.evaluate(() => document.querySelector("nav.fixed button[aria-label='Back to authentication']").click());
  await settle();
  expect("nav-auth->signin", await scrollY(), tops["signin"]);

  await go("dash-management");
  await settle();
  const nextDisabled = await page.evaluate(
    () => document.querySelector("nav.fixed button[aria-label='Next dashboard']")?.hasAttribute("disabled")
  );
  console.log("nav next disabled on last dashboard:", nextDisabled, nextDisabled ? "PASS" : "FAIL");

  /* 7. Screenshots for the record (diffed, not eyeballed) */
  await page.evaluate(() => document.querySelector("nav.fixed button[aria-label='Scroll to top']").click());
  await settle();
  await page.screenshot({ path: "verify/01-signin.png" });
  await go("dash-officer");
  await settle();
  await page.screenshot({ path: "verify/13-dash-officer.png" });
  await go("dash-management");
  await settle();
  await page.screenshot({ path: "verify/18-dash-management.png" });
  await page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ block: "start" }), "mfa");
  await settle();
  await page.screenshot({ path: "verify/04-mfa.png" });

  console.log("js errors:", errors.length ? errors : "none");
  await browser.close();
  server.kill();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
