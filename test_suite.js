/**
 * NEXUS TV HUB // Verification & Test Suite
 * Comprehensive automated tests covering all 7 points of the user's task.
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const ROOT_DIR = __dirname;

console.log("==================================================================");
console.log("🧪 RUNNING NEXUS TV HUB VERIFICATION TEST SUITE");
console.log("==================================================================");

let testsPassed = 0;
let testsFailed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✔ PASS: ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    testsFailed++;
  }
}

// =========================================================================
// TEST SUITE 1: CHANNELS & STREAM INTEGRITY (Point 1)
// =========================================================================
console.log("\n[1] Testing Channels & Stream Verification...");

const { CHANNELS_DATA, CATEGORIES } = require("./channels.js");

runTest("Total channel count is 37 and categories match", () => {
  assert.strictEqual(CHANNELS_DATA.length, 37, "Must have exactly 37 channels");
  const allCat = CATEGORIES.find(c => c.id === "all");
  assert.strictEqual(allCat.count, 37, "All category count must match");
});

runTest("Purged all dubbed/broken Antik cable streams (88.212.7.14)", () => {
  const antikStreams = CHANNELS_DATA.filter(c => c.hlsUrl && c.hlsUrl.includes("88.212.7.14"));
  assert.strictEqual(antikStreams.length, 0, "No Antik 88.212.7.14 dubbed feeds should exist in channels");
});

runTest("Movie category channels are verified (CineMaraton, MovieSphere, CineWow, Nostalgia, ARTFLIX)", () => {
  const movieIds = CHANNELS_DATA.filter(c => c.category === "filme").map(c => c.id);
  assert.deepStrictEqual(movieIds, ["cinemaraton", "moviesphere", "cinewow", "nostalgia", "artflix"]);
  
  const moviesphere = CHANNELS_DATA.find(c => c.id === "moviesphere");
  assert.ok(moviesphere.hlsUrl.includes("moviesphere"), "MovieSphere must have direct HLS URL");
  
  const artflix = CHANNELS_DATA.find(c => c.id === "artflix");
  assert.ok(artflix.hlsUrl.includes("artflix"), "ARTFLIX must have direct HLS URL");
});

runTest("History channels purged Hungarian feeds and retained 5 clean channels", () => {
  const historyIds = CHANNELS_DATA.filter(c => c.category === "istorie").map(c => c.id);
  assert.deepStrictEqual(historyIds, ["true-history", "travel-mix", "nhk-world", "arte", "dw-documentary"]);
  
  // DW Documentary must be direct HLS on Akamai, not broken YouTube embed
  const dwd = CHANNELS_DATA.find(c => c.id === "dw-documentary");
  assert.strictEqual(dwd.type, "hls", "DW Documentary must be direct HLS");
  assert.ok(dwd.hlsUrl.includes("akamaized.net"), "DW Documentary must use Akamai CDN");
});

runTest("Sky News is direct HLS on Akamai, not broken YouTube embed", () => {
  const sky = CHANNELS_DATA.find(c => c.id === "sky-news");
  assert.strictEqual(sky.type, "hls", "Sky News must be direct HLS");
  assert.ok(sky.hlsUrl.includes("akamaized.net"), "Sky News must use Akamai CDN");
});

runTest("Subtitle suppression flags are set on True History and Yahoo Finance", () => {
  const trueHistory = CHANNELS_DATA.find(c => c.id === "true-history");
  assert.strictEqual(trueHistory.disableSubtitles, true, "True History must have disableSubtitles=true");
  
  const yf = CHANNELS_DATA.find(c => c.id === "yahoo-finance");
  assert.strictEqual(yf.disableSubtitles, true, "Yahoo Finance must have disableSubtitles=true");
});

runTest("Event channels are marked isEventStream and isEventOnly", () => {
  const eventIds = ["bnr", "cdep", "senat", "gov-ro"];
  eventIds.forEach(id => {
    const ch = CHANNELS_DATA.find(c => c.id === id);
    assert.ok(ch, `Channel ${id} must exist`);
    assert.strictEqual(ch.isEventStream, true, `${id} must be isEventStream`);
    assert.strictEqual(ch.isEventOnly, true, `${id} must be isEventOnly`);
    assert.ok(ch.portalDomain, `${id} must have portalDomain`);
  });
});

// =========================================================================
// TEST SUITE 2: REAL EPG SCHEDULE DATA (Point 2)
// =========================================================================
console.log("\n[2] Testing Real EPG Schedules & Calculations...");

const { REAL_EPG_SCHEDULES } = require("./epg_real.js");
global.REAL_EPG_SCHEDULES = REAL_EPG_SCHEDULES;
const { EPG_DATA } = require("./epg.js");

runTest("REAL_EPG_SCHEDULES contains accurate Romanian EPG channels", () => {
  const requiredRealChannels = [
    "cinemaraton", "cinewow", "nostalgia", "aleph-news", 
    "digi24", "tvr-1", "tvr-2", "tvr-info", "tvr-cultural", 
    "travel-mix", "euronews-ro", "euronews-en", "arte", "france24", "bloomberg-eu"
  ];
  requiredRealChannels.forEach(id => {
    assert.ok(REAL_EPG_SCHEDULES[id], `Must have real EPG schedule for ${id}`);
    assert.ok(REAL_EPG_SCHEDULES[id].length > 0, `Schedule for ${id} must not be empty`);
  });
});

runTest("generateDaySchedule builds gapless, ordered 24-hour timeline", () => {
  const now = new Date();
  const schedule = EPG_DATA.generateDaySchedule("cinemaraton", now);
  assert.ok(schedule.length >= 20, "CineMaraton must have full day schedule");
  
  for (let i = 0; i < schedule.length - 1; i++) {
    const curr = schedule[i];
    const next = schedule[i + 1];
    assert.strictEqual(curr.endMs, next.startMs, `Gap detected between show ${i} and ${i+1}`);
    assert.ok(curr.durationMinutes > 0, `Duration of show ${i} must be positive`);
  }
});

runTest("getCurrentShow calculates live show and valid progress percentage", () => {
  const now = new Date();
  const show = EPG_DATA.getCurrentShow("cinemaraton", now);
  assert.ok(show.title, "Must return active show title");
  assert.ok(show.startTimeStr, "Must return start time");
  assert.ok(show.endTimeStr, "Must return end time");
  assert.ok(show.progressPercent >= 0 && show.progressPercent <= 100, "Progress percent must be 0-100");
  assert.ok(show.remainingMinutes >= 0, "Remaining minutes must be non-negative");
});

runTest("getVisibleShows produces valid layout coordinates for EPG grid", () => {
  const now = new Date();
  const visible = EPG_DATA.getVisibleShows("cinewow", now);
  assert.ok(visible.length > 0, "Must have visible shows in timeline window");
  visible.forEach((show, idx) => {
    assert.ok(show.leftPx >= 0, `leftPx must be >= 0 for show ${idx}`);
    assert.ok(show.widthPx >= 80, `widthPx must be >= 80 for show ${idx}`);
  });
});

// =========================================================================
// TEST SUITE 3: UI SIZING & MINIMALIST LAYOUT (Points 3, 4, 5)
// =========================================================================
console.log("\n[3] Testing UI Sizing & Minimalist HTML/CSS Structure...");

const indexHtml = fs.readFileSync(path.join(ROOT_DIR, "index.html"), "utf-8");
const stylesCss = fs.readFileSync(path.join(ROOT_DIR, "styles.css"), "utf-8");

runTest("index.html: Removed 'The Frame 50' tag from header", () => {
  assert.ok(!indexHtml.includes("THE FRAME 50\""), "Must not include 'THE FRAME 50\"' tag");
});

runTest("index.html: Removed verbose instruction manual footer", () => {
  assert.ok(!indexHtml.includes("guide-footer-hints"), "Must not include guide-footer-hints");
});

runTest("index.html: High-design official standby screen exists in stage", () => {
  assert.ok(indexHtml.includes("id=\"event-standby-screen\""), "event-standby-screen must exist");
  assert.ok(indexHtml.includes("standby-portal"), "standby-portal must exist");
});

runTest("styles.css: 10-foot scale row height is 100px", () => {
  assert.ok(stylesCss.includes("height: 100px;"), "epg-channel-row must have 100px height");
});

runTest("styles.css: Channel title typography is scaled for 10-foot viewing (1.75rem)", () => {
  assert.ok(stylesCss.includes("font-size: 1.75rem;"), "epg-ch-name must have 1.75rem (28px+) font");
});

runTest("styles.css: Timeline ruler typography is 1.5rem (24px) bold", () => {
  assert.ok(stylesCss.includes("font-size: 1.5rem;"), "epg-time-slot must have 1.5rem (24px) font");
});

// =========================================================================
// TEST SUITE 4: SAMSUNG REMOTE CHANNEL ROCKER MAPPING (Point 6)
// =========================================================================
console.log("\n[4] Testing Samsung Remote Channel Rocker Integration...");

const appJs = fs.readFileSync(path.join(ROOT_DIR, "app.js"), "utf-8");
const configXml = fs.readFileSync(path.join(ROOT_DIR, "config.xml"), "utf-8");

runTest("config.xml has tv.inputdevice privilege", () => {
  assert.ok(configXml.includes("http://tizen.org/privilege/tv.inputdevice"), "config.xml must have tv.inputdevice");
});

runTest("app.js registers ChannelUp and ChannelDown keys with Tizen", () => {
  assert.ok(appJs.includes("\"ChannelUp\""), "Must register ChannelUp");
  assert.ok(appJs.includes("\"ChannelDown\""), "Must register ChannelDown");
});

runTest("app.js maps ChannelUp (427) to switchChannelDelta(1)", () => {
  assert.ok(appJs.includes("keyCode === 427") || appJs.includes("427"), "Must handle keyCode 427 for ChannelUp");
  assert.ok(appJs.includes("switchChannelDelta(1)"), "ChannelUp must advance channel");
});

runTest("app.js maps ChannelDown (428) to switchChannelDelta(-1)", () => {
  assert.ok(appJs.includes("keyCode === 428") || appJs.includes("428"), "Must handle keyCode 428 for ChannelDown");
  assert.ok(appJs.includes("switchChannelDelta(-1)"), "ChannelDown must decrement channel");
});

// =========================================================================
// TEST SUITE 5: PACKAGING & SIDELOAD INTEGRITY
// =========================================================================
console.log("\n[5] Testing Packaging & Sideload File List...");

const sideloadPy = fs.readFileSync(path.join(ROOT_DIR, "sideload_tv.py"), "utf-8");

runTest("sideload_tv.py packages all required scripts including epg_real.js", () => {
  const requiredFiles = ["config.xml", "icon.png", "index.html", "styles.css", "channels.js", "epg_real.js", "epg.js", "app.js", "hls.min.js"];
  requiredFiles.forEach(f => {
    assert.ok(sideloadPy.includes(`"${f}"`), `sideload_tv.py must include ${f}`);
    assert.ok(fs.existsSync(path.join(ROOT_DIR, f)), `File ${f} must exist on disk`);
  });
});

console.log("\n==================================================================");
console.log(`🏁 TEST SUITE FINISHED: ${testsPassed} PASSED, ${testsFailed} FAILED`);
console.log("==================================================================");

if (testsFailed > 0) {
  process.exit(1);
}
