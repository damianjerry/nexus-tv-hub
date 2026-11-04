/**
 * NEXUS TV // Linear Player & Smart TV Guide Engine
 * Engineered for Samsung The Frame (Tizen 6.5) & 10-Foot UI
 *
 * Implements:
 * 1. Samsung SolarCell Remote Channel Rocker (ChannelUp / ChannelDown) & Arrow navigation
 * 2. 2-Press OK Remote Control Flow (1st press = OSD banner, 2nd press = TV Guide)
 * 3. Guaranteed Current Channel Focus on TV Guide opening
 * 4. Zero DOM thrashing: DOM pre-rendered & cached once, toggled smoothly with CSS
 * 5. Official Standby Screen for event channels (BNR, CDEP, Senat, Gov) when offline
 * 6. TextTrack & CC subtitle suppression for True History & Yahoo Finance
 * 7. Real-time Live Event Detection & Notification Toast
 */

(function () {
  "use strict";

  // State Management
  const state = {
    activeCategory: "all",
    focusedRowIndex: 0,
    focusedProgIndex: 0,
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
    timelineBaseHour: null,
    currentInspectedTimeMs: null,
    rowDomCache: [] // Array of { channel, rowEl, trackEl, cardEls }
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

    // Standby Screen
    eventStandbyScreen: document.getElementById("event-standby-screen"),
    standbyBadge: document.getElementById("standby-badge"),
    standbyTitle: document.getElementById("standby-title"),
    standbyPortal: document.getElementById("standby-portal"),

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
    setupVideoTextTrackSuppression();
    renderCategoryPills();

    // Pre-build and cache the entire EPG grid DOM once
    buildEpgGridOnce();

    // Start with CH 01 (CineMaraton Plus HD)
    const initialChannel = CHANNELS_DATA[0];
    playChannel(initialChannel, false);

    setupEventListeners();
    startLiveEventMonitor();

    console.log("[NEXUS] Initialized successfully. Total clean channels:", CHANNELS_DATA.length);
  }

  /**
   * Registers physical Samsung SolarCell remote keys (ChannelUp / ChannelDown rocker, Color keys, Numbers)
   */
  function registerTizenKeys() {
    if (typeof tizen !== "undefined" && tizen.tvinputdevice) {
      const keys = [
        "ChannelUp",
        "ChannelDown",
        "ColorF0Red",
        "ColorF1Green",
        "ColorF2Yellow",
        "ColorF3Blue",
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
          // Key already registered or not supported
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

      if (state.guideVisible) {
        updateNowMarkerPosition(now);
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  /**
   * Disables native webvtt and CEA-608/708 subtitles to eliminate duplicate/unwanted captions
   */
  function setupVideoTextTrackSuppression() {
    if (!dom.hlsVideo) return;

    function suppressTracks() {
      if (dom.hlsVideo.textTracks) {
        for (let i = 0; i < dom.hlsVideo.textTracks.length; i++) {
          try {
            dom.hlsVideo.textTracks[i].mode = "disabled";
          } catch (e) {}
        }
      }
    }

    if (dom.hlsVideo.textTracks) {
      dom.hlsVideo.textTracks.addEventListener("addtrack", (e) => {
        try {
          e.track.mode = "disabled";
        } catch (err) {}
      });
    }

    dom.hlsVideo.addEventListener("loadedmetadata", suppressTracks);
    dom.hlsVideo.addEventListener("play", suppressTracks);
  }

  // =========================================================================
  // 2. CATEGORY PILLS & FAST FILTERING
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
        selectCategory(cat.id);
      });

      dom.guideCategories.appendChild(btn);
    });
  }

  function selectCategory(catId) {
    state.activeCategory = catId;

    // Update pill active classes
    const pills = dom.guideCategories.querySelectorAll(".cat-pill");
    pills.forEach(p => {
      p.classList.toggle("active", p.dataset.category === catId);
    });

    // Fast CSS toggle on pre-rendered DOM rows (NO DOM THRASING!)
    state.rowDomCache.forEach((item) => {
      const visible = (catId === "all" || item.channel.category === catId);
      item.rowEl.style.display = visible ? "flex" : "none";
    });

    // Focus the first visible channel
    const visibleIndex = getVisibleChannels().findIndex(c => c.id === state.currentChannel?.id);
    focusChannelRow(visibleIndex !== -1 ? visibleIndex : 0);
  }

  function getVisibleChannels() {
    if (state.activeCategory === "all") return CHANNELS_DATA;
    return CHANNELS_DATA.filter(c => c.category === state.activeCategory);
  }

  // =========================================================================
  // 3. ZERO-LAG LINEAR EPG TIMELINE GRID (RENDER ONCE & CACHE)
  // =========================================================================
  function buildEpgGridOnce() {
    if (!dom.epgChannelsRows || !dom.epgTimeRuler) return;

    const now = new Date();
    const startHour = Math.max(0, now.getHours() - 1);
    state.timelineBaseHour = startHour;

    // 1. Render Timeline Ruler
    const intervals = EPG_DATA.getTimelineIntervals(now, EPG_DATA.TIMELINE_HOURS, 30);
    const rulerTotalWidthPx = intervals.length * 240;

    dom.epgTimeRuler.style.width = `${rulerTotalWidthPx}px`;
    dom.epgTimeRuler.innerHTML = "";
    intervals.forEach(int => {
      const slot = document.createElement("div");
      slot.className = `epg-time-slot tabular-nums ${int.isCurrentHour ? "active-hour" : ""}`;
      slot.textContent = int.timeStr;
      dom.epgTimeRuler.appendChild(slot);
    });

    // 2. Build rows into a DocumentFragment for maximum paint performance
    const fragment = document.createDocumentFragment();
    state.rowDomCache = [];

    CHANNELS_DATA.forEach((ch, chIdx) => {
      const row = document.createElement("div");
      row.className = "epg-channel-row";
      row.dataset.channelId = ch.id;
      row.dataset.category = ch.category;

      // Channel Sticky Left Cell
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
            <span class="epg-live-dot ${ch.isEventStream && ch.isLiveNow ? 'event-live' : ''}"></span>
            <span>${ch.badge}</span>
          </div>
        </div>
      `;

      cell.addEventListener("click", () => {
        playChannel(ch, true);
        hideGuide(false);
      });

      row.appendChild(cell);

      // Program Timeline Track
      const track = document.createElement("div");
      track.className = "epg-programs-track";
      track.style.width = `${rulerTotalWidthPx}px`;

      const visibleShows = EPG_DATA.getVisibleShows(ch.id, now);
      const cardEls = [];

      visibleShows.forEach((prog, progIdx) => {
        const card = document.createElement("div");
        card.style.left = `${prog.leftPx}px`;
        card.style.width = `${prog.widthPx}px`;
        card.className = `epg-program-card ${prog.isLiveNow ? 'is-live-show' : ''}`;
        card.dataset.progIdx = progIdx;
        card._progData = prog;

        let liveBadgeHtml = prog.isLiveNow ? `<span class="epg-live-badge-mini">LIVE</span>` : "";
        let progressHtml = "";

        if (prog.isLiveNow) {
          progressHtml = `
            <div class="epg-prog-progress-bar">
              <div class="epg-prog-progress-fill" style="width: ${prog.progressPercent}%;"></div>
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
          playChannel(ch, true);
          hideGuide(false);
        });

        track.appendChild(card);
        cardEls.push(card);
      });

      row.appendChild(track);
      fragment.appendChild(row);

      state.rowDomCache.push({
        channel: ch,
        rowEl: row,
        trackEl: track,
        cardEls: cardEls
      });
    });

    dom.epgChannelsRows.innerHTML = "";
    dom.epgChannelsRows.appendChild(fragment);

    updateNowMarkerPosition(now);
  }

  function updateNowMarkerPosition(now) {
    if (!dom.epgNowMarker || state.timelineBaseHour === null) return;
    const baseHour = state.timelineBaseHour;
    const baseTimelineStartMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), baseHour, 0, 0, 0).getTime();
    const PX_PER_MIN = EPG_DATA.PX_PER_MINUTE || 8;

    const elapsedMs = Math.max(0, now.getTime() - baseTimelineStartMs);
    const markerLeftPx = 320 + (elapsedMs / 60000) * PX_PER_MIN;

    dom.epgNowMarker.style.left = `${markerLeftPx}px`;
  }

  /**
   * Refreshes the active playing highlights and progress bars when opening the guide
   */
  function refreshGuideState() {
    const now = new Date();
    updateNowMarkerPosition(now);

    state.rowDomCache.forEach((item) => {
      const isCurrent = state.currentChannel?.id === item.channel.id;
      item.rowEl.classList.toggle("is-current-playing", isCurrent);

      // Update progress bar on live show card
      item.cardEls.forEach(card => {
        if (card._progData) {
          const isLive = now.getTime() >= card._progData.startMs && now.getTime() < card._progData.endMs;
          card.classList.toggle("is-live-show", isLive);
          if (isLive) {
            const elapsed = Math.max(0, now.getTime() - card._progData.startMs);
            const total = Math.max(1, card._progData.endMs - card._progData.startMs);
            const pct = Math.min(100, Math.round((elapsed / total) * 100));
            const fill = card.querySelector(".epg-prog-progress-fill");
            if (fill) fill.style.width = `${pct}%`;
          }
        }
      });
    });
  }

  // =========================================================================
  // 4. EPG FOCUS & INSPECTOR CONTROLLER
  // =========================================================================
  function focusChannelRow(rowIndex, scroll = true, smooth = true) {
    const visibleChannels = getVisibleChannels();
    if (visibleChannels.length === 0) return;

    if (rowIndex < 0) rowIndex = 0;
    if (rowIndex >= visibleChannels.length) rowIndex = visibleChannels.length - 1;

    state.focusedRowIndex = rowIndex;
    const targetChannel = visibleChannels[rowIndex];

    // Update row-focused class on cached row DOMs
    state.rowDomCache.forEach((item) => {
      const isTarget = item.channel.id === targetChannel.id;
      item.rowEl.classList.toggle("row-focused", isTarget);
      if (isTarget && scroll) {
        item.rowEl.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "center" });
      }
    });

    const activeItem = state.rowDomCache.find(item => item.channel.id === targetChannel.id);
    if (!activeItem || activeItem.cardEls.length === 0) return;

    // Pick program: match inspected time if exists, or live show, or default to 0
    let targetProgIdx = -1;
    if (state.currentInspectedTimeMs) {
      activeItem.cardEls.forEach((c, i) => {
        if (c._progData && state.currentInspectedTimeMs >= c._progData.startMs && state.currentInspectedTimeMs < c._progData.endMs) {
          targetProgIdx = i;
        }
      });
    }

    if (targetProgIdx === -1) {
      activeItem.cardEls.forEach((c, i) => {
        if (c._progData && c._progData.isLiveNow) {
          targetProgIdx = i;
        }
      });
    }

    if (targetProgIdx === -1) targetProgIdx = 0;

    focusProgramCard(targetChannel, activeItem, targetProgIdx, scroll, smooth);
  }

  function focusProgramCard(channel, rowItem, progIdx, scroll = true, smooth = true) {
    if (!rowItem || rowItem.cardEls.length === 0) return;

    if (progIdx < 0) progIdx = 0;
    if (progIdx >= rowItem.cardEls.length) progIdx = rowItem.cardEls.length - 1;

    state.focusedProgIndex = progIdx;

    // Clear focused on all cards
    dom.epgChannelsRows.querySelectorAll(".epg-program-card.focused").forEach(c => c.classList.remove("focused"));

    const targetCard = rowItem.cardEls[progIdx];
    if (targetCard) {
      targetCard.classList.add("focused");

      if (targetCard._progData) {
        state.currentInspectedTimeMs = targetCard._progData.startMs + (targetCard._progData.endMs - targetCard._progData.startMs) / 2;

        if (scroll && dom.epgGridContainer) {
          const container = dom.epgGridContainer;
          const cardLeft = 320 + targetCard._progData.leftPx;
          const cardRight = cardLeft + targetCard._progData.widthPx;
          const viewLeft = container.scrollLeft + 320;
          const viewRight = container.scrollLeft + container.clientWidth - 40;

          if (cardLeft < viewLeft) {
            container.scrollTo({ left: Math.max(0, cardLeft - 350), behavior: smooth ? "smooth" : "auto" });
          } else if (cardRight > viewRight) {
            container.scrollTo({ left: cardRight - container.clientWidth + 80, behavior: smooth ? "smooth" : "auto" });
          }
        }

        updateInspectorWithShow(channel, targetCard._progData);
      }
    }
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
      dom.inspStatusPill.textContent = (show.isLiveNow || show.isLive) ? "● LIVE ACUM" : "● PROGRAMAT";
      dom.inspStatusPill.style.color = (show.isLiveNow || show.isLive) ? "var(--accent-emerald)" : "var(--text-muted)";
    }
    if (dom.inspTitle) dom.inspTitle.textContent = show.title;
    if (dom.inspTime) dom.inspTime.textContent = `${show.startTimeStr} - ${show.endTimeStr}`;
    if (dom.inspProgressText) {
      dom.inspProgressText.textContent = (show.isLiveNow || show.isLive)
        ? `A mai rămas: ${show.remainingMinutes || 25} min`
        : `Durată: ${show.durationMinutes} min`;
    }
    if (dom.inspDesc) dom.inspDesc.textContent = show.desc || ch.description;
  }

  // =========================================================================
  // 5. MEDIA STREAM ENGINE (DIRECT HLS, OFFICIAL STANDBY & YOUTUBE)
  // =========================================================================
  function playChannel(channel, showOsd = true) {
    if (!channel) return;
    state.currentChannel = channel;

    stopCurrentPlayback();

    // Check if channel is an official event stream currently in standby (offline)
    if (channel.isEventOnly && !channel.isLiveNow) {
      showEventStandbyScreen(channel);
    } else {
      hideEventStandbyScreen();
      if (channel.type === "hls") {
        playHls(channel);
      } else if (channel.type.startsWith("youtube")) {
        playYouTubeClean(channel);
      }
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

  function showEventStandbyScreen(channel) {
    if (!dom.eventStandbyScreen) return;

    if (dom.standbyBadge) {
      dom.standbyBadge.textContent = channel.logoText || "EVENT";
      dom.standbyBadge.style.background = channel.color || "#1e3a8a";
    }
    if (dom.standbyTitle) {
      dom.standbyTitle.textContent = channel.name;
    }
    if (dom.standbyPortal) {
      dom.standbyPortal.textContent = channel.portalDomain || "Transmisiune Oficială";
    }

    dom.eventStandbyScreen.classList.remove("hidden");
  }

  function hideEventStandbyScreen() {
    if (dom.eventStandbyScreen) {
      dom.eventStandbyScreen.classList.add("hidden");
    }
  }

  // Native & Hls.js Direct Stream Player with Subtitle Suppression
  function playHls(channel) {
    const url = channel.hlsUrl;
    dom.hlsVideo.style.display = "block";
    dom.hlsVideo.muted = false;
    state.isMuted = false;
    dom.unmutePrompt.style.display = "none";

    function disableTracks() {
      if (dom.hlsVideo.textTracks) {
        for (let i = 0; i < dom.hlsVideo.textTracks.length; i++) {
          try {
            dom.hlsVideo.textTracks[i].mode = "disabled";
          } catch (e) {}
        }
      }
    }

    if (typeof Hls !== "undefined" && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 45
      });
      state.hlsPlayer = hls;

      // Suppress subtitles in Hls.js
      hls.subtitleTrack = -1;

      hls.loadSource(url);
      hls.attachMedia(dom.hlsVideo);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        hls.subtitleTrack = -1;
        disableTracks();
        dom.hlsVideo.play().catch(err => {
          if (err.name === "NotAllowedError") {
            dom.hlsVideo.muted = true;
            state.isMuted = true;
            dom.unmutePrompt.style.display = "flex";
            dom.hlsVideo.play().catch(() => {});
          }
        });
      });

      hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, () => {
        hls.subtitleTrack = -1;
        disableTracks();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (dom.hlsVideo.canPlayType("application/vnd.apple.mpegurl")) {
      dom.hlsVideo.src = url;
      dom.hlsVideo.addEventListener("loadedmetadata", () => {
        disableTracks();
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

  // Clean YouTube Live Player (Active only for live broadcasts)
  function playYouTubeClean(channel) {
    dom.ytCropStage.style.display = "block";

    const videoId = channel.youtube?.videoId || "";
    let src = "";

    if (videoId) {
      src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1&disablekb=1&fs=0`;
    }

    if (src) {
      dom.ytPlayerTarget.innerHTML = `
        <iframe 
          src="${src}" 
          title="${channel.name}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `;
    }
  }

  function unlockAudio() {
    if (state.isMuted && dom.hlsVideo) {
      dom.hlsVideo.muted = false;
      state.isMuted = false;
      dom.unmutePrompt.style.display = "none";
    }
  }

  // =========================================================================
  // 6. TV GUIDE & 2-PRESS OK REMOTE LOGIC (INSTANT TRANSITIONS)
  // =========================================================================

  /**
   * Opens TV Guide overlay instantly without DOM re-building.
   * ALWAYS opens focused on the currently playing channel & live show!
   */
  function showGuide() {
    state.guideVisible = true;
    hideOsdBanner();

    // Ensure currently playing channel is visible in the active category
    if (state.currentChannel) {
      const visible = getVisibleChannels();
      const existsInCurrentCategory = visible.some(c => c.id === state.currentChannel.id);
      if (!existsInCurrentCategory) {
        selectCategory("all");
      }
    }

    refreshGuideState();
    dom.guideOverlay.classList.remove("hidden");

    // Center horizontal timeline on the LIVE time
    const now = new Date();
    const startHour = Math.max(0, now.getHours() - 1);
    const baseTimelineStartMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, 0, 0, 0).getTime();
    const PX_PER_MIN = EPG_DATA.PX_PER_MINUTE || 8;
    const nowOffset = ((now.getTime() - baseTimelineStartMs) / 60000) * PX_PER_MIN;
    if (dom.epgGridContainer) {
      dom.epgGridContainer.scrollLeft = Math.max(0, nowOffset - 300);
    }

    state.currentInspectedTimeMs = now.getTime();

    // Focus exactly the currently playing channel row and live show instantly
    if (state.currentChannel) {
      const visible = getVisibleChannels();
      const currIdx = visible.findIndex(c => c.id === state.currentChannel.id);
      focusChannelRow(currIdx !== -1 ? currIdx : 0, true, false);
    } else {
      focusChannelRow(0, true, false);
    }
  }

  function hideGuide(showOsd = false) {
    state.guideVisible = false;
    dom.guideOverlay.classList.add("hidden");
    unlockAudio();
    if (showOsd && state.currentChannel) {
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

  // Fullscreen Channel Zapping (Correct Polarity: Next = +1, Prev = -1)
  function switchChannelDelta(delta) {
    const channels = CHANNELS_DATA;
    let currIdx = channels.findIndex(c => c.id === state.currentChannel?.id);
    if (currIdx === -1) currIdx = 0;

    let nextIdx = (currIdx + delta + channels.length) % channels.length;
    playChannel(channels[nextIdx], true);
  }

  // =========================================================================
  // 7. LIVE EVENT POLLER & TOAST NOTIFICATION
  // =========================================================================
  function startLiveEventMonitor() {
    checkEventStreams();
    setInterval(checkEventStreams, 60000);
  }

  function checkEventStreams() {
    const eventChannels = CHANNELS_DATA.filter(c => c.isEventStream);

    eventChannels.forEach(ch => {
      if (ch.type.startsWith("youtube") && ch.youtube?.handle && ch.isEventOnly) {
        const liveCheckUrl = `https://www.youtube.com/${ch.youtube.handle}/live`;
        fetch(liveCheckUrl, { method: "GET", cache: "no-store" })
          .then(res => res.text())
          .then(html => {
            const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)["']/i);
            const isLiveBroadcast = html.includes('"isLive":true') || html.includes('"isLiveBroadcast":true');

            if (canonicalMatch && isLiveBroadcast) {
              const liveVideoId = canonicalMatch[1];
              ch.youtube.videoId = liveVideoId;
              setEventChannelLive(ch);
            } else {
              ch.isLiveNow = false;
              if (state.currentChannel?.id === ch.id) {
                showEventStandbyScreen(ch);
              }
            }
          })
          .catch(() => {});
      } else if (ch.type === "hls" && ch.isEventOnly) {
        fetch(ch.hlsUrl, { method: "HEAD", cache: "no-store" })
          .then(res => {
            if (res.ok) {
              setEventChannelLive(ch);
            } else {
              ch.isLiveNow = false;
            }
          })
          .catch(() => {
            ch.isLiveNow = false;
          });
      }
    });
  }

  function setEventChannelLive(channel) {
    channel.isLiveNow = true;

    // If already watching this channel, switch smoothly from standby to live stream
    if (state.currentChannel?.id === channel.id) {
      hideEventStandbyScreen();
      if (channel.type === "hls") {
        playHls(channel);
      } else if (channel.type.startsWith("youtube")) {
        playYouTubeClean(channel);
      }
      return;
    }

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

    if (dom.btnCloseGuide) {
      dom.btnCloseGuide.addEventListener("click", () => hideGuide(false));
    }
    if (dom.unmutePrompt) {
      dom.unmutePrompt.addEventListener("click", unlockAudio);
    }

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
   * 2-Press OK Remote Control Flow:
   * - 1st press: shows OSD Info Banner
   * - 2nd press (while OSD is visible): opens the TV Guide
   * - When in TV Guide: OK tunes to selected channel
   */
  function handleOkKeyPress() {
    // If Live Event Toast is showing, OK immediately tunes to it
    if (state.activeLiveEventChannel) {
      playChannel(state.activeLiveEventChannel, true);
      dismissLiveEventToast();
      return;
    }

    if (state.guideVisible) {
      const visible = getVisibleChannels();
      const targetChannel = visible[state.focusedRowIndex];
      if (targetChannel) {
        playChannel(targetChannel, true);
        hideGuide(false);
      }
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
        hideGuide(false);
      } else if (state.osdVisible) {
        hideOsdBanner();
      } else if (state.activeLiveEventChannel) {
        dismissLiveEventToast();
      }
      e.preventDefault();
      return;
    }

    // Normalized Remote Control Keys
    const isChannelUp = key === "ChannelUp" || key === "PageUp" || keyCode === 427 || keyCode === 33;
    const isChannelDown = key === "ChannelDown" || key === "PageDown" || keyCode === 428 || keyCode === 34;
    const isEnter = key === "Enter" || key === " " || keyCode === 13 || keyCode === 32;
    const isBlue = key === "b" || key === "B" || keyCode === 406;
    const isYellow = key === "y" || key === "Y" || keyCode === 405;
    const isRed = key === "r" || key === "R" || key === "f" || key === "F" || keyCode === 403;

    // =======================================================================
    // CASE A: IN TV GUIDE OVERLAY MODE
    // =======================================================================
    if (state.guideVisible) {
      if (isChannelDown) {
        focusChannelRow(state.focusedRowIndex + 5, true, true);
        e.preventDefault();
        return;
      }

      if (isChannelUp) {
        focusChannelRow(state.focusedRowIndex - 5, true, true);
        e.preventDefault();
        return;
      }

      if (key === "ArrowDown" || keyCode === 40) {
        focusChannelRow(state.focusedRowIndex + 1, true, true);
        e.preventDefault();
        return;
      }

      if (key === "ArrowUp" || keyCode === 38) {
        focusChannelRow(state.focusedRowIndex - 1, true, true);
        e.preventDefault();
        return;
      }

      if (key === "ArrowRight" || keyCode === 39) {
        const visible = getVisibleChannels();
        const activeCh = visible[state.focusedRowIndex];
        const activeItem = state.rowDomCache.find(item => item.channel.id === activeCh?.id);
        focusProgramCard(activeCh, activeItem, state.focusedProgIndex + 1, true, true);
        e.preventDefault();
        return;
      }

      if (key === "ArrowLeft" || keyCode === 37) {
        if (state.focusedProgIndex > 0) {
          const visible = getVisibleChannels();
          const activeCh = visible[state.focusedRowIndex];
          const activeItem = state.rowDomCache.find(item => item.channel.id === activeCh?.id);
          focusProgramCard(activeCh, activeItem, state.focusedProgIndex - 1, true, true);
        }
        e.preventDefault();
        return;
      }

      if (isEnter) {
        handleOkKeyPress();
        e.preventDefault();
        return;
      }

      if (isBlue) {
        cycleCategory(1);
        e.preventDefault();
        return;
      }

      if (isYellow) {
        cycleCategory(-1);
        e.preventDefault();
        return;
      }

      return;
    }

    // =======================================================================
    // CASE B: IN FULLSCREEN BROADCAST MODE
    // =======================================================================
    // 1. Samsung Physical Channel Rocker Up & ArrowUp -> NEXT CHANNEL (+1)
    if (isChannelUp || key === "ArrowUp" || keyCode === 38) {
      switchChannelDelta(1);
      e.preventDefault();
      return;
    }

    // 2. Samsung Physical Channel Rocker Down & ArrowDown -> PREVIOUS CHANNEL (-1)
    if (isChannelDown || key === "ArrowDown" || keyCode === 40) {
      switchChannelDelta(-1);
      e.preventDefault();
      return;
    }

    if (isEnter) {
      handleOkKeyPress();
      e.preventDefault();
      return;
    }

    // Direct Guide key on remotes
    if (key === "g" || key === "G") {
      showGuide();
      e.preventDefault();
      return;
    }

    // Fullscreen toggle (Red Button / F)
    if (isRed) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
      e.preventDefault();
      return;
    }

    // Numeric direct channel tuning (1 - 9)
    if (/^[1-9]$/.test(key)) {
      const numIdx = parseInt(key, 10) - 1;
      if (CHANNELS_DATA[numIdx]) {
        playChannel(CHANNELS_DATA[numIdx], true);
      }
      e.preventDefault();
    }
  }

  function cycleCategory(delta) {
    const cats = CATEGORIES;
    let curr = cats.findIndex(c => c.id === state.activeCategory);
    if (curr === -1) curr = 0;
    let next = (curr + delta + cats.length) % cats.length;
    selectCategory(cats[next].id);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
