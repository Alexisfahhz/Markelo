/*
  Vision-free verification, Institution & Governance · Booklet Profile · Marking ·
  Moderation flow. Measures scroll positions, CTA click-through actions,
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
  "institution-setup",
  "courses",
  "people-roles",
  "admin-settings",
  "audit-trail",
  "result-correction",
  "booklet-setup",
  "booklet-validation",
  "booklet-versions",
  "marking-assignment",
  "marking-progress",
  "my-courses",
  "flagged-for-review",
  "marking-interface",
  "answer-viewer",
  "returned-scripts",
  "result-approval",
  "dispute-evidence",
  "exam-performance",
  "help-guidance",
  "user-settings",
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

  /* ============================ 1. Per-screen trigger points (no floating nav) */
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

  // Next trigger from marking-assignment lands on marking-progress.
  await go("marking-assignment");
  await settle();
  await page.evaluate(() => {
    const sec = document.getElementById("marking-assignment");
    sec?.querySelector("button[aria-label^='Go to next screen']")?.click();
  });
  await sleep(2000);
  expect("trigger-next marking-assignment->marking-progress", await scrollY(), tops["marking-progress"]);

  // Previous trigger from marking-progress returns to marking-assignment.
  await page.evaluate(() => {
    const sec = document.getElementById("marking-progress");
    sec?.querySelector("button[aria-label^='Go to previous screen']")?.click();
  });
  await sleep(2000);
  expect("trigger-prev marking-progress->marking-assignment", await scrollY(), tops["marking-assignment"]);

  /* ======================================================= 2. Artboard geometry */
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

  /* ======================================================= 3. Screenshots */
  for (const [file, id] of [
    ["verify/01-institution-setup.png", "institution-setup"],
    ["verify/02-booklet-setup.png", "booklet-setup"],
    ["verify/03-marking-assignment.png", "marking-assignment"],
    ["verify/04-marking-interface.png", "marking-interface"],
    ["verify/05-returned-scripts.png", "returned-scripts"],
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
