// End-to-end test of the AJK portal (public + admin). Run: npm run test:e2e
// Needs: npm install (playwright-core), a running site, and ADMIN_EMAIL / ADMIN_PASSWORD of a test admin.
// Example: BASE_URL=http://localhost:3000 ADMIN_EMAIL=... ADMIN_PASSWORD=... node tests/e2e.mjs
import { chromium } from "playwright-core";
import { createHmac } from "crypto";
import fs from "fs";

const B = process.env.BASE_URL || "http://localhost:3000";
const ADMIN = { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD };
const results = [];
const ok = (name, pass, info = "") => {
  results.push(`${pass ? "PASS" : "FAIL"}  ${name}${info ? "  (" + info + ")" : ""}`);
  console.log(results.at(-1));
};
const consoleErrors = [];

function totp(secret) {
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const c of secret) bits += A.indexOf(c).toString(2).padStart(5, "0");
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000)));
  const h = createHmac("sha1", Buffer.from(bytes)).update(buf).digest();
  const o = h[h.length - 1] & 0xf;
  return String((((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3]) % 1e6).padStart(6, "0");
}

const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: false, args: ["--headless=new"] });

async function newPage(ctx) {
  const p = await ctx.newPage();
  p.on("console", (m) => m.type() === "error" && consoleErrors.push(`${p.url()} :: ${m.text().slice(0, 700)}`));
  p.on("pageerror", (e) => consoleErrors.push(`${p.url()} :: PAGEERROR ${e.message.slice(0, 160)}`));
  return p;
}

async function login(page, email, password, code) {
  await page.goto(B + "/admin/login");
  await page.fill("input[name=email]", email);
  await page.fill("input[name=password]", password);
  await page.click("form button");
  if (code !== undefined) {
    await page.waitForSelector("input[name=code]", { timeout: 10000 });
    await page.fill("input[name=code]", code());
    await page.click("form button");
  }
  await page.waitForURL(/\/admin$/, { timeout: 15000 });
}

const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const page = await newPage(ctx);
let dialogMode = "accept";
let lastDialog = "";
page.on("dialog", (d) => {
  lastDialog = d.message();
  dialogMode === "accept" ? d.accept() : d.dismiss();
});

/* ---------------- public side ---------------- */
try {
  await page.goto(B + "/");
  ok("Home loads", (await page.title()).includes("Jammu"));
  ok("Hero loads first photos only (fast start)", (await page.locator("section").first().locator("img").count()) === 2);
  // carousel arrows
  const before = await page.locator("[aria-roledescription=carousel] p.font-medium").textContent();
  await page.click("button[aria-label='Next banner']");
  await page.waitForTimeout(900);
  const after = await page.locator("[aria-roledescription=carousel] p.font-medium").textContent();
  ok("Campaign carousel next button", before !== after);
  // glance tabs
  await page.click("button[role=tab]:has-text('Education')");
  ok("Glance tab switches", await page.locator("[role=tabpanel] h3:has-text('Education')").isVisible());
  // mega menu
  await page.hover("nav[aria-label=Main] button:has-text('Departments')");
  ok("Departments mega menu opens", await page.locator("text=Open the full department directory").isVisible());
  await page.hover("nav[aria-label=Main] button:has-text('About JK')");
  ok("About JK menu has Kashmir Cause", await page.locator("header a:has-text('The Kashmir Cause')").isVisible());
  // video modal
  await page.click("button[aria-label^='Play video']");
  ok("Video opens in pop-up", await page.locator("iframe[src*='youtube-nocookie']").isVisible());
  await page.keyboard.press("Escape");
  ok("Video closes with Escape", (await page.locator("iframe[src*='youtube-nocookie']").count()) === 0);
  // footer
  ok("Footer flags", (await page.locator("footer img[alt='Flag of Pakistan']").count()) === 1 && (await page.locator("footer img[alt='Flag of Azad Jammu and Kashmir']").count()) === 1);
  const datix = page.locator("footer a:has-text('Datix AI')");
  ok("Datix AI link", (await datix.getAttribute("href")) === "https://datixai.com" && (await datix.getAttribute("target")) === "_blank");

  // news search, filter, pagination, article
  await page.goto(B + "/news");
  const n1 = await page.locator("main li").count();
  ok("News list page 1", n1 === 12, `${n1} items`);
  await page.click("nav[aria-label=Pagination] a:has-text('2')");
  await page.waitForURL(/page=2/);
  ok("News pagination", (await page.locator("main li").count()) > 0);
  await page.goto(B + "/news");
  await page.fill("input[name=q]", "cabinet");
  await page.press("input[name=q]", "Enter");
  await page.waitForURL(/q=cabinet/);
  const nq = await page.locator("main ul li").count();
  ok("News search", nq > 0 && nq < 72, `${nq} results`);
  await page.goto(B + "/news?year=2025");
  ok("News year filter", (await page.locator("main ul li").count()) === 3);
  await page.locator("main ul li a").first().click();
  await page.waitForURL(/\/news\/.+/);
  ok("News article opens", await page.locator("h1").isVisible());
  ok("Share buttons on article", (await page.locator("text=Copy link").count()) === 1);

  // directories
  await page.goto(B + "/departments");
  await page.fill("input[aria-label='Search departments']", "court");
  ok("Department search", (await page.locator("main ul li").count()) === 2);
  await page.goto(B + "/helplines");
  await page.click("button:has-text('Hospitals')");
  ok("Helplines tab switch", await page.locator("h2:has-text('District Headquarters Hospitals')").isVisible());
  await page.fill("input[aria-label^='Search by district']", "Kotli");
  ok("Helplines search", (await page.locator("main ul li").count()) >= 10);
  ok("Tap-to-call links", (await page.locator("a[href^='tel:']").count()) > 0);

  // search
  await page.goto(B + "/search?q=Kotli");
  ok("Site search", (await page.locator("text=results for").count()) === 1);

  // pages
  for (const p of ["/about", "/kashmir-cause", "/ajk-map", "/videos", "/contact"]) {
    const r = await page.goto(B + p);
    ok(`Page ${p}`, r.status() === 200);
  }
  const r404 = await page.goto(B + "/no-such-page");
  ok("404 page", r404.status() === 404 && (await page.locator("text=Page not found").waitFor({ timeout: 8000 }).then(() => true).catch(() => false)));
  const rOld = await page.goto(B + "/kashmir-conflict");
  ok("Old /kashmir-conflict redirects", page.url().endsWith("/kashmir-cause"));

  // contact form validation + submit
  await page.goto(B + "/contact");
  await page.fill("input[name=name]", "Test Citizen");
  await page.fill("textarea[name=message]", "Test message from the automated check.");
  await page.click("form button");
  ok("Contact needs email or phone", await page.locator("text=Please give an email address or phone number").waitFor({ timeout: 5000 }).then(() => true).catch(() => false));
  await page.fill("input[name=name]", "Test Citizen");
  await page.fill("input[name=email]", "citizen@example.com");
  await page.fill("input[name=subject]", "ZZTEST subject");
  await page.fill("textarea[name=message]", "Test message from the automated check.");
  await page.click("form button");
  ok("Contact form sends", await page.locator("text=Your message has been received").waitFor({ timeout: 8000 }).then(() => true).catch(() => false));
} catch (e) {
  ok("Public side crashed", false, e.message.split("\n")[0]);
}

/* ---------------- mobile ---------------- */
try {
  const m = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const mp = await newPage(m);
  await mp.goto(B + "/");
  const sw = await mp.evaluate(() => document.documentElement.scrollWidth);
  ok("Mobile: no sideways scroll", sw <= 375, `width ${sw}`);
  await mp.click("button[aria-label='Open menu']");
  ok("Mobile menu opens", await mp.locator("[role=dialog][aria-label=Menu]").isVisible());
  await mp.click("[role=dialog] a:has-text('News & Updates')");
  await mp.waitForURL(/\/news/);
  ok("Mobile menu navigates", true);
  for (const p of ["/about", "/helplines", "/departments", "/contact", "/admin/login"]) {
    await mp.goto(B + p);
    const w = await mp.evaluate(() => document.documentElement.scrollWidth);
    ok(`Mobile ${p} fits`, w <= 375, `width ${w}`);
  }
  await m.close();
} catch (e) {
  ok("Mobile crashed", false, e.message.split("\n")[0]);
}

/* ---------------- admin: access control ---------------- */
try {
  const anon = await browser.newContext();
  const ap = await newPage(anon);
  await ap.goto(B + "/admin/settings");
  ok("Admin blocked when signed out", ap.url().includes("/admin/login"));
  await anon.addCookies([{ name: "ajk_session", value: "eyJ1aWQiOiJ4IiwidiI6MCwiZXhwIjo5OTk5OTk5OTk5OTk5fQ.forged", url: B }]);
  await ap.goto(B + "/admin/users");
  ok("Forged session cookie rejected", ap.url().includes("/admin/login"));
  await anon.close();
} catch (e) {
  ok("Access control crashed", false, e.message.split("\n")[0]);
}

/* ---------------- admin: CRUD for every section ---------------- */
await login(page, ADMIN.email, ADMIN.password);
ok("Admin sign in", true);
const cols = ["news", "videos", "pages", "hero", "leaders", "slides", "glance", "stats", "timeline", "days", "departments", "helplines"];
for (const c of cols) {
  const tag = `ZZTEST ${c} ${Date.now()}`;
  try {
    await page.goto(`${B}/admin/c/${c}/new`);
    const fields = await page.locator("form input, form textarea, form select").all();
    let first = true;
    for (const el of fields) {
      const name = await el.getAttribute("name");
      const type = (await el.getAttribute("type")) || (await el.evaluate((e) => e.tagName.toLowerCase()));
      if (!name || name.startsWith("$") || type === "checkbox" || type === "file") continue;
      if (type === "hidden") {
        if (name !== "slug") await el.evaluate((e) => (e.value = "/images/site/seal.png"));
        continue;
      }
      if (name === "slug") {
        if (c === "pages") await el.fill(`zztest-page-${Date.now()}`);
        continue;
      }
      if (type === "select") {
        await el.selectOption({ index: 1 });
        continue;
      }
      if (type === "date") { await el.fill("2026-10-20"); continue; }
      if (type === "url") { await el.fill("https://example.gov.pk/"); continue; }
      if (name === "url") { await el.fill("https://www.youtube.com/watch?v=FbvmV-6gFpI"); continue; }
      if (first && type === "text" && name !== "year") { await el.fill(tag); first = false; continue; }
      if (name === "year") { await el.fill("1999"); continue; }
      await el.fill(`Test value for ${name}`);
    }
    await page.click("form button:has-text('Save')");
    await page.waitForURL(/saved=1/, { timeout: 15000 });
    await page.goto(`${B}/admin/c/${c}?q=${encodeURIComponent(tag)}`);
    await page.click(`a:has-text("${tag}")`);
    await page.waitForURL(new RegExp(`/admin/c/${c}/[^?]+$`), { timeout: 20000 });
    await page.locator(`form input[value="${tag}"]`).fill(tag + " EDITED");
    await page.click("form button:has-text('Save')");
    await page.waitForURL(/saved=1/, { timeout: 15000 });
    await page.goto(`${B}/admin/c/${c}?q=${encodeURIComponent(tag + " EDITED")}`);
    const row = page.locator("li", { hasText: tag + " EDITED" });
    const found = (await row.count()) === 1;
        await row.locator("button.text-red-600").click();
    await page.waitForURL(/deleted=1/, { timeout: 15000 });
    ok(`Admin ${c}: create, edit, delete`, found);
  } catch (e) {
    const err = await page.locator("[role=alert], .text-red-600").allTextContents().catch(() => []);
    ok(`Admin ${c}: create, edit, delete`, false, `${e.message.split("\n")[0]} ${err.join(" | ")}`);
  }
}

/* validation */
try {
  await page.goto(`${B}/admin/c/videos/new`);
  await page.fill("input[name=title]", "Bad link test");
  await page.fill("input[name=url]", "https://example.com/not-youtube");
  await page.click("form button:has-text('Save')");
  ok("Rejects a non-YouTube link", await page.locator("text=This is not a valid YouTube link").waitFor({ timeout: 8000 }).then(() => true).catch(() => false));
  ok("Keeps typed values after an error", (await page.inputValue("input[name=title]")) === "Bad link test");
} catch (e) {
  ok("Validation crashed", false, e.message.split("\n")[0]);
}

/* draft news is hidden from the public */
try {
  await page.goto(`${B}/admin/c/news/new`);
  await page.fill("input[name=title]", "ZZTEST draft story");
  await page.fill("textarea[name=body]", "Draft body");
  await page.uncheck("input[name=published]");
  await page.click("form button:has-text('Save')");
  await page.waitForURL(/saved=1/);
  const pub = await browser.newContext();
  const pp = await pub.newPage();
  const r = await pp.goto(`${B}/news/zztest-draft-story`);
  ok("Draft story hidden from public", r.status() === 404);
  await pub.close();
  await page.goto(`${B}/admin/c/news?q=ZZTEST%20draft`);
    await page.locator("li", { hasText: "ZZTEST draft story" }).locator("button.text-red-600").click();
  await page.waitForURL(/deleted=1/);
} catch (e) {
  ok("Draft test crashed", false, e.message.split("\n")[0]);
}

/* reorder */
try {
  await page.goto(`${B}/admin/c/hero`);
  const firstBefore = await page.locator("main li a.min-w-0").first().textContent();
  await page.locator("main li").first().locator("button[aria-label='Move down']").click();
  await page.waitForTimeout(1500);
  await page.reload();
  const firstAfter = await page.locator("main li a.min-w-0").first().textContent();
  ok("Reorder items", firstBefore !== firstAfter);
  await page.locator("main li").nth(1).locator("button[aria-label='Move up']").click();
  await page.waitForTimeout(1500);
} catch (e) {
  ok("Reorder crashed", false, e.message.split("\n")[0]);
}

/* settings */
try {
  await page.goto(`${B}/admin/settings`);
  const original = await page.inputValue("input[name=footerNote]");
  await page.fill("input[name=footerNote]", "ZZTEST footer note");
  await page.click("form button:has-text('Save settings')");
  await page.locator("text=Settings saved.").waitFor({ timeout: 8000 });
  const pub = await browser.newContext();
  const pp = await pub.newPage();
  await pp.goto(B + "/");
  ok("Settings change shows on public site", (await pp.locator("footer:has-text('ZZTEST footer note')").count()) === 1);
  await pub.close();
  await page.fill("input[name=footerNote]", original);
  await page.click("form button:has-text('Save settings')");
  await page.locator("text=Settings saved.").waitFor({ timeout: 8000 });
} catch (e) {
  ok("Settings crashed", false, e.message.split("\n")[0]);
}

/* media */
try {
  await page.goto(`${B}/admin/media`);
  fs.writeFileSync("tests/fake.jpg", "<script>alert(1)</script>");
  await page.setInputFiles("input[type=file]", ["public/images/site/tourism.jpg", "tests/fake.jpg"]);
  await page.locator("text=1 file uploaded.").waitFor({ timeout: 15000 });
  ok("Upload a real photo", true);
  ok("Fake image rejected and reported", await page.locator("text=Not uploaded: fake.jpg").isVisible());
  await page.reload();
  // use it in a slide, then try to delete
  const url = await page.locator("main ul li a").first().getAttribute("href");
  const r = await page.request.get(B + url);
  ok("Uploaded file is served", r.status() === 200 && r.headers()["content-type"] === "image/jpeg");
    await page.locator("main ul li").first().locator("button:has-text('Delete')").click();
  await page.locator("text=File deleted.").waitFor({ timeout: 8000 });
  ok("Delete uploaded file", (await page.request.get(B + url)).status() === 404);
  // image upload from an editor form
  await page.goto(`${B}/admin/c/slides/new`);
  await page.fill("input[name=title]", "ZZTEST upload in form");
  await page.setInputFiles("form input[type=file]", "public/images/site/tourism.jpg");
  for (let t = 0; t < 30 && !(await page.locator("input[type=hidden][name=image]").inputValue()).startsWith("/media/"); t++) await page.waitForTimeout(500);
  if (!(await page.locator("input[type=hidden][name=image]").inputValue()).startsWith("/media/")) throw new Error("upload in form did not finish");
  ok("Upload from inside an edit form", true);
  await page.click("form button:has-text('Save')");
  await page.waitForURL(/saved=1/);
  await page.goto(`${B}/admin/media`);
  dialogMode = "dismiss";
  await page.locator("main ul li").first().locator("button:has-text('Delete')").click();
  await page.waitForTimeout(1500);
  dialogMode = "accept";
  ok("Warns before deleting a file in use", lastDialog.includes("used"));
  await page.goto(`${B}/admin/c/slides?q=ZZTEST`);
    await page.locator("li", { hasText: "ZZTEST upload in form" }).locator("button.text-red-600").click();
  await page.waitForURL(/deleted=1/);
  await page.goto(`${B}/admin/media`);
    await page.locator("main ul li").first().locator("button:has-text('Delete')").click();
  await page.locator("text=File deleted.").waitFor({ timeout: 8000 });
} catch (e) {
  ok("Media crashed", false, e.message.split("\n")[0]);
}

/* messages */
try {
  await page.goto(`${B}/admin/messages`);
  const msg = page.locator("article", { hasText: "ZZTEST subject" });
  ok("Contact message arrives in admin", (await msg.count()) === 1);
  ok("New message badge", (await msg.locator("text=New").count()) === 1);
  await msg.locator("button:has-text('Mark as read')").click();
  await page.waitForTimeout(1500);
  ok("Mark message as read", (await page.locator("article", { hasText: "ZZTEST subject" }).locator("button:has-text('Mark as unread')").count()) === 1);
    await page.locator("article", { hasText: "ZZTEST subject" }).locator("button.text-red-600").click();
  await page.waitForTimeout(1500);
  ok("Delete message", (await page.locator("article", { hasText: "ZZTEST subject" }).count()) === 0);
} catch (e) {
  ok("Messages crashed", false, e.message.split("\n")[0]);
}

/* users and roles */
const EDITOR = { email: "zztest.editor@ajk.local", password: "Editor#Test2026" };
try {
  await page.goto(`${B}/admin/users`);
  await page.fill("form input[name=name]", "Test Editor");
  await page.fill("form input[name=email]", EDITOR.email);
  await page.fill("form input[name=password]", "weakpassword");
  await page.click("form button:has-text('Add user')");
  ok("Weak password rejected", await page.locator("text=Use at least three of").waitFor({ timeout: 8000 }).then(() => true).catch(() => false));
  await page.fill("form input[name=name]", "Test Editor");
  await page.fill("form input[name=email]", EDITOR.email);
  await page.fill("form input[name=password]", EDITOR.password);
  await page.click("form button:has-text('Add user')");
  await page.locator("text=Test Editor can now sign in").waitFor({ timeout: 8000 });
  ok("Add editor", true);
  const ectx = await browser.newContext();
  const ep = await newPage(ectx);
  await login(ep, EDITOR.email, EDITOR.password);
  ok("Editor can sign in", true);
  ok("Editor has no Users menu", (await ep.locator("a[href='/admin/users']").count()) === 0);
  await ep.goto(`${B}/admin/users`);
  ok("Editor blocked from Users page", ep.url().includes("denied=1"));
  await ep.goto(`${B}/admin/c/news/new`);
  ok("Editor can open content editor", await ep.locator("form button:has-text('Save')").isVisible());
  await page.reload();
    await page.locator("li", { hasText: EDITOR.email }).locator("button:has-text('Remove')").click();
  await page.waitForTimeout(1500);
  await ep.goto(`${B}/admin`);
  ok("Removed user is signed out at once", ep.url().includes("/admin/login"));
  await ectx.close();
} catch (e) {
  ok("Users crashed", false, e.message.split("\n")[0]);
}

/* password change ends other sessions */
try {
  const other = await browser.newContext();
  const op = await newPage(other);
  await login(op, ADMIN.email, ADMIN.password);
  const NEWPW = "Temp#Pass2026x";
  await page.goto(`${B}/admin/account`);
  await page.fill("input[name=current]", ADMIN.password);
  await page.fill("input[name=next]", NEWPW);
  await page.click("form button:has-text('Change password')");
  await page.locator("text=Password changed.").waitFor({ timeout: 8000 });
  ok("Change password", true);
  await op.goto(`${B}/admin`);
  ok("Other devices signed out after password change", op.url().includes("/admin/login"));
  await page.goto(`${B}/admin`);
  ok("This device stays signed in", page.url().endsWith("/admin"));
  // change back
  await page.goto(`${B}/admin/account`);
  await page.fill("input[name=current]", NEWPW);
  await page.fill("input[name=next]", ADMIN.password);
  await page.click("form button:has-text('Change password')");
  await page.locator("text=Password changed.").waitFor({ timeout: 8000 });
  await other.close();
} catch (e) {
  ok("Password crashed", false, e.message.split("\n")[0]);
}

/* two-factor login */
try {
  await page.goto(`${B}/admin/account`);
  await page.click("button:has-text('Set up two-factor login')");
  const secret = (await page.locator("p.font-mono").textContent()).replace(/\s/g, "");
  await page.fill("input[name=code]", "000000");
  await page.click("form button:has-text('Turn on')");
  ok("Wrong 2FA code rejected", await page.locator("text=That code is not correct").waitFor({ timeout: 8000 }).then(() => true).catch(() => false));
  await page.fill("input[name=code]", totp(secret));
  await page.click("form button:has-text('Turn on')");
  await page.locator("text=Two-factor login is on").first().waitFor({ timeout: 8000 });
  ok("Turn on 2FA", true);
  const c2 = await browser.newContext();
  const p2 = await newPage(c2);
  await p2.goto(B + "/admin/login");
  await p2.fill("input[name=email]", ADMIN.email);
  await p2.fill("input[name=password]", ADMIN.password);
  await p2.click("form button");
  await p2.waitForSelector("input[name=code]");
  ok("Login asks for authenticator code", true);
  await p2.fill("input[name=code]", "123456");
  await p2.click("form button");
  ok("Wrong login code rejected", await p2.locator("text=That code is not correct").waitFor({ timeout: 8000 }).then(() => true).catch(() => false));
  await p2.fill("input[name=code]", totp(secret));
  await p2.click("form button");
  await p2.waitForURL(/\/admin$/, { timeout: 10000 });
  ok("Login with correct code", true);
  await c2.close();
  // turn off again so the demo account stays simple
  await page.goto(`${B}/admin/account`);
  await page.fill("input[name=code]", totp(secret));
  await page.click("form button:has-text('Turn off')");
  await page.locator("text=Two-factor login is off").waitFor({ timeout: 8000 });
  ok("Turn off 2FA", true);
} catch (e) {
  ok("2FA crashed", false, e.message.split("\n")[0]);
}

/* audit log */
try {
  await page.goto(`${B}/admin/audit`);
  const txt = await page.locator("table").textContent();
  ok("Activity log records actions", ["Signed in", "Created", "Deleted", "Changed password", "Turned on two-factor login", "Failed"].every((t) => txt.includes(t)));
} catch (e) {
  ok("Audit crashed", false, e.message.split("\n")[0]);
}

/* sign out everywhere */
try {
  await page.goto(`${B}/admin/account`);
  await page.click("button:has-text('Sign out everywhere')");
  await page.waitForURL(/\/admin\/login/);
  ok("Sign out everywhere", true);
} catch (e) {
  ok("Sign out crashed", false, e.message.split("\n")[0]);
}

await browser.close();
const errs = consoleErrors.filter((e) => !/favicon|youtube|ytimg|ERR_BLOCKED_BY_CLIENT|401|403|404 \(Not Found\)/.test(e));
console.log("\nCONSOLE ERRORS:", errs.length ? "\n" + [...new Set(errs)].join("\n") : "none");
const failed = results.filter((r) => r.startsWith("FAIL"));
console.log(`\n${results.length - failed.length} passed, ${failed.length} failed`);
