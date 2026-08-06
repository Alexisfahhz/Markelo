/*
  Vision-free verification, Institution & governance flow.
  Measures scroll positions, click-through actions, artboard geometry, and
  navigation behaviour. Run: node verify.mjs
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
  console.log("screens:", ids.length, ids.length === 5 ? "PASS" : "FAIL");
  console.log("order:", ids.join(", "));

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

  /* 1. Result Correction "Correct" button -> editing panel */
  await go("result-correction");
  await settle();
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#result-correction button")].find((b) =>
      b.textContent.includes("Correct")
    );
    if (btn) btn.click();
  });
  await settle();
  expect("correction->editing", await scrollY(), tops["result-correction-editing"]);

  /* 2. Editing "Save correction and re-lock" -> back to correction */
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#result-correction-editing button")].find((b) =>
      b.textContent.includes("Save correction and re-lock")
    );
    if (btn) btn.click();
  });
  await settle();
  expect("editing-save->correction", await scrollY(), tops["result-correction"]);

  /* 3. Editing "Cancel, re-lock unchanged" -> back to correction */
  await go("result-correction-editing");
  await settle();
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("#result-correction-editing button")].find((b) =>
      b.textContent.includes("Cancel, re-lock unchanged")
    );
    if (btn) btn.click();
  });
  await settle();
  expect("editing-cancel->correction", await scrollY(), tops["result-correction"]);

  /* 4. Nav: single instance, prev/next/top */
  const navCount = await page.evaluate(() => document.querySelectorAll("nav.fixed").length);
  console.log("nav instances:", navCount, navCount === 1 ? "PASS" : "FAIL");

  await go("institution-setup");
  await settle();
  const prevDisabled = await page.evaluate(
    () => document.querySelector("nav.fixed button[aria-label^='Previous']")?.hasAttribute("disabled")
  );
  console.log("prev disabled on first screen:", prevDisabled, prevDisabled ? "PASS" : "FAIL");

  await page.evaluate(() => document.querySelector("nav.fixed button[aria-label^='Next']").click());
  await settle();
  expect("nav-next->admin-settings", await scrollY(), tops["admin-settings"]);

  await page.evaluate(() => document.querySelector("nav.fixed button[aria-label^='Previous']").click());
  await settle();
  expect("nav-prev->institution-setup", await scrollY(), tops["institution-setup"]);

  await go("result-correction-editing");
  await settle();
  const nextDisabled = await page.evaluate(
    () => document.querySelector("nav.fixed button[aria-label^='Next']")?.hasAttribute("disabled")
  );
  console.log("next disabled on last screen:", nextDisabled, nextDisabled ? "PASS" : "FAIL");

  /* 5. Artboard geometry */
  const geo = await page.evaluate(() => {
    const sections = [...document.querySelectorAll("section[id]")];
    return sections.map((sec) => {
      const inner = sec.querySelector("div.mx-auto > div");
      if (!inner) return { id: sec.id, w: 0, h: 0, clipped: false };
      const r = inner.getBoundingClientRect();
      return { id: sec.id, w: Math.round(r.width), h: Math.round(r.height) };
    });
  });
  let geoPass = true;
  for (const g of geo) {
    const ok = g.w === 1440 && g.h === 1024;
    console.log(`geometry ${g.id}: ${g.w}x${g.h} ${ok ? "PASS" : "FAIL"}`);
    if (!ok) geoPass = false;
  }

  /* 6. Screenshots */
  await page.evaluate(() => document.querySelector("nav.fixed button[aria-label='Scroll to top']").click());
  await settle();
  await page.screenshot({ path: "verify/01-institution-setup.png" });
  await go("audit-trail");
  await settle();
  await page.screenshot({ path: "verify/04-audit-trail.png" });
  await go("result-correction-editing");
  await settle();
  await page.screenshot({ path: "verify/06-result-correction-editing.png" });

  console.log("js errors:", errors.length ? errors : "none");
  await browser.close();
  server.kill();

  if (errors.length > 0 || !geoPass) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});