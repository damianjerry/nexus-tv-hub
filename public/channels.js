/**
 * NEXUS TV HUB // Grilă Oficială Canale & Surse Verificate
 * Optimizat pentru Samsung The Frame (Tizen 6.5)
 * Fluxuri HLS Directe CDN (fără buffering, fără erori YouTube)
 */

const CHANNELS_DATA = [
  // =========================================================================
  // 1. FINANȚE, ECONOMIE & PIEȚE DE CAPITAL
  // =========================================================================
  {
    id: "bloomberg",
    number: "01",
    name: "Bloomberg Television",
    category: "finante",
    type: "hls",
    badge: "BURSĂ & FINANȚE",
    quality: "1080p HLS Direct",
    description: "Piețe internaționale de capital, earnings, decizii FED/BCE și analize macroeconomice în direct.",
    hlsUrl: "https://bloomberg.com/media-manifest/streams/eu.m3u8",
    logoText: "BBG",
    color: "#ff8c00"
  },
  {
    id: "cna-business",
    number: "02",
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
    id: "yahoo-finance",
    number: "03",
    name: "Yahoo Finance Live",
    category: "finante",
    type: "youtube",
    badge: "WALL STREET",
    quality: "1080p Live",
    description: "Acoperire completă clopoțel de deschidere/închidere la NYSE, interviuri CEO, ETF-uri și acțiuni.",
    youtube: {
      videoId: "KQp-e_XQnDE",
      handle: "@YahooFinance",
      channelId: "UCEAZeUIeJs0IjQiqTCdVSIg"
    },
    logoText: "YF",
    color: "#6001d2"
  },
  {
    id: "bnr",
    number: "04",
    name: "Banca Națională a României",
    category: "finante",
    type: "youtube",
    badge: "BANCA CENTRALĂ",
    quality: "Evenimente Live",
    description: "Conferințe de politică monetară, decizii de dobândă de referință și rapoarte trimestriale asupra inflației.",
    youtube: {
      channelId: "UC9rLa4wmt-V_ozSV0Toj9Yg",
      handle: "@bnrro",
      liveUrl: "https://www.youtube.com/@bnrro/streams"
    },
    logoText: "BNR",
    color: "#b8860b"
  },

  // =========================================================================
  // 2. ȘTIRI INTERNAȚIONALE & GEOPOLITICĂ
  // =========================================================================
  {
    id: "euronews-ro",
    number: "05",
    name: "Euronews România",
    category: "geopolitica",
    type: "hls",
    badge: "PERSPECTIVĂ UE",
    quality: "1080p HLS Direct",
    description: "Jurnalism echilibrat axat pe decizii europene, legislație și actualitate națională fără senzaționalism.",
    hlsUrl: "https://hls02ns.antenaplay.ro/hls/euronews-ro-sd/index.m3u8",
    logoText: "EN",
    color: "#0072ce"
  },
  {
    id: "france24",
    number: "06",
    name: "France 24 English",
    category: "geopolitica",
    type: "hls",
    badge: "DIPLOMAȚIE",
    quality: "1080p HLS Direct",
    description: "Analize geopolitice profunde, relații internaționale și viziune europeană asupra afacerilor globale.",
    hlsUrl: "https://live.france24.com/hls/live/2037218-b/F24_EN_HI_HLS/master_5000.m3u8",
    logoText: "F24",
    color: "#0055a5"
  },
  {
    id: "dw-news",
    number: "07",
    name: "DW News (Deutsche Welle)",
    category: "geopolitica",
    type: "hls",
    badge: "ANALIZĂ GERMANIA",
    quality: "1080p HLS Direct",
    description: "Serviciul public german de știri: investigații, tranziție energetică și politică europeană de vârf.",
    hlsUrl: "https://amg01644-amg01644c1-amgplt0343.playout.now3.amagi.tv/ts-eu-w1-n2/playlist/amg01644-amg01644c1-amgplt0343/playlist.m3u8",
    logoText: "DW",
    color: "#1877f2"
  },
  {
    id: "aljazeera",
    number: "08",
    name: "Al Jazeera English",
    category: "geopolitica",
    type: "hls",
    badge: "GLOBE & ASIA",
    quality: "1080p HLS Direct",
    description: "Perspectivă detaliată asupra Sudului Global, piețelor emergente și diplomației din Orientul Mijlociu.",
    hlsUrl: "https://live-hls-apps-aje-fa.getaj.net/AJE/index.m3u8",
    logoText: "AJE",
    color: "#d97706"
  },
  {
    id: "sky-news",
    number: "09",
    name: "Sky News International",
    category: "geopolitica",
    type: "youtube",
    badge: "GLOBAL NEWS",
    quality: "1080p Live",
    description: "Știri internaționale 24/7, dezbateri diplomatice, politică externă și acoperire specială a crizelor globale.",
    youtube: {
      videoId: "WUTDiO_fXdE",
      handle: "@SkyNews",
      channelId: "UCoMdktPbSTixAyNGwb-UYkQ"
    },
    logoText: "SKY",
    color: "#e61b1b"
  },

  // =========================================================================
  // 3. INSTITUȚII PUBLICE, ADMINISTRAȚIE & UE
  // =========================================================================
  {
    id: "ebs",
    number: "10",
    name: "EbS - Comisia Europeană",
    category: "administratie",
    type: "hls",
    badge: "BRUXELLES DIRECT",
    quality: "1080p HLS Direct",
    description: "Europe by Satellite: conferințele de presă oficiale ale Comisiei Europene și deciziile Consiliului UE.",
    hlsUrl: "https://streams.prd.commavservices.eu/live/ebs/index.m3u8",
    logoText: "EbS",
    color: "#003399"
  },
  {
    id: "ebs-plus",
    number: "11",
    name: "EbS+ - Parlamentul European",
    category: "administratie",
    type: "hls",
    badge: "LEGISLAȚIE UE",
    quality: "1080p HLS Direct",
    description: "Dezbaterile în plenul Parlamentului European de la Strasbourg/Bruxelles și audierile comisiilor parlamentare.",
    hlsUrl: "https://streams.prd.commavservices.eu/live/ebsplus/index.m3u8",
    logoText: "EbS+",
    color: "#0052cc"
  },
  {
    id: "cdep",
    number: "12",
    name: "Camera Deputaților (România)",
    category: "administratie",
    type: "youtube",
    badge: "PARLAMENTUL ROMÂNIEI",
    quality: "Plen & Comisii Live",
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
    number: "13",
    name: "Senatul României",
    category: "administratie",
    type: "youtube",
    badge: "SENATUL ROMÂNIEI",
    quality: "Plen Oficial Live",
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
    number: "14",
    name: "Guvernul României",
    category: "administratie",
    type: "youtube",
    badge: "PALATUL VICTORIA",
    quality: "Briefinguri Live",
    description: "Briefingurile oficiale după ședințele de guvern, conferințele ministerelor și ordonanțele de urgență.",
    youtube: {
      channelId: "UCnlob-87h0ZKBEwel_Xiw5A",
      handle: "@guvernulromaniei",
      liveUrl: "https://www.youtube.com/@guvernulromaniei/streams"
    },
    webPortal: "https://gov.ro",
    logoText: "GOV",
    color: "#0369a1"
  },

  // =========================================================================
  // 4. ROMÂNIA & TELEVIZIUNI NAȚIONALE DE STAT
  // =========================================================================
  {
    id: "tvr-info",
    number: "15",
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
    number: "16",
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
    number: "17",
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
    number: "18",
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
    number: "19",
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
  // 5. DOCUMENTARE, ȘTIINȚĂ, CULTURĂ & FILM
  // =========================================================================
  {
    id: "nhk-world",
    number: "20",
    name: "NHK World-Japan HD",
    category: "documentare",
    type: "hls",
    badge: "ȘTIINȚĂ & CULTURĂ",
    quality: "1080p 60fps Master",
    description: "24/7 în limba engleză direct de la Tokyo: documentare uimitoare despre tehnologie, arhitectură, știință și societate.",
    hlsUrl: "https://media-tyo.hls.nhkworld.jp/hls/w/live/master.m3u8",
    logoText: "NHK",
    color: "#dc2626"
  },
  {
    id: "arte",
    number: "21",
    name: "ARTE European Culture & Cinema",
    category: "documentare",
    type: "hls",
    badge: "CINEMA & CONCERTE",
    quality: "1080p HLS Direct",
    description: "Canalul cultural franco-german: documentare de patrimoniu, filme europene de autor, spectacole și concerte.",
    hlsUrl: "https://dash4.antik.sk/live/test_arte_avc_25p/playlist.m3u8",
    logoText: "ARTE",
    color: "#ea580c"
  },
  {
    id: "dw-documentary",
    number: "22",
    name: "DW Documentary",
    category: "documentare",
    type: "youtube",
    badge: "DOC INVESTIGAȚII",
    quality: "1080p HD",
    description: "Documentare premiate internațional despre macroeconomie, inegalități sociale, megaproiecte și geopolitică.",
    youtube: {
      channelId: "UCW39zufHfsuGgpLviKh297Q",
      handle: "@DWDocumentary",
      liveUrl: "https://www.youtube.com/@DWDocumentary/videos"
    },
    logoText: "DWD",
    color: "#0891b2"
  }
];

const CATEGORIES = [
  { id: "all", label: "Toate Canalele", count: CHANNELS_DATA.length },
  { id: "finante", label: "Finanțe & Burse", count: CHANNELS_DATA.filter(c => c.category === "finante").length },
  { id: "geopolitica", label: "Geopolitică & Știri", count: CHANNELS_DATA.filter(c => c.category === "geopolitica").length },
  { id: "administratie", label: "Instituții & UE", count: CHANNELS_DATA.filter(c => c.category === "administratie").length },
  { id: "romania", label: "TVR & Naționale", count: CHANNELS_DATA.filter(c => c.category === "romania").length },
  { id: "documentare", label: "Documentare & Artă", count: CHANNELS_DATA.filter(c => c.category === "documentare").length }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CHANNELS_DATA, CATEGORIES };
}
