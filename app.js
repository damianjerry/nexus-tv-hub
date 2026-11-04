/**
 * NEXUS TV // Linear Player & Smart TV Guide Engine
 * Engineered for Samsung The Frame (Tizen 6.5)
 * 
 * Fixes Applied:
 * 1. Native HLS for major news channels (Bloomberg, Euronews, France 24, DW, Al Jazeera, CNA, ARTE)
 * 2. Strict Referrer & Origin headers for YouTube embeds (Resolves Error 153)
 * 3. Correct channel zapping arrow polarity: ArrowUp -> Next (+1), ArrowDown -> Previous (-1)
 * 4. Fixed audio auto-mute bug during channel switching
 * 5. High-contrast 10-foot scale typography for 50-inch 4K screen
 */

(function () {
  "use strict";

  // State Management
  const state = {
    activeCategory: "all",
    focusedRowIndex: 0,
    currentChannel: null,
    guideVisible: true,
    isMuted: false,
    volume: 1.0,
    hlsPlayer: null,
    osdTimer: null
  };

  // DOM Cache
  const dom = {
    // Video Stage
    videoStage: document.getElementById("video-stage"),
    hlsVideo: document.getElementById("hls-video"),
    ytCropStage: document.getElementById("yt-crop-stage"),
    ytPlayerTarget: document.getElementById("yt-player-target"),
    webEmbed: document.getElementById("web-embed-container"),
    unmutePrompt: document.getElementById("unmute-prompt"),

    // TV Guide Overlay
    guideOverlay: document.getElementById("guide-overlay"),
    guideClock: document.getElementById("guide-clock"),
    guideDate: document.getElementById("guide-date"),
    guideCategories: document.getElementById("guide-categories"),
    guideChannelsList: document.getElementById("guide-channels-list"),
    btnCloseGuide: document.getElementById("btn-close-guide"),

    // Preview Panel
    prevBadge: document.getElementById("prev-badge"),
    prevName: document.getElementById("prev-name"),
    prevCat: document.getElementById("prev-cat"),
    prevDesc: document.getElementById("prev-desc"),
    prevNum: document.getElementById("prev-num"),
    prevQuality: document.getElementById("prev-quality"),
    prevProtocol: document.getElementById("prev-protocol"),

    // Quick OSD Banner
    osdBanner: document.getElementById("osd-banner"),
    osdNum: document.getElementById("osd-num"),
    osdBadge: document.getElementById("osd-badge"),
    osdName: document.getElementById("osd-name"),
    osdDesc: document.getElementById("osd-desc"),
    osdTag: document.getElementById("osd-tag"),
    osdQuality: document.getElementById("osd-quality"),
    osdClock: document.getElementById("osd-clock")
  };

  // =========================================================================
  // 1. BOOTSTRAP & INITIALIZATION
  // =========================================================================
  function init() {
    registerTizenKeys();
    initClocks();
    renderCategories();
    renderChannelRows();
    setupEventListeners();

    // Start on CH 01 (Bloomberg Television Direct HLS)
    const initialChannel = CHANNELS_DATA[0];
    playChannel(initialChannel, false);

    // Focus first channel row
    focusRow(0);

    console.log("[NEXUS] Initialized successfully. Channels count:", CHANNELS_DATA.length);
  }

  function registerTizenKeys() {
    if (typeof tizen !== "undefined" && tizen.tvinputdevice) {
      const keys = [
        "ColorF0Red",
        "ColorF1Green",
        "ColorF2Yellow",
        "ColorF3Blue",
        "ChannelUp",
        "ChannelDown",
        "MediaPlay",
        "MediaPause",
        "MediaPlayPause",
        "Return",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
      ];
      keys.forEach(k => {
        try {
          tizen.tvinputdevice.registerKey(k);
        } catch (e) {
          // already registered
        }
      });
    }
  }

  function initClocks() {
    function tick() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const dateStr = now.toLocaleDateString("ro-RO", { weekday: "short", day: "numeric", month: "short" });

      if (dom.guideClock) dom.guideClock.textContent = timeStr;
      if (dom.guideDate) dom.guideDate.textContent = dateStr;
      if (dom.osdClock) dom.osdClock.textContent = timeStr;
    }
    tick();
    setInterval(tick, 1000);
  }

  // =========================================================================
  // 2. TV GUIDE RENDERING
  // =========================================================================
  function renderCategories() {
    if (!dom.guideCategories) return;
    dom.guideCategories.innerHTML = "";

    CATEGORIES.forEach((cat, idx) => {
      const btn = document.createElement("button");
      btn.className = `category-row ${state.activeCategory === cat.id ? "active" : ""}`;
      btn.dataset.category = cat.id;
      btn.dataset.index = idx;
      btn.innerHTML = `
        <span>${cat.label}</span>
        <span class="tabular-nums" style="font-size: 0.95rem; opacity: 0.8;">${cat.count}</span>
      `;

      btn.addEventListener("click", () => {
        state.activeCategory = cat.id;
        renderCategories();
        renderChannelRows();
        focusRow(0);
      });

      dom.guideCategories.appendChild(btn);
    });
  }

  function getFilteredChannels() {
    if (state.activeCategory === "all") return CHANNELS_DATA;
    return CHANNELS_DATA.filter(c => c.category === state.activeCategory);
  }

  function renderChannelRows() {
    if (!dom.guideChannelsList) return;
    const channels = getFilteredChannels();
    dom.guideChannelsList.innerHTML = "";

    channels.forEach((ch, idx) => {
      const row = document.createElement("div");
      const isCurrent = state.currentChannel?.id === ch.id;
      row.className = `channel-row ${idx === state.focusedRowIndex ? "focused" : ""} ${isCurrent ? "current-playing" : ""}`;
      row.tabIndex = 0;
      row.dataset.id = ch.id;
      row.dataset.index = idx;

      row.innerHTML = `
        <div class="row-num tabular-nums">${ch.number}</div>
        <div class="row-badge" style="background-color: ${ch.color || '#3b82f6'};">
          ${ch.logoText || ch.name.substring(0, 3).toUpperCase()}
        </div>
        <div class="row-title-box">
          <div class="row-name">${ch.name}</div>
          <div class="row-topic">${ch.description}</div>
        </div>
        <div class="row-tag">${ch.badge}</div>
        <div class="row-quality">
          <span class="row-quality-dot"></span>
          <span class="tabular-nums">${ch.quality}</span>
        </div>
      `;

      row.addEventListener("click", () => {
        focusRow(idx);
        playChannel(ch, true);
        hideGuide();
      });

      row.addEventListener("mouseenter", () => {
        focusRow(idx, false);
      });

      dom.guideChannelsList.appendChild(row);
    });
  }

  function focusRow(index, scroll = true) {
    const rows = dom.guideChannelsList.querySelectorAll(".channel-row");
    if (rows.length === 0) return;

    if (index < 0) index = 0;
    if (index >= rows.length) index = rows.length - 1;

    rows.forEach((r, i) => {
      if (i === index) {
        r.classList.add("focused");
        if (scroll) {
          r.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      } else {
        r.classList.remove("focused");
      }
    });

    state.focusedRowIndex = index;

    const channels = getFilteredChannels();
    const ch = channels[index];
    if (ch) updatePreviewPanel(ch);
  }

  function updatePreviewPanel(ch) {
    if (dom.prevBadge) {
      dom.prevBadge.textContent = ch.logoText || "TV";
      dom.prevBadge.style.backgroundColor = ch.color || "#3b82f6";
    }
    if (dom.prevName) dom.prevName.textContent = ch.name;
    if (dom.prevCat) dom.prevCat.textContent = ch.badge;
    if (dom.prevDesc) dom.prevDesc.textContent = ch.description;
    if (dom.prevNum) dom.prevNum.textContent = `CH ${ch.number}`;
    if (dom.prevQuality) dom.prevQuality.textContent = ch.quality;
    if (dom.prevProtocol) dom.prevProtocol.textContent = ch.type === "hls" ? "HLS Direct CDN" : "YouTube Live Stream";
  }

  // =========================================================================
  // 3. MEDIA STREAM ENGINE (DIRECT HLS & CLEAN YOUTUBE)
  // =========================================================================
  function playChannel(channel, showOsd = true) {
    if (!channel) return;
    state.currentChannel = channel;

    stopCurrentPlayback();

    if (channel.type === "hls") {
      playHls(channel.hlsUrl);
    } else if (channel.type.startsWith("youtube")) {
      playYouTubeClean(channel);
    }

    renderChannelRows();

    if (showOsd) {
      triggerOsdBanner(channel);
    }
  }

  function stopCurrentPlayback() {
    if (state.hlsPlayer) {
      state.hlsPlayer.destroy();
      state.hlsPlayer = null;
    }

    if (dom.hlsVideo) {
      dom.hlsVideo.pause();
      dom.hlsVideo.removeAttribute("src");
      dom.hlsVideo.load();
      dom.hlsVideo.style.display = "none";
    }

    if (dom.ytCropStage) {
      dom.ytCropStage.style.display = "none";
      dom.ytPlayerTarget.innerHTML = "";
    }

    if (dom.webEmbed) {
      dom.webEmbed.src = "about:blank";
      dom.webEmbed.style.display = "none";
    }
  }

  // Native & Hls.js Direct Stream Player (Fixed Mute Bug)
  function playHls(url) {
    dom.hlsVideo.style.display = "block";
    dom.hlsVideo.muted = false; // Always keep unmuted on channel change!
    state.isMuted = false;
    dom.unmutePrompt.style.display = "none";

    if (typeof Hls !== "undefined" && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 45
      });
      state.hlsPlayer = hls;

      hls.loadSource(url);
      hls.attachMedia(dom.hlsVideo);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        dom.hlsVideo.play().catch(err => {
          // Only mute if browser specifically blocked unmuted autoplay (NotAllowedError)
          // NEVER mute on AbortError caused by switching channels!
          if (err.name === "NotAllowedError") {
            dom.hlsVideo.muted = true;
            state.isMuted = true;
            dom.unmutePrompt.style.display = "flex";
            dom.hlsVideo.play().catch(() => {});
          }
        });
      });
    } else if (dom.hlsVideo.canPlayType("application/vnd.apple.mpegurl")) {
      dom.hlsVideo.src = url;
      dom.hlsVideo.addEventListener("loadedmetadata", () => {
        dom.hlsVideo.play().catch(err => {
          if (err.name === "NotAllowedError") {
            dom.hlsVideo.muted = true;
            state.isMuted = true;
            dom.unmutePrompt.style.display = "flex";
            dom.hlsVideo.play().catch(() => {});
          }
        });
      }, { once: true });
    }
  }

  // Clean YouTube Live Player (Fixed Error 153 & Referrer Handshake)
  function playYouTubeClean(channel) {
    dom.ytCropStage.style.display = "block";

    const videoId = channel.youtube?.videoId || "";
    let src = "";

    // YouTube requires origin and host params to prevent Error 153 on Smart TVs
    if (videoId) {
      src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1&disablekb=1&fs=0&origin=https://www.youtube.com&widget_referrer=https://www.youtube.com`;
    } else if (channel.youtube?.channelId) {
      src = `https://www.youtube-nocookie.com/embed/live_stream?channel=${channel.youtube.channelId}&autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&disablekb=1&fs=0&origin=https://www.youtube.com&widget_referrer=https://www.youtube.com`;
    }

    dom.ytPlayerTarget.innerHTML = `
      <iframe 
        src="${src}" 
        title="${channel.name}"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;
  }

  function unlockAudio() {
    if (state.isMuted && dom.hlsVideo) {
      dom.hlsVideo.muted = false;
      state.isMuted = false;
      dom.unmutePrompt.style.display = "none";
    }
  }

  // =========================================================================
  // 4. TV GUIDE & OSD CONTROLLER
  // =========================================================================
  function showGuide() {
    state.guideVisible = true;
    dom.guideOverlay.classList.remove("hidden");
    focusRow(state.focusedRowIndex);
  }

  function hideGuide() {
    state.guideVisible = false;
    dom.guideOverlay.classList.add("hidden");
    unlockAudio();
    if (state.currentChannel) {
      triggerOsdBanner(state.currentChannel);
    }
  }

  function toggleGuide() {
    if (state.guideVisible) {
      hideGuide();
    } else {
      showGuide();
    }
  }

  function triggerOsdBanner(channel) {
    if (dom.osdNum) dom.osdNum.textContent = channel.number;
    if (dom.osdBadge) {
      dom.osdBadge.textContent = channel.logoText || "TV";
      dom.osdBadge.style.backgroundColor = channel.color || "#3b82f6";
    }
    if (dom.osdName) dom.osdName.textContent = channel.name;
    if (dom.osdDesc) dom.osdDesc.textContent = channel.description;
    if (dom.osdTag) dom.osdTag.textContent = channel.badge;
    if (dom.osdQuality) dom.osdQuality.textContent = channel.quality;

    dom.osdBanner.classList.remove("hidden");

    if (state.osdTimer) clearTimeout(state.osdTimer);
    state.osdTimer = setTimeout(() => {
      dom.osdBanner.classList.add("hidden");
    }, 3500);
  }

  // Channel Zapping with Correct Direction
  function switchChannelDelta(delta) {
    const channels = CHANNELS_DATA;
    let currIdx = channels.findIndex(c => c.id === state.currentChannel?.id);
    if (currIdx === -1) currIdx = 0;

    let nextIdx = (currIdx + delta + channels.length) % channels.length;
    playChannel(channels[nextIdx], true);
  }

  // =========================================================================
  // 5. HARDWARE REMOTE & KEYBOARD EVENTS
  // =========================================================================
  function setupEventListeners() {
    window.addEventListener("keydown", handleKeyNavigation);

    dom.videoStage.addEventListener("click", () => {
      unlockAudio();
      if (!state.guideVisible) {
        triggerOsdBanner(state.currentChannel);
      }
    });

    dom.btnCloseGuide.addEventListener("click", hideGuide);
    dom.unmutePrompt.addEventListener("click", unlockAudio);
  }

  function handleKeyNavigation(e) {
    unlockAudio();

    const key = e.key;
    const keyCode = e.keyCode;

    // Return: 10009
    if (keyCode === 10009 || key === "Escape" || key === "Backspace") {
      toggleGuide();
      e.preventDefault();
      return;
    }

    // In TV Guide Mode
    if (state.guideVisible) {
      const channels = getFilteredChannels();

      switch (key) {
        case "ArrowDown":
          focusRow(state.focusedRowIndex + 1);
          e.preventDefault();
          break;

        case "ArrowUp":
          focusRow(state.focusedRowIndex - 1);
          e.preventDefault();
          break;

        case "ArrowLeft":
          cycleCategory(-1);
          e.preventDefault();
          break;

        case "ArrowRight":
          cycleCategory(1);
          e.preventDefault();
          break;

        case "Enter":
        case " ":
          if (channels[state.focusedRowIndex]) {
            playChannel(channels[state.focusedRowIndex], true);
            hideGuide();
          }
          e.preventDefault();
          break;

        case "b":
        case "B":
        case 406: // Blue button
          cycleCategory(1);
          e.preventDefault();
          break;

        default:
          break;
      }
      return;
    }

    // In Fullscreen Broadcast Mode (Zapping Channels)
    switch (key) {
      // SĂGEATA ÎN SUS -> URMĂTORUL CANAL (+1)
      case "ArrowUp":
      case "PageUp":
      case 427: // ChannelUp Rocker
        switchChannelDelta(1);
        e.preventDefault();
        break;

      // SĂGEATA ÎN JOS -> CANALUL ANTERIOR (-1)
      case "ArrowDown":
      case "PageDown":
      case 428: // ChannelDown Rocker
        switchChannelDelta(-1);
        e.preventDefault();
        break;

      case "Enter":
      case " ":
      case "g":
      case "G":
        toggleGuide();
        e.preventDefault();
        break;

      case "f":
      case "F":
      case 403: // Red Button
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
        e.preventDefault();
        break;

      default:
        // Numeric direct channel tuning (1 - 9)
        if (/^[1-9]$/.test(key)) {
          const numIdx = parseInt(key, 10) - 1;
          if (CHANNELS_DATA[numIdx]) {
            playChannel(CHANNELS_DATA[numIdx], true);
          }
          e.preventDefault();
        }
        break;
    }
  }

  function cycleCategory(delta) {
    const cats = CATEGORIES;
    let curr = cats.findIndex(c => c.id === state.activeCategory);
    if (curr === -1) curr = 0;
    let next = (curr + delta + cats.length) % cats.length;
    state.activeCategory = cats[next].id;
    renderCategories();
    renderChannelRows();
    focusRow(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
