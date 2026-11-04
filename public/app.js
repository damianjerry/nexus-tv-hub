/**
 * NEXUS TV // Linear Player & Smart TV Guide Engine
 * Engineered for Samsung The Frame (Tizen 6.5) & 10-Foot UI
 *
 * Implements:
 * 1. 2-Press OK Remote Control Flow (1st press = OSD banner, 2nd press = TV Guide)
 * 2. Guaranteed Current Channel Focus on TV Guide opening
 * 3. Dynamic Linear EPG Timeline Grid with Live Progress Bars
 * 4. Dedicated Event Category & Real-time Live Event Notification Toast
 * 5. Robust Direct HLS & Clean YouTube Embed Streaming
 */

(function () {
  "use strict";

  // State Management
  const state = {
    activeCategory: "all",
    focusedRowIndex: 0,
    focusedProgIndex: 0,
    focusMode: "program", // 'channel' | 'program'
    currentChannel: null,
    guideVisible: false,
    osdVisible: false,
    isMuted: false,
    volume: 1.0,
    hlsPlayer: null,
    osdTimer: null,
    liveToastTimer: null,
    activeLiveEventChannel: null,
    hasNotifiedChannels: new Set(),
    timelineBaseHour: null
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

    // Linear TV Guide Overlay
    guideOverlay: document.getElementById("guide-overlay"),
    guideClock: document.getElementById("guide-clock"),
    guideDate: document.getElementById("guide-date"),
    guideCategories: document.getElementById("guide-categories"),
    btnCloseGuide: document.getElementById("btn-close-guide"),
    epgTimeRuler: document.getElementById("epg-time-ruler"),
    epgGridContainer: document.getElementById("epg-grid-container"),
    epgNowMarker: document.getElementById("epg-now-marker"),
    epgChannelsRows: document.getElementById("epg-channels-rows"),

    // EPG Inspector Panel
    inspBadge: document.getElementById("insp-badge"),
    inspChName: document.getElementById("insp-ch-name"),
    inspCatTag: document.getElementById("insp-cat-tag"),
    inspStatusPill: document.getElementById("insp-status-pill"),
    inspTitle: document.getElementById("insp-title"),
    inspTime: document.getElementById("insp-time"),
    inspProgressText: document.getElementById("insp-progress-text"),
    inspDesc: document.getElementById("insp-desc"),

    // Quick OSD Info Banner
    osdBanner: document.getElementById("osd-banner"),
    osdNum: document.getElementById("osd-num"),
    osdBadge: document.getElementById("osd-badge"),
    osdName: document.getElementById("osd-name"),
    osdTag: document.getElementById("osd-tag"),
    osdQuality: document.getElementById("osd-quality"),
    osdDesc: document.getElementById("osd-desc"),
    osdClock: document.getElementById("osd-clock"),
    osdCurrentShowTitle: document.getElementById("osd-current-show-title"),
    osdCurrentShowTime: document.getElementById("osd-current-show-time"),
    osdProgressBarFill: document.getElementById("osd-progress-bar-fill"),
    osdNextShowTitle: document.getElementById("osd-next-show-title"),
    osdNextShowTime: document.getElementById("osd-next-show-time"),

    // Live Event Toast
    liveEventToast: document.getElementById("live-event-toast"),
    liveToastChannelName: document.getElementById("live-toast-channel-name"),
    liveToastSubtext: document.getElementById("live-toast-subtext")
  };

  // =========================================================================
  // 1. BOOTSTRAP & INITIALIZATION
  // =========================================================================
  function init() {
    registerTizenKeys();
    initClocks();
    renderCategoryPills();

    // Start with CH 01 (CineMaraton Plus HD or Bloomberg EU)
    const initialChannel = CHANNELS_DATA[0];
    playChannel(initialChannel, false);

    // Initial render of EPG grid
    renderEpgGrid();

    setupEventListeners();
    startLiveEventMonitor();

    console.log("[NEXUS] Initialized successfully. Total channels:", CHANNELS_DATA.length);
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
          // Ignore if already registered
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

      // Update vertical 'NOW' indicator in EPG grid if visible
      if (state.guideVisible) {
        updateNowMarkerPosition(now);
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  // =========================================================================
  // 2. CATEGORY PILLS & CHANNEL FILTERING
  // =========================================================================
  function renderCategoryPills() {
    if (!dom.guideCategories) return;
    dom.guideCategories.innerHTML = "";

    CATEGORIES.forEach((cat, idx) => {
      const btn = document.createElement("button");
      btn.className = `cat-pill ${state.activeCategory === cat.id ? "active" : ""}`;
      btn.dataset.category = cat.id;
      btn.dataset.index = idx;
      btn.innerHTML = `
        <span>${cat.label}</span>
        <span class="cat-count tabular-nums">${cat.count}</span>
      `;

      btn.addEventListener("click", () => {
        state.activeCategory = cat.id;
        renderCategoryPills();
        renderEpgGrid();
        focusChannelRow(0);
      });

      dom.guideCategories.appendChild(btn);
    });
  }

  function getFilteredChannels() {
    if (state.activeCategory === "all") return CHANNELS_DATA;
    return CHANNELS_DATA.filter(c => c.category === state.activeCategory);
  }

  // =========================================================================
  // 3. LINEAR EPG TIMELINE GRID RENDERING
  // =========================================================================
  function renderEpgGrid() {
    if (!dom.epgChannelsRows || !dom.epgTimeRuler) return;

    const now = new Date();
    const channels = getFilteredChannels();

    // 1. Render Timeline Ruler across top
    const startHour = Math.max(0, now.getHours() - 1);
    state.timelineBaseHour = startHour;
    const intervals = EPG_DATA.getTimelineIntervals(now, 5, 30);

    dom.epgTimeRuler.innerHTML = "";
    intervals.forEach(int => {
      const slot = document.createElement("div");
      slot.className = `epg-time-slot tabular-nums ${int.isCurrentHour ? "active-hour" : ""}`;
      slot.textContent = int.timeStr;
      dom.epgTimeRuler.appendChild(slot);
    });

    // 2. Render Channel Rows & Program Blocks
    dom.epgChannelsRows.innerHTML = "";
    const baseTimelineStartMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, 0, 0, 0).getTime();

    channels.forEach((ch, rowIdx) => {
      const row = document.createElement("div");
      const isCurrentChannel = state.currentChannel?.id === ch.id;
      row.className = `epg-channel-row ${rowIdx === state.focusedRowIndex ? "row-focused" : ""} ${isCurrentChannel ? "is-current-playing" : ""}`;
      row.dataset.row = rowIdx;
      row.dataset.channelId = ch.id;

      // Channel Sticky Left Cell
      const isLiveEvent = ch.isEventStream && ch.isLiveNow;
      const cell = document.createElement("div");
      cell.className = "epg-channel-cell";
      cell.innerHTML = `
        <span class="epg-ch-num tabular-nums">${ch.number}</span>
        <div class="epg-ch-badge" style="background-color: ${ch.color || '#3b82f6'};">
          ${ch.logoText || ch.name.substring(0, 3).toUpperCase()}
        </div>
        <div class="epg-ch-info">
          <span class="epg-ch-name">${ch.name}</span>
          <div class="epg-ch-meta">
            <span class="epg-live-dot ${isLiveEvent ? 'event-live' : ''}"></span>
            <span>${ch.badge}</span>
          </div>
        </div>
      `;

      cell.addEventListener("click", () => {
        focusChannelRow(rowIdx);
        playChannel(ch, true);
        hideGuide();
      });

      row.appendChild(cell);

      // Program Timeline Track
      const track = document.createElement("div");
      track.className = "epg-programs-track";

      const schedule = EPG_DATA.generateDaySchedule(ch.id, now);
      // Filter programs that overlap with current timeline viewport
      const visibleShows = schedule.filter(s => s.endMs >= baseTimelineStartMs && s.startMs <= baseTimelineStartMs + 6 * 3600 * 1000);

      visibleShows.forEach((prog, progIdx) => {
        const card = document.createElement("div");
        const isLiveNow = now.getTime() >= prog.startMs && now.getTime() < prog.endMs;

        // Card width: approx 4.8px per minute
        const cardWidth = Math.max(150, Math.round(prog.durationMinutes * 4.8));
        card.style.width = `${cardWidth}px`;
        card.className = `epg-program-card ${isLiveNow ? 'is-live-show' : ''} ${rowIdx === state.focusedRowIndex && progIdx === state.focusedProgIndex ? 'focused' : ''}`;
        card.dataset.progIdx = progIdx;

        let liveBadgeHtml = isLiveNow ? `<span class="epg-live-badge-mini">LIVE</span>` : "";
        let progressHtml = "";

        if (isLiveNow) {
          const currentInfo = EPG_DATA.getCurrentShow(ch.id, now);
          progressHtml = `
            <div class="epg-prog-progress-bar">
              <div class="epg-prog-progress-fill" style="width: ${currentInfo.progressPercent}%;"></div>
            </div>
          `;
        }

        card.innerHTML = `
          <div class="epg-prog-top">
            <span class="epg-prog-time tabular-nums">${prog.startTimeStr} - ${prog.endTimeStr}</span>
            ${liveBadgeHtml}
          </div>
          <div class="epg-prog-title">${prog.title}</div>
          ${progressHtml}
        `;

        card.addEventListener("click", (e) => {
          e.stopPropagation();
          focusProgramCard(rowIdx, progIdx);
          playChannel(ch, true);
          hideGuide();
        });

        track.appendChild(card);
      });

      row.appendChild(track);
      dom.epgChannelsRows.appendChild(row);
    });

    updateNowMarkerPosition(now);
  }

  function updateNowMarkerPosition(now) {
    if (!dom.epgNowMarker || state.timelineBaseHour === null) return;
    const baseHour = state.timelineBaseHour;
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    const hoursDiff = currentHour - baseHour;
    // Each 30 mins = 240px slot width => 8px per minute
    const minutesFromBase = hoursDiff * 60 + currentMin;
    const markerLeftPx = 290 + Math.max(0, minutesFromBase * 8);

    dom.epgNowMarker.style.left = `${markerLeftPx}px`;
  }

  // =========================================================================
  // 4. EPG FOCUS & INSPECTOR CONTROLLER
  // =========================================================================
  function focusChannelRow(rowIndex, scroll = true) {
    const channels = getFilteredChannels();
    if (channels.length === 0) return;

    if (rowIndex < 0) rowIndex = 0;
    if (rowIndex >= channels.length) rowIndex = channels.length - 1;

    state.focusedRowIndex = rowIndex;

    const rows = dom.epgChannelsRows.querySelectorAll(".epg-channel-row");
    rows.forEach((r, i) => {
      if (i === rowIndex) {
        r.classList.add("row-focused");
        if (scroll) {
          r.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        r.classList.remove("row-focused");
      }
    });

    // Find the currently airing program in this row and focus it
    const ch = channels[rowIndex];
    if (ch) {
      focusProgramCard(rowIndex, 0, false);
      updateInspectorWithCurrentShow(ch);
    }
  }

  function focusProgramCard(rowIdx, progIdx, scroll = true) {
    const rows = dom.epgChannelsRows.querySelectorAll(".epg-channel-row");
    const row = rows[rowIdx];
    if (!row) return;

    const cards = row.querySelectorAll(".epg-program-card");
    if (cards.length === 0) return;

    if (progIdx < 0) progIdx = 0;
    if (progIdx >= cards.length) progIdx = cards.length - 1;

    state.focusedProgIndex = progIdx;

    // Remove focus from all cards across all rows
    dom.epgChannelsRows.querySelectorAll(".epg-program-card.focused").forEach(c => c.classList.remove("focused"));

    const targetCard = cards[progIdx];
    if (targetCard) {
      targetCard.classList.add("focused");
      if (scroll) {
        targetCard.scrollIntoView({ behavior: "smooth", inline: "nearest" });
      }
    }

    const channels = getFilteredChannels();
    const ch = channels[rowIdx];
    if (ch) {
      const now = new Date();
      const schedule = EPG_DATA.generateDaySchedule(ch.id, now);
      const prog = schedule[progIdx] || EPG_DATA.getCurrentShow(ch.id, now);
      updateInspectorWithShow(ch, prog);
    }
  }

  function updateInspectorWithCurrentShow(ch) {
    const now = new Date();
    const show = EPG_DATA.getCurrentShow(ch.id, now);
    updateInspectorWithShow(ch, show);
  }

  function updateInspectorWithShow(ch, show) {
    if (!show || !ch) return;

    if (dom.inspBadge) {
      dom.inspBadge.textContent = ch.logoText || ch.name.substring(0, 3).toUpperCase();
      dom.inspBadge.style.backgroundColor = ch.color || "#3b82f6";
    }
    if (dom.inspChName) dom.inspChName.textContent = ch.name;
    if (dom.inspCatTag) dom.inspCatTag.textContent = ch.badge;
    if (dom.inspStatusPill) {
      dom.inspStatusPill.textContent = show.isLive ? "● LIVE ACUM" : "● PROGRAMAT";
      dom.inspStatusPill.style.color = show.isLive ? "var(--accent-emerald)" : "var(--text-muted)";
    }
    if (dom.inspTitle) dom.inspTitle.textContent = show.title;
    if (dom.inspTime) dom.inspTime.textContent = `${show.startTimeStr} - ${show.endTimeStr}`;
    if (dom.inspProgressText) {
      dom.inspProgressText.textContent = show.isLive ? `A mai rămas: ${show.remainingMinutes || 30} min` : `Durată: ${show.durationMinutes} min`;
    }
    if (dom.inspDesc) dom.inspDesc.textContent = show.desc || ch.description;
  }

  // =========================================================================
  // 5. MEDIA STREAM ENGINE (DIRECT HLS & CLEAN YOUTUBE)
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

    if (showOsd) {
      showOsdBanner(channel);
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

  // Native & Hls.js Direct Stream Player (Fixed Unmute Behavior)
  function playHls(url) {
    dom.hlsVideo.style.display = "block";
    dom.hlsVideo.muted = false;
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

  // Clean YouTube Live Player (Strict Referrer & Frame-safe Handshake)
  function playYouTubeClean(channel) {
    dom.ytCropStage.style.display = "block";

    const videoId = channel.youtube?.videoId || "";
    let src = "";

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
  // 6. TV GUIDE & 2-PRESS OK REMOTE LOGIC
  // =========================================================================

  /**
   * Opens TV Guide overlay.
   * REQUIREMENT 6: ALWAYS opens focused on the currently playing channel!
   */
  function showGuide() {
    state.guideVisible = true;
    state.osdVisible = false;
    if (dom.osdBanner) dom.osdBanner.classList.add("hidden");

    // Ensure currently playing channel is visible in filtered category
    if (state.currentChannel) {
      const filtered = getFilteredChannels();
      const existsInCurrentCategory = filtered.some(c => c.id === state.currentChannel.id);
      if (!existsInCurrentCategory) {
        state.activeCategory = "all";
        renderCategoryPills();
      }
    }

    renderEpgGrid();
    dom.guideOverlay.classList.remove("hidden");

    // Focus exactly the currently playing channel row
    if (state.currentChannel) {
      const channels = getFilteredChannels();
      const currIdx = channels.findIndex(c => c.id === state.currentChannel.id);
      if (currIdx !== -1) {
        focusChannelRow(currIdx, true);
      } else {
        focusChannelRow(0, true);
      }
    } else {
      focusChannelRow(0, true);
    }
  }

  function hideGuide() {
    state.guideVisible = false;
    dom.guideOverlay.classList.add("hidden");
    unlockAudio();
    if (state.currentChannel) {
      showOsdBanner(state.currentChannel);
    }
  }

  /**
   * Enhanced OSD Info Banner with real-time show title and live progress bar
   */
  function showOsdBanner(channel) {
    if (!channel) return;
    state.osdVisible = true;

    if (dom.osdNum) dom.osdNum.textContent = channel.number;
    if (dom.osdBadge) {
      dom.osdBadge.textContent = channel.logoText || channel.name.substring(0, 3).toUpperCase();
      dom.osdBadge.style.backgroundColor = channel.color || "#3b82f6";
    }
    if (dom.osdName) dom.osdName.textContent = channel.name;
    if (dom.osdTag) dom.osdTag.textContent = channel.badge;
    if (dom.osdQuality) dom.osdQuality.textContent = channel.quality;
    if (dom.osdDesc) dom.osdDesc.textContent = channel.description;

    // Query dynamic EPG for current and next show
    const now = new Date();
    const currentShow = EPG_DATA.getCurrentShow(channel.id, now);
    const nextShow = EPG_DATA.getNextShow(channel.id, now);

    if (dom.osdCurrentShowTitle) dom.osdCurrentShowTitle.textContent = currentShow.title;
    if (dom.osdCurrentShowTime) {
      dom.osdCurrentShowTime.textContent = `${currentShow.startTimeStr} - ${currentShow.endTimeStr} (A mai rămas: ${currentShow.remainingMinutes || 25} min)`;
    }
    if (dom.osdProgressBarFill) {
      dom.osdProgressBarFill.style.width = `${currentShow.progressPercent || 45}%`;
    }

    if (dom.osdNextShowTitle) dom.osdNextShowTitle.textContent = nextShow.title;
    if (dom.osdNextShowTime) dom.osdNextShowTime.textContent = nextShow.startTimeStr;

    dom.osdBanner.classList.remove("hidden");

    if (state.osdTimer) clearTimeout(state.osdTimer);
    state.osdTimer = setTimeout(() => {
      hideOsdBanner();
    }, 4500);
  }

  function hideOsdBanner() {
    state.osdVisible = false;
    if (dom.osdBanner) dom.osdBanner.classList.add("hidden");
    if (state.osdTimer) clearTimeout(state.osdTimer);
  }

  // Fullscreen Channel Zapping (Correct Polarity: ArrowUp = Next, ArrowDown = Prev)
  function switchChannelDelta(delta) {
    const channels = CHANNELS_DATA;
    let currIdx = channels.findIndex(c => c.id === state.currentChannel?.id);
    if (currIdx === -1) currIdx = 0;

    let nextIdx = (currIdx + delta + channels.length) % channels.length;
    playChannel(channels[nextIdx], true);
  }

  // =========================================================================
  // 7. LIVE EVENT POLLER & TOAST NOTIFICATION (REQUIREMENT 3)
  // =========================================================================
  function startLiveEventMonitor() {
    // Check initially and periodically every 60 seconds
    checkEventStreams();
    setInterval(checkEventStreams, 60000);
  }

  function checkEventStreams() {
    const eventChannels = CHANNELS_DATA.filter(c => c.isEventStream);

    eventChannels.forEach(ch => {
      if (ch.type === "hls") {
        // HLS stream live check
        fetch(ch.hlsUrl, { method: "HEAD", cache: "no-store" })
          .then(res => {
            if (res.ok) {
              setEventChannelLive(ch);
            }
          })
          .catch(() => {});
      } else if (ch.type.startsWith("youtube") && ch.youtube?.handle) {
        // YouTube live stream detection
        const liveCheckUrl = `https://www.youtube.com/${ch.youtube.handle}/live`;
        fetch(liveCheckUrl, { method: "GET", cache: "no-store" })
          .then(res => res.text())
          .then(html => {
            if (html.includes('"isLive":true') || html.includes('"isLiveBroadcast":true') || html.includes('watch?v=')) {
              setEventChannelLive(ch);
            }
          })
          .catch(() => {});
      }
    });
  }

  function setEventChannelLive(channel) {
    channel.isLiveNow = true;

    // If already watching or already alerted this session, don't spam
    if (state.currentChannel?.id === channel.id) return;
    if (state.hasNotifiedChannels.has(channel.id)) return;

    state.hasNotifiedChannels.add(channel.id);
    state.activeLiveEventChannel = channel;

    showLiveEventToast(channel);
  }

  function showLiveEventToast(channel) {
    if (!dom.liveEventToast) return;

    if (dom.liveToastChannelName) {
      dom.liveToastChannelName.textContent = `${channel.name} transmite în direct!`;
    }
    const currentShow = EPG_DATA.getCurrentShow(channel.id);
    if (dom.liveToastSubtext) {
      dom.liveToastSubtext.textContent = currentShow.title || channel.description;
    }

    dom.liveEventToast.classList.remove("hidden");

    if (state.liveToastTimer) clearTimeout(state.liveToastTimer);
    state.liveToastTimer = setTimeout(() => {
      dom.liveEventToast.classList.add("hidden");
      state.activeLiveEventChannel = null;
    }, 9000);
  }

  function dismissLiveEventToast() {
    if (dom.liveEventToast) dom.liveEventToast.classList.add("hidden");
    state.activeLiveEventChannel = null;
    if (state.liveToastTimer) clearTimeout(state.liveToastTimer);
  }

  // =========================================================================
  // 8. REMOTE CONTROL KEYBOARD & D-PAD NAVIGATION
  // =========================================================================
  function setupEventListeners() {
    window.addEventListener("keydown", handleKeyNavigation);

    dom.videoStage.addEventListener("click", () => {
      unlockAudio();
      if (!state.guideVisible) {
        handleOkKeyPress();
      }
    });

    dom.btnCloseGuide.addEventListener("click", hideGuide);
    dom.unmutePrompt.addEventListener("click", unlockAudio);

    if (dom.liveEventToast) {
      dom.liveEventToast.addEventListener("click", () => {
        if (state.activeLiveEventChannel) {
          playChannel(state.activeLiveEventChannel, true);
          dismissLiveEventToast();
        }
      });
    }
  }

  /**
   * REQUIREMENT 5: Remote OK key logic:
   * - 1st press: shows OSD Info Banner
   * - 2nd press (while OSD is visible): opens the TV Guide
   */
  function handleOkKeyPress() {
    // If Live Event Toast is showing, OK immediately tunes to it
    if (state.activeLiveEventChannel) {
      playChannel(state.activeLiveEventChannel, true);
      dismissLiveEventToast();
      return;
    }

    if (state.osdVisible) {
      // 2nd press of OK: Open TV Guide!
      hideOsdBanner();
      showGuide();
    } else {
      // 1st press of OK: Show OSD Info Banner!
      if (state.currentChannel) {
        showOsdBanner(state.currentChannel);
      }
    }
  }

  function handleKeyNavigation(e) {
    unlockAudio();

    const key = e.key;
    const keyCode = e.keyCode;

    // Return key: 10009 on Samsung Tizen
    if (keyCode === 10009 || key === "Escape" || key === "Backspace") {
      if (state.guideVisible) {
        hideGuide();
      } else if (state.osdVisible) {
        hideOsdBanner();
      } else if (state.activeLiveEventChannel) {
        dismissLiveEventToast();
      }
      e.preventDefault();
      return;
    }

    // =======================================================================
    // CASE A: IN TV GUIDE OVERLAY MODE
    // =======================================================================
    if (state.guideVisible) {
      const channels = getFilteredChannels();

      switch (key) {
        case "ArrowDown":
          focusChannelRow(state.focusedRowIndex + 1);
          e.preventDefault();
          break;

        case "ArrowUp":
          focusChannelRow(state.focusedRowIndex - 1);
          e.preventDefault();
          break;

        case "ArrowRight":
          focusProgramCard(state.focusedRowIndex, state.focusedProgIndex + 1);
          e.preventDefault();
          break;

        case "ArrowLeft":
          if (state.focusedProgIndex > 0) {
            focusProgramCard(state.focusedRowIndex, state.focusedProgIndex - 1);
          } else {
            // Cycle category to the left
            cycleCategory(-1);
          }
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

        // Channel up/down rocker inside guide -> page 5 channels
        case "PageDown":
        case 428: // ChannelDown Rocker
          focusChannelRow(state.focusedRowIndex + 5);
          e.preventDefault();
          break;

        case "PageUp":
        case 427: // ChannelUp Rocker
          focusChannelRow(state.focusedRowIndex - 5);
          e.preventDefault();
          break;

        // Remote color buttons for quick category switching
        case "b":
        case "B":
        case 406: // Blue button
          cycleCategory(1);
          e.preventDefault();
          break;

        case "y":
        case "Y":
        case 405: // Yellow button
          cycleCategory(-1);
          e.preventDefault();
          break;

        default:
          break;
      }
      return;
    }

    // =======================================================================
    // CASE B: IN FULLSCREEN BROADCAST MODE
    // =======================================================================
    switch (key) {
      // 1st press = OSD banner, 2nd press = TV Guide!
      case "Enter":
      case " ":
        handleOkKeyPress();
        e.preventDefault();
        break;

      // Direct Guide key on some Samsung remotes
      case "g":
      case "G":
        showGuide();
        e.preventDefault();
        break;

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

      // Fullscreen toggle (Red Button / F)
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
    renderCategoryPills();
    renderEpgGrid();
    focusChannelRow(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
