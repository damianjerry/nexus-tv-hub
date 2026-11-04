/**
 * NEXUS TV HUB // Grilă Oficială Canale & Surse Verificate
 * Optimizat pentru Samsung The Frame (Tizen 6.5)
 * Fluxuri Directe CDN HLS & Transmisiuni Live Evenimente
 */

const CHANNELS_DATA = [
  // =========================================================================
  // 1. FILM, CINEMA & FICȚIUNE (filme)
  // =========================================================================
  {
    id: "cinemaraton",
    number: "01",
    name: "CineMaraton Plus HD",
    category: "filme",
    type: "hls",
    badge: "CINEMA ROMÂNESC",
    quality: "1080p HLS Direct",
    description: "Cele mai bune producții cinematografice românești clasice și contemporane, teatru și interviuri cu regizori.",
    hlsUrl: "https://hls02ns.antenaplay.ro/hls/cinemaraton-plus-hd/index.m3u8",
    logoText: "CMP",
    color: "#e11d48"
  },
  {
    id: "moviesphere",
    number: "02",
    name: "MovieSphere HD",
    category: "filme",
    type: "hls",
    badge: "HOLLYWOOD CINEMA",
    quality: "1080p HLS Direct",
    description: "Cinema hollywoodian și internațional: blockbustere Lionsgate, filme de acțiune, thrillere și drame de referință.",
    hlsUrl: "https://moviesphereuk-samsunguk.amagi.tv/playlist.m3u8",
    logoText: "MSPH",
    color: "#2563eb"
  },
  {
    id: "cinewow",
    number: "03",
    name: "CineWow SD",
    category: "filme",
    type: "hls",
    badge: "DIVERTIȘMENT & FILM",
    quality: "576p HLS Direct",
    description: "Comedii celebre, aventură și cinema pentru divertisment complet.",
    hlsUrl: "https://hls01ns.antenaplay.ro/hls/cinewow-sd/index.m3u8",
    logoText: "WOW",
    color: "#9333ea"
  },
  {
    id: "nostalgia",
    number: "04",
    name: "Nostalgia HD",
    category: "filme",
    type: "hls",
    badge: "CINEMA CLASIC",
    quality: "1080p HLS Direct",
    description: "Epoca de aur a cinematografiei: filme clasice nemuritoare, actori legendari și producții de patrimoniu.",
    hlsUrl: "https://hls02ns.antenaplay.ro/hls/nostalgia-hd/index.m3u8",
    logoText: "NOS",
    color: "#d97706"
  },
  {
    id: "artflix",
    number: "05",
    name: "ARTFLIX Movie Classics",
    category: "filme",
    type: "hls",
    badge: "CINEMA DE AUTOR & CULT",
    quality: "1080p HLS Direct",
    description: "Capodopere ale cinematografiei mondiale, filme cult independente, clasice restaurate și capodopere noir.",
    hlsUrl: "https://amogonetworx-artflix-1-nl.samsung.wurl.tv/playlist.m3u8",
    logoText: "AFLX",
    color: "#b45309"
  },

  // =========================================================================
  // 2. ISTORIE, NATURĂ, ȘTIINȚĂ & CULTURĂ (istorie)
  // =========================================================================
  {
    id: "true-history",
    number: "06",
    name: "True History",
    category: "istorie",
    type: "hls",
    badge: "ARHIVĂ & MEMORIE",
    quality: "1080p HLS Direct",
    description: "Documentare de arhivă, cronici necenzurate ale secolului XX și biografii ale marilor lideri mondiali.",
    hlsUrl: "https://linear-188.frequency.stream/dist/glewedtv/188/hls/master/playlist.m3u8",
    disableSubtitles: true,
    logoText: "TRUE",
    color: "#4b5563"
  },
  {
    id: "travel-mix",
    number: "07",
    name: "Travel Mix HD",
    category: "istorie",
    type: "hls",
    badge: "TURISM & TRADIȚII",
    quality: "1080p HLS Direct",
    description: "Destinații turistice de vis din România și Europa, gastronomie tradițională și itinerarii montane spectaculoase.",
    hlsUrl: "https://hls02ns.antenaplay.ro/hls/travel-mix-hd/index.m3u8",
    logoText: "TRAV",
    color: "#0284c7"
  },
  {
    id: "nhk-world",
    number: "08",
    name: "NHK World-Japan HD",
    category: "istorie",
    type: "hls",
    badge: "CULTURĂ & TEHNOLOGIE",
    quality: "1080p 60fps Master",
    description: "Știri, știință de avangardă, arhitectură și societate niponă 24/7 direct din Tokyo în limba engleză.",
    hlsUrl: "https://media-tyo.hls.nhkworld.jp/hls/w/live/master.m3u8",
    logoText: "NHK",
    color: "#dc2626"
  },
  {
    id: "arte",
    number: "09",
    name: "ARTE European Culture",
    category: "istorie",
    type: "hls",
    badge: "ARTĂ & CINEMA",
    quality: "1080p HLS Direct",
    description: "Canalul cultural franco-german de elită: filme europene de autor, concerte simfonice și documentare artistice.",
    hlsUrl: "https://dash4.antik.sk/live/test_arte_avc_25p/playlist.m3u8",
    logoText: "ARTE",
    color: "#ea580c"
  },
  {
    id: "dw-documentary",
    number: "10",
    name: "DW Documentary",
    category: "istorie",
    type: "hls",
    badge: "INVESTIGAȚII GLOBALE",
    quality: "1080p 50fps Master",
    description: "Investigații jurnalistice premiate internațional despre economie mondială, megaproiecte și societate (DW English).",
    hlsUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/master.m3u8",
    logoText: "DWD",
    color: "#0891b2"
  },

  // =========================================================================
  // 3. FINANȚE, BURSĂ & MACROECONOMIE (finante)
  // =========================================================================
  {
    id: "bloomberg-eu",
    number: "11",
    name: "Bloomberg Television Europe",
    category: "finante",
    type: "hls",
    badge: "BURSĂ & FINANȚE",
    quality: "1080p HLS Direct",
    description: "Piețe internaționale de capital, decizii FED/BCE, analize macroeconomice și mișcări bursiere în timp real.",
    hlsUrl: "https://www.bloomberg.com/media-manifest/streams/eu.m3u8",
    logoText: "BBG",
    color: "#ff8c00"
  },
  {
    id: "bloomberg-originals",
    number: "12",
    name: "Bloomberg Originals",
    category: "finante",
    type: "hls",
    badge: "TECH & INVESTIȚII",
    quality: "1080p HLS Direct",
    description: "Serii documentare originale Bloomberg despre giganți din tehnologie, capital de risc și lideri globali.",
    hlsUrl: "https://www.bloomberg.com/media-manifest/streams/qt.m3u8",
    logoText: "B-ORG",
    color: "#f59e0b"
  },
  {
    id: "bloomberg-politics",
    number: "13",
    name: "Bloomberg Politics",
    category: "finante",
    type: "hls",
    badge: "POLITICĂ ȘI PIEȚE",
    quality: "1080p HLS Direct",
    description: "Intersecția critică dintre politicile guvernamentale, alegeri globale și stabilitatea financiară a piețelor.",
    hlsUrl: "https://www.bloomberg.com/media-manifest/streams/politics.m3u8",
    logoText: "B-POL",
    color: "#d97706"
  },
  {
    id: "aleph-business",
    number: "14",
    name: "Aleph Business",
    category: "finante",
    type: "hls",
    badge: "BUSINESS ROMÂNIA",
    quality: "1080p HLS Direct",
    description: "Piața imobiliară, antreprenoriat, curs valutar BNR, companii de top și analize de piață din România.",
    hlsUrl: "https://streamw.m.ro/Aleph/ngrp:Alephbiz.stream_all/playlist.m3u8",
    logoText: "ABIZ",
    color: "#ea580c"
  },
  {
    id: "cna-business",
    number: "15",
    name: "CNA Asia & World Business",
    category: "finante",
    type: "hls",
    badge: "ASIA BUSINESS",
    quality: "1080p HLS Direct",
    description: "Piețe asiatice, lanțuri globale de aprovizionare, tehnologie și business geopolitic (Channel NewsAsia).",
    hlsUrl: "https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index.m3u8",
    logoText: "CNA",
    color: "#c0392b"
  },
  {
    id: "cheddar-news",
    number: "16",
    name: "Cheddar News",
    category: "finante",
    type: "hls",
    badge: "TECH & FINTECH",
    quality: "1080p HLS Direct",
    description: "Știri economice axate pe startup-uri, tehnologie de consum, crypto, Wall Street și tineri investitori.",
    hlsUrl: "https://hls.livecdn.io/cheddar.com/cheddar/playlist.m3u8",
    logoText: "CHED",
    color: "#10b981"
  },
  {
    id: "yahoo-finance",
    number: "17",
    name: "Yahoo Finance Live",
    category: "finante",
    type: "hls",
    badge: "WALL STREET",
    quality: "1080p HLS Direct",
    description: "Acoperire completă a clopoțelului de deschidere/închidere la NYSE, interviuri CEO, ETF-uri și acțiuni.",
    hlsUrl: "https://yahoo-samsung.amagi.tv/playlist.m3u8",
    disableSubtitles: true,
    logoText: "YF",
    color: "#6001d2"
  },

  // =========================================================================
  // 4. ȘTIRI INTERNAȚIONALE, GEOPOLITICĂ & JUSTIȚIE (stiri)
  // =========================================================================
  {
    id: "euronews-en",
    number: "18",
    name: "Euronews English",
    category: "stiri",
    type: "hls",
    badge: "BRUXELLES & UE",
    quality: "1080p HLS Direct",
    description: "Perspectivă pan-europeană: dezbateri la vârf, decizii la Bruxelles, afaceri externe și actualitate pe continent.",
    hlsUrl: "https://dash4.antik.sk/live/test_euronews/playlist.m3u8",
    logoText: "EN-EN",
    color: "#0284c7"
  },
  {
    id: "euronews-ro",
    number: "19",
    name: "Euronews România",
    category: "stiri",
    type: "hls",
    badge: "PERSPECTIVĂ UE",
    quality: "1080p HLS Direct",
    description: "Jurnalism echilibrat axat pe decizii europene, legislație, reforme instituționale și actualitate națională.",
    hlsUrl: "https://hls02ns.antenaplay.ro/hls/euronews-ro-sd/index.m3u8",
    logoText: "EN-RO",
    color: "#0072ce"
  },
  {
    id: "france24",
    number: "20",
    name: "France 24 English",
    category: "stiri",
    type: "hls",
    badge: "DIPLOMAȚIE",
    quality: "1080p HLS Direct",
    description: "Analize geopolitice profunde, crize internaționale și viziune europeană asupra afacerilor globale.",
    hlsUrl: "https://live.france24.com/hls/live/2037218-b/F24_EN_HI_HLS/master_5000.m3u8",
    logoText: "F24",
    color: "#0055a5"
  },
  {
    id: "dw-news",
    number: "21",
    name: "DW News (Deutsche Welle)",
    category: "stiri",
    type: "hls",
    badge: "ANALIZĂ GERMANIA",
    quality: "1080p HLS Direct",
    description: "Serviciul internațional german: investigații, tranziție energetică și politică europeană de vârf.",
    hlsUrl: "https://amg01644-amg01644c1-amgplt0343.playout.now3.amagi.tv/ts-eu-w1-n2/playlist/amg01644-amg01644c1-amgplt0343/playlist.m3u8",
    logoText: "DW",
    color: "#1877f2"
  },
  {
    id: "aljazeera",
    number: "22",
    name: "Al Jazeera English",
    category: "stiri",
    type: "hls",
    badge: "GLOBE & ASIA",
    quality: "1080p HLS Direct",
    description: "Perspectivă detaliată asupra Sudului Global, piețelor emergente și diplomației din Orientul Mijlociu.",
    hlsUrl: "https://live-hls-apps-aje-fa.getaj.net/AJE/index.m3u8",
    logoText: "AJE",
    color: "#d97706"
  },
  {
    id: "aleph-news",
    number: "23",
    name: "Aleph News",
    category: "stiri",
    type: "hls",
    badge: "ACTUALITATE 24/7",
    quality: "1080p HLS Direct",
    description: "Canalul de știri Aleph: actualitate dinamică, comentarii politice, tehnologie și sinteze de presă.",
    hlsUrl: "https://stream-aleph.m.ro/Aleph/ngrp:Alephnewsmain.stream_all/playlist.m3u8",
    logoText: "ANEWS",
    color: "#e11d48"
  },
  {
    id: "court-tv",
    number: "24",
    name: "Court TV",
    category: "stiri",
    type: "hls",
    badge: "JUSTIȚIE & TRIBUNALE",
    quality: "1080p HLS Direct",
    description: "Procese celebre în direct, analize judiciare detaliate și dezbateri juridice ale celor mai mari avocați.",
    hlsUrl: "https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg01438-ewscrippscompan-courttv-tablo/playlist.m3u8",
    logoText: "COURT",
    color: "#b91c1c"
  },
  {
    id: "un-web-tv",
    number: "25",
    name: "UN Web TV",
    category: "stiri",
    type: "hls",
    badge: "NAȚIUNILE UNITE",
    quality: "1080p HLS Direct",
    description: "Transmisiuni oficiale din Adunarea Generală a ONU, Consiliul de Securitate și conferințele de presă globale.",
    hlsUrl: "https://cdnapi.kaltura.com/p/2503451/sp/250345100/playManifest/entryId/1_gb6tjmle/protocol/https/format/applehttp/a.m3u8",
    logoText: "UN",
    color: "#0284c7"
  },
  {
    id: "sky-news",
    number: "26",
    name: "Sky News Australia & Fox News",
    category: "stiri",
    type: "hls",
    badge: "AUSTRALIA & GLOBAL",
    quality: "1080p HLS Direct",
    description: "Știri internaționale 24/7, dezbateri politice globale, preluări în direct Fox News SUA și analize din Pacific (Sky News Australia).",
    hlsUrl: "https://skynewsau-live-premium.akamaized.net/hls/live/2105299/skynews/live.m3u8",
    logoText: "SKY",
    color: "#e61b1b"
  },

  // =========================================================================
  // 5. ROMÂNIA & TELEVIZIUNI PUBLICE DE STAT (romania)
  // =========================================================================
  {
    id: "tvr-info",
    number: "27",
    name: "TVR Info HD",
    category: "romania",
    type: "hls",
    badge: "POST PUBLIC DE ȘTIRI",
    quality: "1080p HLS CDN",
    description: "Canalul de știri al Televiziunii Române: emisiuni economice, analize legislative și dezbateri publice echilibrate.",
    hlsUrl: "https://tvr-info.lg.mncdn.com/tvrinfo/smil:tvrinfo.smil/playlist.m3u8",
    logoText: "TVRi",
    color: "#2563eb"
  },
  {
    id: "tvr-1",
    number: "28",
    name: "TVR 1 HD",
    category: "romania",
    type: "hls",
    badge: "POST NAȚIONAL",
    quality: "1080p HLS CDN",
    description: "Canalul public principal: emisiuni de actualitate, anchete sociale, jurnalele principale și evenimente naționale.",
    hlsUrl: "https://tvr-1.lg.mncdn.com/tvr1/smil:tvr1.smil/playlist.m3u8",
    logoText: "TVR1",
    color: "#1d4ed8"
  },
  {
    id: "tvr-2",
    number: "29",
    name: "TVR 2 HD",
    category: "romania",
    type: "hls",
    badge: "EDUCAȚIE & FILM",
    quality: "1080p HLS CDN",
    description: "Magazin cultural, producții de teatru TV, film european de patrimoniu și documentare istorice.",
    hlsUrl: "https://tvr-2.lg.mncdn.com/tvr2/smil:tvr2.smil/playlist.m3u8",
    logoText: "TVR2",
    color: "#059669"
  },
  {
    id: "tvr-cultural",
    number: "30",
    name: "TVR Cultural HD",
    category: "romania",
    type: "hls",
    badge: "CINEMA DE AUTOR & ARTĂ",
    quality: "1080p HLS CDN",
    description: "Cinema de autor, dezbateri despre literatură, istorie, muzică clasică și patrimoniul cultural european.",
    hlsUrl: "https://tvr-cultural.lg.mncdn.com/tvrcultural/smil:tvrcultural.smil/playlist.m3u8",
    logoText: "TVRC",
    color: "#7c3aed"
  },
  {
    id: "digi24",
    number: "31",
    name: "Digi 24 HD",
    category: "romania",
    type: "hls",
    badge: "DIGI DIRECT CDN",
    quality: "1080p HLS Direct",
    description: "Fluxul live direct din rețeaua RCS & RDS (Digi România), cu actualitate economică și politică națională.",
    hlsUrl: "https://edge-ar.rcs-rds.ro/digi24ar/index.m3u8",
    logoText: "D24",
    color: "#0284c7"
  },

  // =========================================================================
  // 6. TRANSMISIUNI OFICIALE, EVENIMENTE & PLEN (evenimente)
  // =========================================================================
  {
    id: "ebs",
    number: "32",
    name: "EbS - Comisia Europeană",
    category: "evenimente",
    type: "hls",
    badge: "BRUXELLES DIRECT",
    quality: "1080p HLS Direct",
    isEventStream: true,
    is24h: true,
    description: "Europe by Satellite: conferințele de presă oficiale ale Comisiei Europene și deciziile Consiliului UE.",
    hlsUrl: "https://streams.prd.commavservices.eu/live/ebs/index.m3u8",
    logoText: "EbS",
    color: "#003399"
  },
  {
    id: "ebs-plus",
    number: "33",
    name: "EbS+ - Parlamentul European",
    category: "evenimente",
    type: "hls",
    badge: "LEGISLAȚIE UE",
    quality: "1080p HLS Direct",
    isEventStream: true,
    is24h: true,
    description: "Dezbaterile în plenul Parlamentului European de la Strasbourg/Bruxelles și audierile comisiilor parlamentare.",
    hlsUrl: "https://streams.prd.commavservices.eu/live/ebsplus/index.m3u8",
    logoText: "EbS+",
    color: "#0052cc"
  },
  {
    id: "bnr",
    number: "34",
    name: "Banca Națională a României",
    category: "evenimente",
    type: "youtube",
    badge: "BANCA CENTRALĂ",
    quality: "Evenimente Live",
    isEventStream: true,
    isEventOnly: true,
    description: "Conferințe de politică monetară, decizii de dobândă de referință și rapoarte trimestriale asupra inflației.",
    webPortal: "https://www.bnr.ro",
    portalDomain: "bnr.ro",
    youtube: {
      channelId: "UC9rLa4wmt-V_ozSV0Toj9Yg",
      handle: "@bnrro",
      liveUrl: "https://www.youtube.com/@bnrro/streams"
    },
    logoText: "BNR",
    color: "#b8860b"
  },
  {
    id: "cdep",
    number: "35",
    name: "Camera Deputaților (România)",
    category: "evenimente",
    type: "youtube",
    badge: "PARLAMENTUL ROMÂNIEI",
    quality: "Plen & Comisii Live",
    isEventStream: true,
    isEventOnly: true,
    description: "Transmisiunile oficiale din plenul Camerei Deputaților și din comisiile de buget-finanțe și juridice.",
    webPortal: "https://www.cdep.ro",
    portalDomain: "cdep.ro",
    youtube: {
      channelId: "UC7XoaKakuGfIHqclt962SqQ",
      handle: "@camdeputatilor",
      liveUrl: "https://www.youtube.com/@camdeputatilor/streams"
    },
    logoText: "CDEP",
    color: "#1e3a8a"
  },
  {
    id: "senat",
    number: "36",
    name: "Senatul României",
    category: "evenimente",
    type: "youtube",
    badge: "SENATUL ROMÂNIEI",
    quality: "Plen Oficial Live",
    isEventStream: true,
    isEventOnly: true,
    description: "Ședințele oficiale de plen ale Senatului României, dezbateri legislative și voturi pe legi organice.",
    webPortal: "https://www.senat.ro",
    portalDomain: "senat.ro",
    youtube: {
      channelId: "UCpZswGPkx4fBwaZ_U5scXDw",
      handle: "@SenatulRomaniei",
      liveUrl: "https://www.youtube.com/@SenatulRomaniei/streams"
    },
    logoText: "SEN",
    color: "#1e40af"
  },
  {
    id: "gov-ro",
    number: "37",
    name: "Guvernul României",
    category: "evenimente",
    type: "youtube",
    badge: "PALATUL VICTORIA",
    quality: "Briefinguri Live",
    isEventStream: true,
    isEventOnly: true,
    description: "Briefingurile oficiale după ședințele de guvern, conferințele ministerelor și ordonanțele de urgență.",
    webPortal: "https://gov.ro",
    portalDomain: "gov.ro",
    youtube: {
      channelId: "UCnlob-87h0ZKBEwel_Xiw5A",
      handle: "@guvernulromaniei",
      liveUrl: "https://www.youtube.com/@guvernulromaniei/streams"
    },
    logoText: "GOV",
    color: "#0369a1"
  }
];

const CATEGORIES = [
  { id: "all", label: "Toate Canalele", count: CHANNELS_DATA.length },
  { id: "filme", label: "Film & Cinema", count: CHANNELS_DATA.filter(c => c.category === "filme").length },
  { id: "istorie", label: "Istorie & Știință", count: CHANNELS_DATA.filter(c => c.category === "istorie").length },
  { id: "finante", label: "Finanțe & Business", count: CHANNELS_DATA.filter(c => c.category === "finante").length },
  { id: "stiri", label: "Știri & Geopolitică", count: CHANNELS_DATA.filter(c => c.category === "stiri").length },
  { id: "romania", label: "TVR & Naționale", count: CHANNELS_DATA.filter(c => c.category === "romania").length },
  { id: "evenimente", label: "Evenimente & Plen", count: CHANNELS_DATA.filter(c => c.category === "evenimente").length }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CHANNELS_DATA, CATEGORIES };
}
