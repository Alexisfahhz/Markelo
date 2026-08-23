/*
  Vision-free verification, Exam Setup · Student Data & Results · Scanning ·
  Triage & Review flow. Measures scroll positions, CTA click-through actions,
  per-screen trigger-point navigation, artboard geometry, and JS errors.
  Run: node verify.mjs
*/
import { spawn } from "child_process";
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 5180;
const URL = `http://localhost:${PORT}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const EXPECTED_ORDER = [
  "exam-creation",
  "marking-scheme",
  "student-upload",
  "identity-registry",
  "result-processing",
  "scan-batch-with-preview",
  "exception-queue",
  "exception-resolve",
  "moderation",
  "moderation-changed",
  "moderation-return",
];

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
  console.log("screens:", ids.length, ids.length === EXPECTED_ORDER.length ? "PASS" : "FAIL");
  const orderOk =
    ids.length === EXPECTED_ORDER.length && EXPECTED_ORDER.every((id, i) => ids[i] === id);
  console.log("order:", ids.join(", "), orderOk ? "PASS" : "FAIL");

  const scrollY = () => page.evaluate(() => Math.round(window.scrollY));
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
  const clickBtn = (scopeId, text) =>
    page.evaluate(([sid, txt]) => {
      const el = document.getElementById(sid);
      if (!el) throw new Error(`section not found: ${sid}`);
      const btn = [...el.querySelectorAll("button")].find((b) =>
        b.textContent.toLowerCase().includes(txt.toLowerCase())
      );
      if (!btn) throw new Error(`button "${txt}" not found in ${sid}`);
      btn.click();
    }, [scopeId, text]);

  /* =========================================== 1. Create exam -> Marking Scheme */
  await go("exam-creation");
  await sleep(1500);
  await clickBtn("exam-creation", "Create exam");
  await sleep(2000);
  expect("exam-creation->marking-scheme", await scrollY(), tops["marking-scheme"]);

  /* ====================================== 2. Confirm scheme -> Student Upload */
  await go("marking-scheme");
  await sleep(1500);
  await clickBtn("marking-scheme", "Confirm scheme");
  await sleep(2000);
  expect("marking-scheme->student-upload", await scrollY(), tops["student-upload"]);

  /* ==================================== 3. Exception Queue -> Resolve */
  await go("exception-queue");
  await sleep(1500);
  await clickBtn("exception-queue", "Open and resolve");
  await sleep(2000);
  expect("exception-queue->exception-resolve", await scrollY(), tops["exception-resolve"]);

  /* ============================ 4. Per-screen trigger points (no floating nav) */
  const navCount = await page.evaluate(() => document.querySelectorAll("nav.fixed").length);
  console.log("floating nav instances:", navCount, navCount === 0 ? "PASS" : "FAIL");

  const hasTrigger = (sid, dir) =>
    page.evaluate(
      ([s, d]) => {
        const sec = document.getElementById(s);
        return !!sec?.querySelector(`button[aria-label^='Go to ${d} screen']`);
      },
      [sid, dir]
    );

  const firstPrev = await hasTrigger(EXPECTED_ORDER[0], "previous");
  console.log("prev trigger on FIRST screen:", firstPrev, firstPrev ? "FAIL" : "PASS");

  const lastNext = await hasTrigger(EXPECTED_ORDER.at(-1), "next");
  console.log("next trigger on LAST screen:", lastNext, lastNext ? "FAIL" : "PASS");

  // Next trigger from identity-registry lands on result-processing.
  await go("identity-registry");
  await settle();
  await page.evaluate(() => {
    const sec = document.getElementById("identity-registry");
    sec?.querySelector("button[aria-label^='Go to next screen']")?.click();
  });
  await sleep(2000);
  expect("trigger-next identity-registry->result-processing", await scrollY(), tops["result-processing"]);

  // Previous trigger from result-processing returns to identity-registry.
  await page.evaluate(() => {
    const sec = document.getElementById("result-processing");
    sec?.querySelector("button[aria-label^='Go to previous screen']")?.click();
  });
  await sleep(2000);
  expect("trigger-prev result-processing->identity-registry", await scrollY(), tops["identity-registry"]);

  /* ======================================================= 5. Artboard geometry */
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

  /* ======================================================= 6. Screenshots */
  for (const [file, id] of [
    ["verify/01-exam-creation.png", "exam-creation"],
    ["verify/02-marking-scheme.png", "marking-scheme"],
    ["verify/03-student-upload.png", "student-upload"],
    ["verify/04-identity-registry.png", "identity-registry"],
    ["verify/05-scan-batch-with-preview.png", "scan-batch-with-preview"],
  ]) {
    await go(id);
    await sleep(1500);
    await page.screenshot({ path: file });
  }

  console.log("js errors:", errors.length ? errors : "none");
  await browser.close();
  server.kill();

  if (errors.length > 0 || !geoPass || !orderOk) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
