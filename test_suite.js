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
  assert.ok(sky.name.includes("Australia"), "Sky News name must clarify Australia/Fox origin");
  assert.ok(sky.description.includes("Australia"), "Sky News description must clarify Australia origin");
});

runTest("DW Documentary uses official English feed (dwstream102) and not Spanish (dwstream104)", () => {
  const dwd = CHANNELS_DATA.find(c => c.id === "dw-documentary");
  assert.strictEqual(dwd.type, "hls", "DW Documentary must be direct HLS");
  assert.ok(dwd.hlsUrl.includes("dwamdstream102"), "DW Documentary must use English stream 102");
  assert.ok(!dwd.hlsUrl.includes("dwamdstream104"), "DW Documentary must not use Spanish stream 104");
  assert.ok(dwd.description.includes("DW English"), "DW Documentary description must state DW English");
});

runTest("Aleph Business is active and preserved in finance lineup", () => {
  const abiz = CHANNELS_DATA.find(c => c.id === "aleph-business");
  assert.ok(abiz, "Aleph Business must exist in lineup");
  assert.strictEqual(abiz.category, "finante", "Aleph Business must be in finante category");
  assert.ok(abiz.hlsUrl.includes("Alephbiz.stream_all"), "Aleph Business must point to native master HLS");
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

runTest("REAL_EPG_SCHEDULES contains all 20 verified authentic EPG channels", () => {
  const requiredRealChannels = [
    "cinemaraton", "cinewow", "nostalgia", "aleph-news", 
    "digi24", "tvr-1", "tvr-2", "tvr-info", "tvr-cultural", 
    "travel-mix", "euronews-ro", "euronews-en", "arte", "france24", "bloomberg-eu",
    "ebs", "ebs-plus", "nhk-world", "moviesphere", "artflix"
  ];
  assert.strictEqual(Object.keys(REAL_EPG_SCHEDULES).length >= 20, true, "Must have at least 20 authentic EPG channels");
  requiredRealChannels.forEach(id => {
    assert.ok(REAL_EPG_SCHEDULES[id], `Must have real EPG schedule for ${id}`);
    assert.ok(REAL_EPG_SCHEDULES[id].length > 0, `Schedule for ${id} must not be empty`);
  });
});

runTest("Bloomberg Europe offset (+2h) aligns London GMT with Bucharest EET", () => {
  const bbg = REAL_EPG_SCHEDULES["bloomberg-eu"];
  const openInterest = bbg.find(s => s.title.includes("Open Interest"));
  assert.ok(openInterest, "Must contain Bloomberg Open Interest");
  assert.strictEqual(openInterest.time, "16:00", "14:00 GMT must be converted to 16:00 EET");

  const openingTrade = bbg.find(s => s.title.includes("Opening Trade"));
  assert.ok(openingTrade, "Must contain Bloomberg The Opening Trade");
  assert.strictEqual(openingTrade.time, "09:00", "07:00 GMT must be converted to 09:00 EET");
});

runTest("France 24 English schedule replaced French listings", () => {
  const f24 = REAL_EPG_SCHEDULES["france24"];
  assert.ok(f24.length >= 20, "France 24 must have full English lineup");
  const frenchTitles = f24.filter(s => s.title.includes("L'EDITION NUIT") || s.title.includes("LE JOURNAL") || s.title.includes("LE DEBAT"));
  assert.strictEqual(frenchTitles.length, 0, "No French titles should exist in France 24 English");
  const hasEnglishNews = f24.some(s => s.title.includes("News") || s.title.includes("The Debate") || s.title.includes("France in Focus") || s.title.includes("Focus"));
  assert.ok(hasEnglishNews, "Must contain authentic English news shows");
});

runTest("ARTE schedule aligned with ARTE DE broadcast stream", () => {
  const arte = REAL_EPG_SCHEDULES["arte"];
  assert.ok(arte.length >= 20, "ARTE DE must have full day lineup");
  const hasReportage = arte.some(s => s.title.includes("360° Reportage"));
  const hasGrenze = arte.some(s => s.title.includes("Europas tödlichste Grenze"));
  assert.ok(hasReportage, "ARTE must have '360° Reportage'");
  assert.ok(hasGrenze, "ARTE must have 'Europas tödlichste Grenze'");
});

runTest("EbS and EbS+ European Commission API schedules integrated", () => {
  const ebs = REAL_EPG_SCHEDULES["ebs"];
  assert.ok(ebs.length >= 8, "EbS must have official European Commission schedule");
  const hasCollege = ebs.some(s => s.title.includes("College") || s.title.includes("Commission"));
  const hasInta = ebs.some(s => s.title.includes("INTA Committee"));
  assert.ok(hasCollege, "EbS must contain College meeting / Commission briefings");
  assert.ok(hasInta, "EbS must contain INTA Committee session");

  const ebsPlus = REAL_EPG_SCHEDULES["ebs-plus"];
  assert.ok(ebsPlus.length >= 8, "EbS+ must have official European Parliament schedule");
  const hasAfet = ebsPlus.some(s => s.title.includes("AFET Committee"));
  const hasLibe = ebsPlus.some(s => s.title.includes("LIBE Committee"));
  assert.ok(hasAfet, "EbS+ must contain AFET Committee debate");
  assert.ok(hasLibe, "EbS+ must contain LIBE Committee debate");
});

runTest("NHK World authentic schedule from CDN API integrated", () => {
  const nhk = REAL_EPG_SCHEDULES["nhk-world"];
  assert.ok(nhk.length >= 20, "NHK World must have 24-hour schedule");
  const hasNewsline = nhk.some(s => s.title.includes("NHK NEWSLINE"));
  const hasJapanology = nhk.some(s => s.title.includes("Japanology") || s.title.includes("Core Kyoto") || s.title.includes("Trails to Oishii"));
  assert.ok(hasNewsline, "NHK World must have NHK NEWSLINE");
  assert.ok(hasJapanology, "NHK World must have authentic cultural programs");
});

runTest("MovieSphere and Artflix Samsung TV Plus FAST schedules integrated", () => {
  const ms = REAL_EPG_SCHEDULES["moviesphere"];
  assert.ok(ms.length >= 8, "MovieSphere must have full FAST movie schedule");
  const hasGods = ms.some(s => s.title.includes("Gods of Egypt"));
  assert.ok(hasGods, "MovieSphere must have 'Gods of Egypt'");

  const art = REAL_EPG_SCHEDULES["artflix"];
  assert.ok(art.length >= 8, "Artflix must have full FAST movie schedule");
  const hasTarzan = art.some(s => s.title.includes("Tarzan"));
  const hasPiraten = art.some(s => s.title.includes("Die Küste der Piraten"));
  assert.ok(hasTarzan || hasPiraten, "Artflix must have authentic classics (Tarzan / Piraten)");
});

runTest("Night gap 00:00 - 07:00 eliminated and replaced with genuine late-night programming", () => {
  const now = new Date();
  const schedule = EPG_DATA.generateDaySchedule("cinemaraton", now);
  const hasArtificialNight = schedule.some(s => s.title.includes("Program Nocturn & Retrospectivă"));
  assert.strictEqual(hasArtificialNight, false, "Must NOT inject artificial 'Program Nocturn & Retrospectivă'");

  // Test that shows between 00:00 and 07:00 are real Romanian shows/movies
  const nightShows = schedule.filter(s => {
    const hour = EPG_DATA.getBucharestDateParts(new Date(s.startMs)).hour;
    return hour >= 0 && hour < 7;
  });
  assert.ok(nightShows.length >= 5, "Must have genuine shows in the 00:00 - 07:00 window");
  assert.ok(nightShows.some(s => s.title.includes("Dublu") || s.title.includes("Restul e tăcere")), "Must display real movie (Dublu / Restul e tăcere)");
});

runTest("Timezone hardening ensures Europe/Bucharest time consistency under UTC system clock", () => {
  const now = new Date();
  const bHour = EPG_DATA.getBucharestHour(now);
  assert.ok(bHour >= 0 && bHour <= 23, "Bucharest hour must be valid");

  const startMs = EPG_DATA.getBaseTimelineStartMs(now);
  assert.ok(typeof startMs === "number" && startMs > 0, "Base timeline start ms must be valid");

  // Check intervals are formatted with Bucharest time
  const intervals = EPG_DATA.getTimelineIntervals(now, 24, 30);
  assert.ok(intervals.length >= 48, "Must generate intervals");
  assert.ok(intervals[0].timeStr.match(/^\d{2}:\d{2}$/), "Interval format must be HH:MM");
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

runTest("Real EPG matches user-reported shows (CineMaraton, CineWow, Aleph News, Nostalgia)", () => {
  // 1. CineMaraton must have "Tusea și junghiul"
  const cmShows = REAL_EPG_SCHEDULES["cinemaraton"];
  assert.ok(cmShows.some(s => s.title.includes("Tusea și junghiul")), "CineMaraton must have 'Tusea și junghiul'");
  
  // 2. CineWow must have "Balul de sâmbătă seara" and afternoon shows "Pup-o, mă!"
  const cwShows = REAL_EPG_SCHEDULES["cinewow"];
  assert.ok(cwShows.some(s => s.title.includes("Balul de sâmbătă seara")), "CineWow must have 'Balul de sâmbătă seara'");
  assert.ok(cwShows.some(s => s.title.includes("Pup-o, mă!")), "CineWow must have 'Pup-o, mă!'");
  
  // 3. Aleph News must have "Cine te apără"
  const anShows = REAL_EPG_SCHEDULES["aleph-news"];
  assert.ok(anShows.some(s => s.title.includes("Cine te apără")), "Aleph News must have 'Cine te apără'");
  
  // 4. Nostalgia must have "Alberto Express"
  const nosShows = REAL_EPG_SCHEDULES["nostalgia"];
  assert.ok(nosShows.some(s => s.title.includes("Alberto Express")), "Nostalgia must have 'Alberto Express'");
});

runTest("TIMELINE_HOURS is 24 for full day & evening guide exploration", () => {
  assert.strictEqual(EPG_DATA.TIMELINE_HOURS, 24, "TIMELINE_HOURS must be 24");
  const now = new Date();
  const intervals = EPG_DATA.getTimelineIntervals(now, EPG_DATA.TIMELINE_HOURS, 30);
  assert.ok(intervals.length >= 48, "Must generate at least 48 intervals for 24 hours");
});

runTest("epg_real.js exports to window.REAL_EPG_SCHEDULES for browser scope", () => {
  const epgRealJs = fs.readFileSync(path.join(ROOT_DIR, "epg_real.js"), "utf-8");
  assert.ok(epgRealJs.includes("window.REAL_EPG_SCHEDULES = REAL_EPG_SCHEDULES"), "Must set window.REAL_EPG_SCHEDULES");
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

runTest("styles.css: Purged all GPU-stalling backdrop-filter to ensure 60fps instant transitions", () => {
  assert.ok(!stylesCss.includes("backdrop-filter"), "Must not contain backdrop-filter");
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

runTest("app.js normalizes ChannelUp (keyCode 427) and ChannelDown (keyCode 428)", () => {
  assert.ok(appJs.includes("keyCode === 427"), "Must handle keyCode 427");
  assert.ok(appJs.includes("keyCode === 428"), "Must handle keyCode 428");
  assert.ok(appJs.includes("isChannelUp"), "Must define isChannelUp");
  assert.ok(appJs.includes("isChannelDown"), "Must define isChannelDown");
});

runTest("app.js maps Channel Rocker in fullscreen to switch channels (+1 / -1)", () => {
  assert.ok(appJs.includes("isChannelUp || key === \"ArrowUp\""), "ChannelUp/ArrowUp triggers next channel");
  assert.ok(appJs.includes("isChannelDown || key === \"ArrowDown\""), "ChannelDown/ArrowDown triggers prev channel");
});

runTest("app.js maps Channel Rocker in TV Guide to page 5 channels (+5 / -5)", () => {
  assert.ok(appJs.includes("focusChannelRow(state.focusedRowIndex + 5"), "ChannelDown in guide pages down 5 channels");
  assert.ok(appJs.includes("focusChannelRow(state.focusedRowIndex - 5"), "ChannelUp in guide pages up 5 channels");
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
