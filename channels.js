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
    id: "viasat-epic-drama",
    number: "02",
    name: "Viasat Epic Drama",
    category: "filme",
    type: "hls",
    badge: "SERIALE DE EPOCĂ",
    quality: "1080p HLS Direct",
    description: "Drame de epocă, mister și producții istorice de televiziune la cel mai înalt nivel cinematografic european.",
    hlsUrl: "http://88.212.7.14/live/test_epic_drama_atk_tv/playlist.m3u8",
    logoText: "EPIC",
    color: "#b91c1c"
  },
  {
    id: "cinewow",
    number: "03",
    name: "CineWow SD",
    category: "filme",
    type: "hls",
    badge: "DIVERTIȘMENT & FILM",
    quality: "576p HLS Direct",
    description: "Blockbustere de acțiune, comedii celebre și cinema internațional pentru divertisment complet.",
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
    description: "Epoca de aur a cinematografiei: filme clasice nemuritoare, actori legendari și seriale de patrimoniu.",
    hlsUrl: "https://hls02ns.antenaplay.ro/hls/nostalgia-hd/index.m3u8",
    logoText: "NOS",
    color: "#d97706"
  },
  {
    id: "dust",
    number: "05",
    name: "DUST Sci-Fi",
    category: "filme",
    type: "hls",
    badge: "SCI-FI & VIITOR",
    quality: "1080p HLS Master",
    description: "Universul science-fiction: scurtmetraje SF inovatoare, viziuni futuriste și explorare tehnologică.",
    hlsUrl: "https://dqi7ayt2o24fn.cloudfront.net/playlist.m3u8",
    logoText: "DUST",
    color: "#2563eb"
  },

  // =========================================================================
  // 2. ISTORIE, NATURĂ, ȘTIINȚĂ & CULTURĂ (istorie)
  // =========================================================================
  {
    id: "history-channel",
    number: "06",
    name: "History Channel",
    category: "istorie",
    type: "hls",
    badge: "ISTORIE MONDIALĂ",
    quality: "1080p HLS Direct",
    description: "Documentare istorice majore, mistere ale civilizațiilor străvechi și evenimente care au schimbat omenirea.",
    hlsUrl: "http://88.212.7.14/live/test_history/playlist.m3u8",
    logoText: "HIST",
    color: "#b45309"
  },
  {
    id: "viasat-history",
    number: "07",
    name: "Viasat History",
    category: "istorie",
    type: "hls",
    badge: "DOCUMENTAR ISTORIC",
    quality: "1080p HLS Direct",
    description: "Războaie mondiale, mari monarhii europene, secrete diplomatice și descoperiri arheologice revoluționare.",
    hlsUrl: "http://88.212.7.14/live/test_viasat_history_atk_tv/playlist.m3u8",
    logoText: "VHIS",
    color: "#c2410c"
  },
  {
    id: "spektrum",
    number: "08",
    name: "Spektrum",
    category: "istorie",
    type: "hls",
    badge: "ȘTIINȚĂ & NATURĂ",
    quality: "1080p HLS Direct",
    description: "Știință aplicată, universul cosmic, megaproiecte tehnologice și cele mai spectaculoase habitate naturale.",
    hlsUrl: "http://88.212.7.14/live/test_spektrum/playlist.m3u8",
    logoText: "SPEK",
    color: "#059669"
  },
  {
    id: "true-history",
    number: "09",
    name: "True History",
    category: "istorie",
    type: "hls",
    badge: "ARHIVĂ & MEMORIE",
    quality: "1080p HLS Direct",
    description: "Documentare de arhivă, cronici necenzurate ale secolului XX și biografii ale marilor lideri mondiali.",
    hlsUrl: "https://linear-188.frequency.stream/dist/glewedtv/188/hls/master/playlist.m3u8",
    logoText: "TRUE",
    color: "#4b5563"
  },
  {
    id: "travel-mix",
    number: "10",
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
    number: "11",
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
    number: "12",
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
    number: "13",
    name: "DW Documentary",
    category: "istorie",
    type: "youtube",
    badge: "INVESTIGAȚII GLOBALE",
    quality: "1080p HD",
    description: "Investigații jurnalistice premiate internațional despre economie mondială, megaproiecte și societate.",
    youtube: {
      playlistId: "UUW39zufHfsuGgpLviKh297Q",
      videoId: "0ZDvKTJSpS4",
      channelId: "UCW39zufHfsuGgpLviKh297Q",
      handle: "@DWDocumentary",
      liveUrl: "https://www.youtube.com/@DWDocumentary/videos"
    },
    logoText: "DWD",
    color: "#0891b2"
  },

  // =========================================================================
  // 3. FINANȚE, BURSĂ & MACROECONOMIE (finante)
  // =========================================================================
  {
    id: "bloomberg-eu",
    number: "14",
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
    number: "15",
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
    number: "16",
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
    number: "17",
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
    number: "18",
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
    number: "19",
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
    number: "20",
    name: "Yahoo Finance Live",
    category: "finante",
    type: "hls",
    badge: "WALL STREET",
    quality: "1080p HLS Direct",
    description: "Acoperire completă a clopoțelului de deschidere/închidere la NYSE, interviuri CEO, ETF-uri și acțiuni.",
    hlsUrl: "https://yahoo-samsung.amagi.tv/playlist.m3u8",
    youtube: {
      videoId: "KQp-e_XQnDE",
      handle: "@YahooFinance",
      channelId: "UCEAZeUIeJs0IjQiqTCdVSIg"
    },
    logoText: "YF",
    color: "#6001d2"
  },

  // =========================================================================
  // 4. ȘTIRI INTERNAȚIONALE, GEOPOLITICĂ & JUSTIȚIE (stiri)
  // =========================================================================
  {
    id: "euronews-en",
    number: "21",
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
    number: "22",
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
    number: "23",
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
    number: "24",
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
    number: "25",
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
    number: "26",
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
    number: "27",
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
    number: "28",
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
    number: "29",
    name: "Sky News International",
    category: "stiri",
    type: "youtube",
    badge: "GLOBAL NEWS",
    quality: "1080p Live",
    description: "Știri internaționale 24/7, dezbateri diplomatice, politică externă și acoperire specială a crizelor globale.",
    youtube: {
      videoId: "YJTi7VnQXIs",
      handle: "@SkyNews",
      channelId: "UCoMdktPbSTixAyNGwb-UYkQ"
    },
    logoText: "SKY",
    color: "#e61b1b"
  },

  // =========================================================================
  // 5. ROMÂNIA & TELEVIZIUNI PUBLICE DE STAT (romania)
  // =========================================================================
  {
    id: "tvr-info",
    number: "30",
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
    number: "31",
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
    number: "32",
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
    number: "33",
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
    number: "34",
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
    number: "35",
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
    number: "36",
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
    number: "37",
    name: "Banca Națională a României",
    category: "evenimente",
    type: "youtube",
    badge: "BANCA CENTRALĂ",
    quality: "Evenimente Live",
    isEventStream: true,
    isEventOnly: true,
    description: "Conferințe de politică monetară, decizii de dobândă de referință și rapoarte trimestriale asupra inflației.",
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
    number: "38",
    name: "Camera Deputaților (România)",
    category: "evenimente",
    type: "youtube",
    badge: "PARLAMENTUL ROMÂNIEI",
    quality: "Plen & Comisii Live",
    isEventStream: true,
    isEventOnly: true,
    description: "Transmisiunile oficiale din plenul Camerei Deputaților și din comisiile de buget-finanțe și juridice.",
    youtube: {
      channelId: "UC7XoaKakuGfIHqclt962SqQ",
      handle: "@camdeputatilor",
      liveUrl: "https://www.youtube.com/@camdeputatilor/streams"
    },
    webPortal: "https://www.cdep.ro",
    logoText: "CDEP",
    color: "#1e3a8a"
  },
  {
    id: "senat",
    number: "39",
    name: "Senatul României",
    category: "evenimente",
    type: "youtube",
    badge: "SENATUL ROMÂNIEI",
    quality: "Plen Oficial Live",
    isEventStream: true,
    isEventOnly: true,
    description: "Ședințele oficiale de plen ale Senatului României, dezbateri legislative și voturi pe legi organice.",
    youtube: {
      channelId: "UCpZswGPkx4fBwaZ_U5scXDw",
      handle: "@SenatulRomaniei",
      liveUrl: "https://www.youtube.com/@SenatulRomaniei/streams"
    },
    webPortal: "https://www.senat.ro",
    logoText: "SEN",
    color: "#1e40af"
  },
  {
    id: "gov-ro",
    number: "40",
    name: "Guvernul României",
    category: "evenimente",
    type: "youtube",
    badge: "PALATUL VICTORIA",
    quality: "Briefinguri Live",
    isEventStream: true,
    isEventOnly: true,
    description: "Briefingurile oficiale după ședințele de guvern, conferințele ministerelor și ordonanțele de urgență.",
    youtube: {
      channelId: "UCnlob-87h0ZKBEwel_Xiw5A",
      handle: "@guvernulromaniei",
      liveUrl: "https://www.youtube.com/@guvernulromaniei/streams"
    },
    webPortal: "https://gov.ro",
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
