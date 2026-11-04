/**
 * NEXUS TV HUB // Dynamic Linear EPG Engine
 * Generates accurate 24-hour schedules with real Romanian & international TV guides.
 * Seamlessly integrates live scraped schedules and realistic fallbacks.
 * Fully compatible with Samsung The Frame (Tizen 6.5) & modern browsers.
 */

const EPG_DATA = (function () {
  "use strict";

  // Predefined realistic program templates for channels without raw scraped feeds
  const CHANNEL_TEMPLATES = {
    // 1. FILM, CINEMA & FICȚIUNE
    "moviesphere": [
      { t: "Lionsgate Action Theater: John Wick", d: 115, desc: "Fostul asasin legendar pornește într-o misiune implacabilă de răzbunare prin lumea interlopă din New York." },
      { t: "Cinematograful Zilei: The Hunger Games", d: 140, desc: "Katniss Everdeen luptă pentru supraviețuire în jocurile brutale ale Capitoliului din Panem." },
      { t: "Sci-Fi Dimension: Ender's Game", d: 110, desc: "Un tânăr genial este recrutat de Flota Internațională pentru a conduce bătălia decisivă a omenirii." },
      { t: "Crime Thriller: Sicario", d: 120, desc: "O agentă FBI idealistă este recrutată într-o operațiune secretă la granița violentă dintre SUA și Mexic." },
      { t: "Hollywood Classics: Reservoir Dogs", d: 100, desc: "Capodopera lui Quentin Tarantino despre un jaf de diamante care scapă de sub control." },
      { t: "Acțiune Non-Stop: The Expendables", d: 105, desc: "Echipa de mercenari de elită condusă de Barney Ross preia o misiune letală într-o republică bananieră." },
      { t: "Dramă de Aur: The Lincoln Lawyer", d: 120, desc: "Avocatul Mick Haller preia cazul unui playboy bogat din Beverly Hills acuzat de agresiune." }
    ],
    "artflix": [
      { t: "Cinema de Patrimoniu: M - Un oraș își caută ucigașul", d: 110, desc: "Capodopera cinematografică regizată de Fritz Lang în 1931, cap de serie al filmului noir mondial." },
      { t: "Clasici Nemuritori: Cetățeanul Kane", d: 119, desc: "Orson Welles revoluționează limbajul cinematografic printr-o investigație asupra vieții unui magnat de presă." },
      { t: "Cinema Noir: Bulevardul Amurgului (Sunset Boulevard)", d: 110, desc: "Billy Wilder explorează decăderea tragică a unei foste vedete a cinematografiei mute la Hollywood." },
      { t: "Capodopere Europene: Hoți de biciclete (Vittorio De Sica)", d: 90, desc: "Punctul culminant al neorealismului italian: căutarea disperată a unei biciclete pe străzile Romei." },
      { t: "Arta Suspansului: Fereastra din spate (Rear Window)", d: 112, desc: "Alfred Hitchcock regizează o capodoperă a voyeurismului și a tensiunii psihologice claustrofobice." },
      { t: "Cinema Cult: Cel de-al treilea om (The Third Man)", d: 104, desc: "Atmosferă expresionistă în Viena postbelică divizată între marile puteri aliate." }
    ],

    // 2. DOCUMENTAR & ȘTIINȚĂ
    "true-history": [
      { t: "Arhivele Secrete ale Războiului Rece", d: 60, desc: "Dosare declasificate KGB și CIA despre operațiunile secrete din Europa Centrală și Berlin." },
      { t: "Biografii de Conducători: Winston Churchill", d: 60, desc: "Discursurile și strategiile militare care au asigurat rezistența Marii Britanii în fața Blitz-ului." },
      { t: "Cronica Secolului XX: Căderea Zidului Berlinului", d: 60, desc: "Momentele istorice ale reunificării germane și prăbușirea blocului comunist în 1989." },
      { t: "Arme Care au Schimbat Istoria", d: 60, desc: "De la praful de pușcă la era nucleară: transformările tehnologice ale artei militare mondiale." },
      { t: "Misterele Descoperirilor: Bletchley Park", d: 60, desc: "Alan Turing și echipa de matematicieni britanici care a descifrat mesajele mașinii Enigma." }
    ],
    "nhk-world": [
      { t: "Newsline Asia: Daily World Update", d: 30, desc: "Comprehensive English-language coverage of political and economic news from Tokyo." },
      { t: "Direct Talk: Asian Innovators", d: 30, desc: "In-depth conversations with visionary entrepreneurs, scientists and artists in Asia." },
      { t: "Journeys in Japan: Sacred Trails", d: 30, desc: "Exploring ancient pilgrimage routes, mountain shrines and traditional craftsmanship." },
      { t: "Science View: Next-Gen Robotics", d: 30, desc: "Frontier humanoid robotics, quantum computing and regenerative medicine from Japan." },
      { t: "Core Kyoto: Architectural Harmony", d: 30, desc: "The timeless beauty of Kyoto's wooden temples, zen gardens and seasonal tea ceremonies." }
    ],
    "dw-documentary": [
      { t: "The Green Energy Transition: Europe's Power Grid", d: 45, desc: "How wind, solar, and cross-border HVDC interconnectors are rewiring continental Europe." },
      { t: "Global Inequality: Wealth Concentration in the Modern Age", d: 45, desc: "Investigative report on corporate capital flows, tax havens, and labor realities." },
      { t: "Artificial Intelligence & The Future of Human Knowledge", d: 50, desc: "Leading researchers examine safety, reasoning limits and industrial robotics." },
      { t: "Megacities: The Challenge of Sustainable Urban Mobility", d: 45, desc: "Infrastructure innovations addressing clean transit for 20 million residents." },
      { t: "Semiconductor Geopolitics: The Global Silicon Supply Chain", d: 45, desc: "Advanced lithography, rare earth processing, and economic sovereignty." }
    ],

    // 3. FINANȚE & BURSĂ
    "bloomberg-originals": [
      { t: "The Circuit with Emily Chang", d: 45, desc: "Exclusive access to pioneers building frontier artificial intelligence and space hardware." },
      { t: "Big Problems, Big Ideas: Fusion Power", d: 45, desc: "Can private magnetic confinement fusion companies achieve grid-scale net energy?" },
      { t: "Risk Takers: Founders of Silicon Valley", d: 45, desc: "Inside the seed rounds and existential moments of the most transformative tech giants." },
      { t: "The David Rubenstein Show: Peer-to-Peer", d: 30, desc: "High-level conversations with sovereign wealth fund managers and global CEOs." }
    ],
    "bloomberg-politics": [
      { t: "Balance of Power: Washington & Capitol Hill", d: 60, desc: "Federal debt negotiations, tariff implementations, and macroeconomic legislation." },
      { t: "Political Capital: Transatlantic Trade Alignments", d: 60, desc: "Critical regulatory shifts between the EU single market and the US Treasury." },
      { t: "Global Defense Spending & Sovereign Debt", d: 60, desc: "NATO budget allocations and capital market absorption of government bonds." }
    ],
    "aleph-business": [
      { t: "Bursa de Valori București: Indicele BET Live", d: 60, desc: "Volume de tranzacționare, acțiunile energetice (Hidroelectrica, OMV) și sistemul bancar." },
      { t: "Piața Imobiliară: Tendințe și Dobânzi Ipotecare", d: 60, desc: "Evoluția prețurilor rezidențiale, costul creditării bancare și marile dezvoltări comerciale." },
      { t: "Antreprenoriat & Tehnologie în România", d: 60, desc: "Start-up-uri românești inovatoare, finanțări venture capital și extindere internațională." },
      { t: "Analiza Macro: Inflație și Curs Valutar BNR", d: 60, desc: "Prognozele analiștilor pentru leul românesc, deciziile băncii centrale și deficitul bugetar." }
    ],
    "cna-business": [
      { t: "Asia First: Singapore Market Open", d: 60, desc: "Nikkei, Hang Seng and Straits Times opens, crude oil benchmarks and supply chain news." },
      { t: "Money Mind: Asian Emerging Wealth Strategies", d: 30, desc: "Asset allocation, real estate trusts and semiconductor investments across East Asia." },
      { t: "Insight: Global Advanced Lithography", d: 30, desc: "Strategic investments in clean rooms, equipment manufacturing and chip packaging." }
    ],
    "cheddar-news": [
      { t: "Opening Bell: Wall Street Tech & Indexes", d: 60, desc: "Nasdaq futures, mega-cap earnings reports, corporate guidance and pre-market movers." },
      { t: "Cheddar Closing Bell: Daily Trading Wrap", d: 60, desc: "Final bell at NYSE, bond yield adjustments, ETF flows and after-hours earnings." },
      { t: "The Weekly Pulse: Fintech & Digital Assets", d: 45, desc: "Modern payments infrastructure, blockchain rails and digital consumer banking." }
    ],
    "yahoo-finance": [
      { t: "Yahoo Finance Live: The Opening Bell", d: 90, desc: "Live bell-ringing at NYSE, live commentary on S&P 500 movers, sector rotations and jobs data." },
      { t: "The First Trade: Corporate Strategies & Earnings", d: 60, desc: "Live CEO interviews discussing quarterly results, capex investments, and headcount plans." },
      { t: "The Ticker: Real-Time Sector Analysis", d: 60, desc: "Deep dive into energy, semiconductors, financial institutions and consumer discretionary." },
      { t: "Yahoo Finance Live: The Closing Bell", d: 90, desc: "Live market wrap, closing bell countdown, index final settlements and after-hours movers." }
    ],

    // 4. ȘTIRI GLOBALE
    "dw-news": [
      { t: "DW News: Berlin Live Worldwide", d: 60, desc: "Global news bulletin from Berlin focusing on diplomacy, green industrial policy and democracy." },
      { t: "Conflict Zone: Hard-Hitting Global Interviews", d: 30, desc: "Tough questioning of foreign ministers, ambassadors and international policymakers." },
      { t: "The Day: Geopolitical Evening Analysis", d: 60, desc: "In-depth investigative wrap of European security and diplomatic alliances." }
    ],
    "aljazeera": [
      { t: "Al Jazeera News Hour: Doha Direct", d: 60, desc: "Comprehensive on-the-ground reporting from the Middle East, South Asia and Africa." },
      { t: "Inside Story: Geopolitical Debate", d: 30, desc: "Panel of regional experts dissecting treaties, energy corridors and diplomatic negotiations." },
      { t: "Counting the Cost: Emerging Economics", d: 30, desc: "Macroeconomic realities, debt burdens and trade opportunities across the Global South." }
    ],
    "court-tv": [
      { t: "Live Trials: High Profile Court Proceedings", d: 120, desc: "Gavel-to-gavel live courtroom coverage with experienced criminal trial attorneys." },
      { t: "Legal View with Vinnie Politan", d: 60, desc: "Deep breakdown of physical evidence, expert testimonies, and jury instructions." },
      { t: "Closing Arguments: Evidence Uncovered", d: 60, desc: "Strategic dissection of the most impactful prosecution and defense closing statements." }
    ],
    "un-web-tv": [
      { t: "UN General Assembly: Plenary Session Live", d: 120, desc: "Live statements from delegations in New York on global stability, sustainable goals and treaties." },
      { t: "UN Security Council: Formal Consultations", d: 90, desc: "Meeting of permanent and non-permanent members on international peace and security." },
      { t: "Daily Press Briefing: Spokesperson for the SG", d: 30, desc: "Humanitarian updates, peacekeeping operations, and climate summit resolutions." }
    ],
    "sky-news": [
      { t: "Sky News Breakfast: Westminster & Global Briefing", d: 90, desc: "UK politics, Downing Street statements, global market moves, and breaking international news." },
      { t: "The UK Tonight with Sarah-Jane Mee", d: 60, desc: "Insightful prime-time analysis of public services, economic data, and social trends." },
      { t: "Politics Hub with Sophy Ridge", d: 60, desc: "Direct interviews with cabinet ministers, treasury officials and foreign diplomats." },
      { t: "Sky News at Ten", d: 60, desc: "The definitive late evening news broadcast with live dispatches from around the world." }
    ],

    // 5. EVENIMENTE & PLEN
    "ebs": [
      { t: "European Commission Daily Midday Press Briefing", d: 60, desc: "Live spokesperson answers questions from the accredited international press corps in Brussels." },
      { t: "College of Commissioners Decisions: Executive Announcement", d: 60, desc: "Announcements regarding single market regulations, antitrust, and foreign policy directives." },
      { t: "EU Council of Ministers: Doorstep Statements", d: 45, desc: "Finance, energy and foreign ministers arrive outlining national priorities." }
    ],
    "ebs-plus": [
      { t: "European Parliament: Plenary Session Live (Strasbourg)", d: 120, desc: "Debates on legislative directives, voting on EU regulations, and parliamentary party speeches." },
      { t: "Committee on Economic & Monetary Affairs (ECON)", d: 90, desc: "Hearings with the ECB President and reviews of monetary and banking union frameworks." },
      { t: "European Parliament: Electronic Voting on Directives", d: 60, desc: "Roll-call voting on major European legislation and committee reports." }
    ],
    "bnr": [
      { t: "Conferință de Presă BNR: Decizia de Politică Monetară", d: 60, desc: "Guvernatorul Băncii Naționale prezintă decizia privind dobânda de referință și rezerva minimă obligatorie." },
      { t: "Raportul Trimestrial Asupra Inflației", d: 75, desc: "Prognoza BNR privind dinamica prețurilor de consum și riscurile macroeconomice pe termen mediu." },
      { t: "Briefing: Rezervele Internaționale ale României", d: 45, desc: "Evoluția rezervelor valutare și a rezervei de aur a țării la sfârșitul lunii." }
    ],
    "cdep": [
      { t: "Ședința de Plen a Camerei Deputaților: Dezbateri Legislative", d: 150, desc: "Dezbateri asupra proiectelor de lege, amendamente înaintate și discursuri ale deputaților." },
      { t: "Comisia pentru Buget, Finanțe și Bănci: Avize Tehnice", d: 90, desc: "Raport asupra rectificărilor bugetare, execuției cheltuielilor și facilităților fiscale." },
      { t: "Sesiunea de Vot Final pe Proiecte de Lege Organice", d: 60, desc: "Vot prin cartele electronice pe legile ajunse în faza de decizie finală a Parlamentului." }
    ],
    "senat": [
      { t: "Ședința Oficială de Plen a Senatului României", d: 150, desc: "Examinarea proiectelor de legi organice, acorduri internaționale și inițiative legislative." },
      { t: "Comisia Juridică, de Numiri și Imunități: Ședință de Lucru", d: 90, desc: "Avizarea codurilor legislative și audierea candidaților pentru funcții publice de autoritate." }
    ],
    "gov-ro": [
      { t: "Briefing Oficial după Ședința Guvernului României", d: 60, desc: "Purtătorul de cuvânt al Guvernului prezintă pachetul de hotărâri și ordonanțe de urgență adoptate." },
      { t: "Conferință de Presă la Palatul Victoria", d: 45, desc: "Miniștrii de linie explică măsurile economice, proiectele de infrastructură și sociale." }
    ]
  };

  /**
   * Helper: parses an HH:MM string into a millisecond timestamp on a given date.
   */
  function parseTimeToMs(timeStr, baseDate) {
    const parts = timeStr.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    return new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hours, minutes, 0, 0).getTime();
  }

  /**
   * Generates a complete, gapless 24-hour schedule for channelId.
   * Prioritizes REAL_EPG_SCHEDULES if present, and falls back seamlessly to CHANNEL_TEMPLATES.
   */
  function generateDaySchedule(channelId, date = new Date()) {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();

    // Check if real scraped EPG exists for this channel
    const realShows = (typeof REAL_EPG_SCHEDULES !== "undefined" && REAL_EPG_SCHEDULES[channelId]) || null;

    if (realShows && Array.isArray(realShows) && realShows.length > 0) {
      const schedule = [];
      const midnightMs = new Date(y, m, d, 0, 0, 0, 0).getTime();
      const endOfDayMs = new Date(y, m, d, 23, 59, 59, 999).getTime();

      // Convert raw real shows to structured timeline intervals
      let dayOffsetMs = 0;
      let prevRawMinutes = -1;

      for (let i = 0; i < realShows.length; i++) {
        const item = realShows[i];
        const [h, m] = item.time.split(":").map(n => parseInt(n, 10));
        const rawMinutes = h * 60 + m;

        if (prevRawMinutes !== -1 && rawMinutes < prevRawMinutes) {
          dayOffsetMs += 24 * 3600 * 1000;
        }
        prevRawMinutes = rawMinutes;

        const startMs = parseTimeToMs(item.time, date) + dayOffsetMs;

        // Determine endMs based on next item or default
        let endMs;
        if (i + 1 < realShows.length) {
          const nextItem = realShows[i + 1];
          const [nh, nm] = nextItem.time.split(":").map(n => parseInt(n, 10));
          const nextRawMinutes = nh * 60 + nm;
          const nextOffset = dayOffsetMs + (nextRawMinutes < rawMinutes ? 24 * 3600 * 1000 : 0);
          endMs = parseTimeToMs(nextItem.time, date) + nextOffset;
        } else {
          // Last show of the day
          endMs = startMs + 90 * 60 * 1000;
        }

        const durationMinutes = Math.max(15, Math.round((endMs - startMs) / 60000));
        const startDate = new Date(startMs);
        const endDate = new Date(endMs);

        schedule.push({
          id: `${channelId}-${startMs}`,
          channelId: channelId,
          title: item.title,
          desc: item.desc || `Program oficial transmis de ${channelId.toUpperCase()}`,
          durationMinutes: durationMinutes,
          startMs: startMs,
          endMs: endMs,
          startDate: startDate,
          endDate: endDate,
          startTimeStr: startDate.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }),
          endTimeStr: endDate.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }),
          timeSpanStr: `${startDate.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}`
        });
      }

      // Check if first show starts after midnight (e.g. at 07:25), fill gap (00:00 - first show)
      if (schedule.length > 0 && schedule[0].startMs > midnightMs) {
        const gapEndMs = schedule[0].startMs;
        const gapStartMs = midnightMs;
        const dur = Math.round((gapEndMs - gapStartMs) / 60000);
        const sD = new Date(gapStartMs);
        const eD = new Date(gapEndMs);
        schedule.unshift({
          id: `${channelId}-${gapStartMs}`,
          channelId: channelId,
          title: "Program Nocturn & Retrospectivă",
          desc: "Sinteze, documentare și reluări din arhiva de noapte a canalului.",
          durationMinutes: dur,
          startMs: gapStartMs,
          endMs: gapEndMs,
          startDate: sD,
          endDate: eD,
          startTimeStr: sD.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }),
          endTimeStr: eD.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }),
          timeSpanStr: `${sD.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })} - ${eD.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}`
        });
      }

      // Check if last show ends before next day, fill remainder of timeline
      if (schedule.length > 0) {
        const lastShow = schedule[schedule.length - 1];
        const nextMorningMs = midnightMs + 28 * 3600 * 1000;
        if (lastShow.endMs < nextMorningMs) {
          const gapStartMs = lastShow.endMs;
          const gapEndMs = nextMorningMs;
          const dur = Math.round((gapEndMs - gapStartMs) / 60000);
          const sD = new Date(gapStartMs);
          const eD = new Date(gapEndMs);
          schedule.push({
            id: `${channelId}-${gapStartMs}`,
            channelId: channelId,
            title: "Program Nocturn & Retrospectivă",
            desc: "Sinteze, documentare și reluări din arhiva de noapte a canalului.",
            durationMinutes: dur,
            startMs: gapStartMs,
            endMs: gapEndMs,
            startDate: sD,
            endDate: eD,
            startTimeStr: sD.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }),
            endTimeStr: eD.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }),
            timeSpanStr: `${sD.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })} - ${eD.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}`
          });
        }
      }

      return schedule;
    }

    // Fallback: Generate algorithmic schedule from CHANNEL_TEMPLATES
    const templates = CHANNEL_TEMPLATES[channelId] || [
      { t: "Transmisiune în Direct: Program Informativ", d: 60, desc: "Actualitate și emisiuni de sinteză transmise în direct." },
      { t: "Ediție Specială: Analiză & Perspective", d: 60, desc: "Dezbateri și opinii ale analiștilor independenți." },
      { t: "Documentar & Reportaje Explicate", d: 60, desc: "Investigații jurnalistice și teme de interes public." },
      { t: "Jurnalul Orei: Actualitatea la Minut", d: 60, desc: "Sinteza celor mai importante evenimente orare." }
    ];

    let cursor = new Date(y, m, d, 0, 0, 0, 0).getTime();
    const endOfDay = new Date(y, m, d, 23, 59, 59, 999).getTime();

    const schedule = [];
    const seed = (channelId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + d) % templates.length;
    let tIdx = seed;

    while (cursor <= endOfDay) {
      const t = templates[tIdx % templates.length];
      const startMs = cursor;
      const durationMs = t.d * 60 * 1000;
      const endMs = startMs + durationMs;

      const startDate = new Date(startMs);
      const endDate = new Date(endMs);

      const startTimeStr = startDate.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
      const endTimeStr = endDate.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });

      schedule.push({
        id: `${channelId}-${startMs}`,
        channelId: channelId,
        title: t.t,
        desc: t.desc,
        durationMinutes: t.d,
        startMs: startMs,
        endMs: endMs,
        startDate: startDate,
        endDate: endDate,
        startTimeStr: startTimeStr,
        endTimeStr: endTimeStr,
        timeSpanStr: `${startTimeStr} - ${endTimeStr}`
      });

      cursor = endMs;
      tIdx++;
    }

    return schedule;
  }

  // Get current active show for channel at a given timestamp
  function getCurrentShow(channelId, now = new Date()) {
    const schedule = generateDaySchedule(channelId, now);
    const nowMs = now.getTime();

    let current = schedule.find(s => nowMs >= s.startMs && nowMs < s.endMs);
    if (!current && schedule.length > 0) {
      current = schedule[schedule.length - 1];
    }

    if (current) {
      const elapsed = Math.max(0, nowMs - current.startMs);
      const total = Math.max(1, current.endMs - current.startMs);
      const progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
      const remainingMinutes = Math.max(0, Math.round((current.endMs - nowMs) / 60000));

      return {
        ...current,
        progressPercent: progressPercent,
        remainingMinutes: remainingMinutes,
        isLive: true
      };
    }

    return {
      title: "Transmisiune în Direct",
      desc: "Program curent în desfășurare",
      startTimeStr: "--:--",
      endTimeStr: "--:--",
      timeSpanStr: "În Direct",
      progressPercent: 50,
      remainingMinutes: 30,
      isLive: true
    };
  }

  // Get next upcoming show
  function getNextShow(channelId, now = new Date()) {
    const schedule = generateDaySchedule(channelId, now);
    const nowMs = now.getTime();

    const currIdx = schedule.findIndex(s => nowMs >= s.startMs && nowMs < s.endMs);
    if (currIdx !== -1 && currIdx + 1 < schedule.length) {
      return schedule[currIdx + 1];
    }

    return {
      title: "Urmează: Program de Noapte",
      desc: "Sinteze și reluări",
      startTimeStr: "00:00",
      endTimeStr: "06:00",
      timeSpanStr: "Urmează"
    };
  }

  const PX_PER_MINUTE = 8;
  const TIMELINE_HOURS = 24;

  // Generate time intervals for timeline headers (e.g. 30 min slices around current time)
  function getTimelineIntervals(now = new Date(), hoursAhead = TIMELINE_HOURS, intervalMinutes = 30) {
    const startHour = Math.max(0, now.getHours() - 1);
    const intervals = [];
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, 0, 0, 0);

    const totalSteps = (hoursAhead + 1) * (60 / intervalMinutes);
    for (let i = 0; i < totalSteps; i++) {
      const slotTime = new Date(base.getTime() + i * intervalMinutes * 60 * 1000);
      const timeStr = slotTime.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
      intervals.push({
        timeMs: slotTime.getTime(),
        timeStr: timeStr,
        isCurrentHour: slotTime.getHours() === now.getHours()
      });
    }

    return intervals;
  }

  // Get exactly the visible shows for the timeline viewport with coordinates
  function getVisibleShows(channelId, now = new Date()) {
    const startHour = Math.max(0, now.getHours() - 1);
    const baseTimelineStartMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, 0, 0, 0).getTime();
    const baseTimelineEndMs = baseTimelineStartMs + TIMELINE_HOURS * 3600 * 1000;

    const schedule = generateDaySchedule(channelId, now);
    const nowMs = now.getTime();

    const visible = schedule.filter(s => s.endMs > baseTimelineStartMs && s.startMs < baseTimelineEndMs);

    return visible.map(prog => {
      const visibleStartMs = Math.max(prog.startMs, baseTimelineStartMs);
      const visibleEndMs = Math.min(prog.endMs, baseTimelineEndMs);
      const leftPx = Math.round(((visibleStartMs - baseTimelineStartMs) / 60000) * PX_PER_MINUTE);
      const widthPx = Math.max(80, Math.round(((visibleEndMs - visibleStartMs) / 60000) * PX_PER_MINUTE) - 4);
      const isLiveNow = nowMs >= prog.startMs && nowMs < prog.endMs;

      let progressPercent = 0;
      let remainingMinutes = 0;
      if (isLiveNow) {
        const elapsed = Math.max(0, nowMs - prog.startMs);
        const total = Math.max(1, prog.endMs - prog.startMs);
        progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
        remainingMinutes = Math.max(0, Math.round((prog.endMs - nowMs) / 60000));
      }

      return {
        ...prog,
        leftPx,
        widthPx,
        isLiveNow,
        progressPercent,
        remainingMinutes
      };
    });
  }

  return {
    PX_PER_MINUTE,
    TIMELINE_HOURS,
    generateDaySchedule,
    getCurrentShow,
    getNextShow,
    getTimelineIntervals,
    getVisibleShows
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { EPG_DATA };
}
