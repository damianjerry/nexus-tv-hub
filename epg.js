/**
 * NEXUS TV HUB // Dynamic Linear EPG Engine
 * Generates accurate 24-hour schedules with live progress for all 40 channels.
 * Fully compatible with Samsung The Frame (Tizen 6.5) & standard browsers.
 */

const EPG_DATA = (function () {
  "use strict";

  // Predefined realistic program templates per channel
  const CHANNEL_TEMPLATES = {
    // 1. FILME & CINEMA
    "cinemaraton": [
      { t: "Cinema Românesc Matinal: Pistruiatul", d: 90, desc: "Episod clasic din îndrăgita serie românească de aventuri." },
      { t: "Actori de Legendă: Amza Pellea", d: 60, desc: "Portret documentar dedicat marelui actor român și rolurilor sale emblematice." },
      { t: "Filmul Zilei: Cu mâinile curate", d: 110, desc: "Comisarul Miclovan și comisarul Roman luptă împotriva criminalității din Bucureștiul postbelic." },
      { t: "Cinema Clasico: Nea Mărin Miliardar", d: 100, desc: "Comedie antologică regizată de Sergiu Nicolaescu cu Amza Pellea în rol dublu." },
      { t: "Capodopere Românești: Liceenii", d: 95, desc: "Povestea de dragoste și prietenie a unei generații de neuitat." },
      { t: "Filmul de Aur: Colierul de turcoaze", d: 105, desc: "Mărgelatu într-o nouă misiune spectaculoasă în Țara Românească." },
      { t: "Filmul Serii: De ce trag clopotele, Mitică?", d: 120, desc: "Capodopera satirică a lui Lucian Pintilie după schițele lui I.L. Caragiale." },
      { t: "Noaptea Albă a Scurtmetrajului Românesc", d: 90, desc: "Selectie de filme premiate la festivalurile internaționale de la Cannes și Berlin." },
      { t: "Arhiva Cinematografică Națională", d: 80, desc: "Secvențe de arhivă și jurnale de actualități din anii 1960-1980." }
    ],
    "viasat-epic-drama": [
      { t: "Inspectorul Murdoch: Enigme Victoriane", d: 60, desc: "Detectivul Murdoch rezolvă crime misterioase folosind tehnici științifice inovatoare." },
      { t: "Endeavour: Tânărul Morse", d: 90, desc: "Misterele universității Oxford investigate cu metodă și perspicacitate." },
      { t: "Domina: Ascensiunea Romei", d: 60, desc: "Livia Drusilla navighează intrigile sângeroase ale politicii romane imperiale." },
      { t: "Babylon Berlin: Umbrele Republicii", d: 60, desc: "Metropola berlineză din anii '20 sfâșiată de cabaret, corupție și extremism politic." },
      { t: "Poldark: Moștenirea din Cornwall", d: 60, desc: "Ross Poldark își reclădește viața și minele de cupru după războiul din America." },
      { t: "Viena Sângeroasă: Cabinetul Psihologic", d: 90, desc: "Doctorul Max Liebermann și inspectorul Oskar Rheinhardt investighează crime bizare în Viena anului 1900." },
      { t: "Peaky Blinders: Vremuri Grele", d: 60, desc: "Clanul Shelby își extinde imperiul industrial și conexiunile politice în Birmingham." },
      { t: "Das Boot: Odiseea Submarinului", d: 60, desc: "Tensiune claustrofobică și bătălii maritime nemiloase în adâncurile Atlanticului." }
    ],
    "cinewow": [
      { t: "Comedia Zilei: Încurcături la Paris", d: 90, desc: "Doi turiști neîndemânatici se trezesc în mijlocul unei licitații de artă clandestine." },
      { t: "Misiune de Grad Zero", d: 105, desc: "Un fost pilot de elită este rechemat pentru o misiune secretă de salvare." },
      { t: "Ultima Cursă: Viteza Supremă", d: 100, desc: "Curse ilegale pe străzile din Los Angeles și rivalități explozive." },
      { t: "Aventură Urbană: Orașul Nelegiuiților", d: 110, desc: "Acțiune non-stop într-un oraș controlat de carteluri rivale." },
      { t: "Agentul Sub Acoperire", d: 95, desc: "O infiltrare periculoasă într-o organizație de spionaj industrial." },
      { t: "Zonă de Risc: Confruntare la Graniță", d: 110, desc: "Forțele speciale intervin pentru a opri o amenințare majoră de securitate." }
    ],
    "nostalgia": [
      { t: "Mari Clasici: Casablanca", d: 105, desc: "Humphrey Bogart și Ingrid Bergman într-o poveste nemuritoare de sacrificiu și dragoste în vreme de război." },
      { t: "La Dolce Vita: Roma Nemuritoare", d: 120, desc: "Capodopera lui Federico Fellini despre iluziile și strălucirea Romei anilor '50." },
      { t: "Vacanță la Roma: Audrey Hepburn", d: 115, desc: "O prințesă rebelă scapă de protocol pentru o zi de neuitat alături de un ziarist american." },
      { t: "Șoimul Maltez: Cinema Noir", d: 100, desc: "Detectivul Sam Spade investighează moartea partenerului său și o statuetă misterioasă." },
      { t: "Marele Gatsby: Aurul Iluzoriu", d: 110, desc: "Luxul extravagant și secretele întunecate din Long Island din anii nebuni 1920." },
      { t: "Cinema de Aur: Pe aripile vântului (Partea I)", d: 120, desc: "Destine dramatice și pasiuni mistuitoare în Sudul american din timpul Războiului Civil." }
    ],
    "dust": [
      { t: "Chronos Paradox: Călătoria în Timp", d: 45, desc: "O echipă de cercetători descoperă un semnal recepționat din propriul lor viitor." },
      { t: "Deep Space Frontiers: Semnale din Vid", d: 60, desc: "O sondă automată trimisă dincolo de centura Kuiper detectează o structură artificială." },
      { t: "AI Rebellion: Dincolo de Cod", d: 50, desc: "Un algoritm de inteligență artificială conștient cere drepturi cetățenești." },
      { t: "Parallel Realities: Lumea Oglindită", d: 60, desc: "Fizicienii creează un portal către o versiune paralelă a Pământului." },
      { t: "Quantum Shift: Teleportarea", d: 55, desc: "Experimentul care a reușit să mute materie organică instantaneu." },
      { t: "Cybernetic Horizon 2049", d: 60, desc: "O metropolă neo-futuristă unde implanturile neuronale controlează memoria umană." }
    ],

    // 2. ISTORIE & DOCUMENTARE
    "history-channel": [
      { t: "Misterele Istoriei Antice: Piramidele", d: 60, desc: "Scanări LIDAR și analize geologice recente rescriu istoria construirii monumentelor din Giza." },
      { t: "Al Doilea Război Mondial: Arhiva Secretă", d: 60, desc: "Imagini color restaurate și decodificări secrete ale campaniilor de pe Frontul de Est." },
      { t: "Marii Faraoni ai Nilului: Tutankhamon", d: 60, desc: "Descoperirile senzaționale din Valea Regilor și comorile mormintelor regale." },
      { t: "Extratereștrii Antici: Tehnologia Străveche", d: 60, desc: "Ipoteze îndrăznețe despre artefacte avansate și cunoștințe astronomice milenare." },
      { t: "Castele și Cetăți Medievale ale Europei", d: 60, desc: "Ingineria militară a fortificațiilor și asediile legendare din Evul Mediu." },
      { t: "Războinici Legendari: Codul Samurailor", d: 60, desc: "Istoria castelor militare japoneze și onoarea armelor tăioase." }
    ],
    "viasat-history": [
      { t: "Imperiul Roman: Ascensiune și Cădere", d: 60, desc: "De la Republică la căderea Constantinopolului: strategiile politice și legiunile romane." },
      { t: "Bătălii Decisive ale Europei: Waterloo", d: 60, desc: "Cele 24 de ore în care s-a decis soarta împăratului Napoleon Bonaparte." },
      { t: "Geniile Renașterii: Leonardo da Vinci", d: 60, desc: "Caietele secrete de mecanică și anatomie ale celui mai strălucit polimat al istoriei." },
      { t: "Secretele Dinastiei Windsor", d: 60, desc: "Crize constituționale, abdicări și transformarea monarhiei britanice moderne." },
      { t: "Arheologia Modernă: Pompeii Reînviat", d: 60, desc: "Noi săpături dezvăluie fresce spectaculoase conservate sub cenușa Vezuviului." }
    ],
    "spektrum": [
      { t: "Universul Necunoscut: Găuri Negre", d: 60, desc: "Călătorie la marginea orizontului evenimentelor cu telescopul Event Horizon." },
      { t: "Megastructuri Inginerești: Baraje Gigantice", d: 60, desc: "Cum s-au construit cele mai ambițioase baraje hidroenergetice din lume." },
      { t: "Fauna Sălbatică a Carpaților", d: 60, desc: "Ecosistemul virgin al pădurilor românești: urșii bruni, lupii și râșii." },
      { t: "Tehnologia Viitorului: Fuziunea Nucleară", d: 60, desc: "Reactorul ITER și cursa științifică pentru producerea energiei curate a stelelor." },
      { t: "Ecosisteme Extreme: Adâncurile Oceanului", d: 60, desc: "Creaturi bioluminescente filmate la adâncimi de peste 8000 de metri." }
    ],
    "true-history": [
      { t: "Documentar Exclusiv: Războiul Rece", d: 60, desc: "Criza rachetelor din Cuba și jocul periculos de șah dintre Washington și Moscova." },
      { t: "Biografii de Conducători: Winston Churchill", d: 60, desc: "Discursurile și deciziile care au inspirat rezistența Marii Britanii în fața Blitz-ului." },
      { t: "Cronica Secolului XX: Căderea Zidului Berlinului", d: 60, desc: "Momentele emoționante ale reconcilierii germane din noiembrie 1989." },
      { t: "Arme Care au Schimbat Istoria", d: 60, desc: "De la praful de pușcă la bomba atomică: revoluțiile tehnologice ale războiului." },
      { t: "Spioni și Agenți Dubli: Enigma", d: 60, desc: "Alan Turing și echipa de la Bletchley Park care a spart codul secret al Wehrmacht-ului." }
    ],
    "travel-mix": [
      { t: "Descoperă România Turistică: Maramureș", d: 60, desc: "Biserici din lemn incluse în UNESCO, porți sculptate și meșteșugari autentici." },
      { t: "Munții Noștri: Trasee Nemarcate în Retezat", d: 60, desc: "Lacuri glaciare limpezi și creste spectaculoase străbătute pas cu pas." },
      { t: "Orașe Medievale: Sighișoara și Brașov", d: 60, desc: "Turnul cu Ceas, Biserica Neagră și legendele sașilor transilvăneni." },
      { t: "Gastronomie Tradițională & Povești Locale", d: 60, desc: "Rețete vechi culese din satele bucovinene și podgoriile Dealu Mare." },
      { t: "Delta Dunării: Paradisul Pelicanilor", d: 60, desc: "Canale neumblate, pădurea Letea și viața pescarilor lipoveni." }
    ],
    "nhk-world": [
      { t: "Newsline Asia: Daily World Update", d: 30, desc: "Comprehensive English-language coverage of political and economic news from Tokyo." },
      { t: "Direct Talk: Asian Innovators", d: 30, desc: "In-depth conversations with visionary entrepreneurs, scientists and artists in Asia." },
      { t: "Journeys in Japan: Sacred Trails", d: 30, desc: "Exploring ancient pilgrimage routes, mountain shrines and traditional onsens." },
      { t: "Science View: Next-Gen Robotics", d: 30, desc: "Cutting-edge humanoid robotics, quantum computing and regenerative medicine." },
      { t: "Core Kyoto: Architectural Harmony", d: 30, desc: "The timeless beauty of Kyoto's wooden temples, zen gardens and tearooms." },
      { t: "Tokyo Eye 2026: Metropolis Living", d: 30, desc: "Discovering urban trends, gastronomy and neighborhood culture in Tokyo." }
    ],
    "arte": [
      { t: "ARTE Journal: Actualitate Culturală Europeană", d: 30, desc: "Sinteză zilnică a evenimentelor artistice, teatrale și cinematografice din Europa." },
      { t: "Concert de Gală la Filarmonica din Paris", d: 90, desc: "Orchestra interpretează Simfonia a 9-a de Beethoven sub bagheta unor dirijori de elită." },
      { t: "Arta și Timpul: Marile Muzee ale Lumii", d: 60, desc: "Tur exclusiv prin galeriile de pictură ale Luvrului, Uffizi și Prado." },
      { t: "Cinema European: Capodopere de Festival", d: 105, desc: "Film de autor laureat la marile festivaluri de film de la Cannes și Veneția." },
      { t: "Documentar de Patrimoniu: Restaurarea Notre-Dame", d: 60, desc: "Munca titanică a arhitecților și dulgherilor pentru renașterea catedralei din Paris." }
    ],
    "dw-documentary": [
      { t: "Global Inequality: The New Economy", d: 45, desc: "An investigative look into wealth concentration and modern economic shifts." },
      { t: "The Green Energy Transition: Europe's Grid", d: 45, desc: "How wind, solar, and interconnectors are rewiring the continental energy map." },
      { t: "Megacities in Asia: Urban Challenges", d: 50, desc: "Infrastructure, mobility and sustainability in cities of over 20 million people." },
      { t: "Artificial Intelligence & Humanity's Choice", d: 60, desc: "Ethical boundaries and labor disruptions in the era of frontier AI models." },
      { t: "Global Supply Chain Disruptions", d: 45, desc: "Semiconductors, rare minerals and the geopolitics of container shipping." }
    ],

    // 3. FINANȚE & BUSINESS
    "bloomberg-eu": [
      { t: "Daybreak Europe: Market Open", d: 60, desc: "Early market setups, FTSE and DAX futures, bond yields and currency movements." },
      { t: "Bloomberg Surveillance: European Markets", d: 120, desc: "Tom Keene and team dissect global economic data, inflation prints, and ECB rate projections." },
      { t: "Bloomberg Markets: European Close", d: 90, desc: "Trading action, stock winners and losers, European corporate earnings and commodity wraps." },
      { t: "The Pulse with Francine Lacqua", d: 60, desc: "Interviews with corporate leaders, central bankers, and top European policymakers." },
      { t: "Balance of Power: Transatlantic Economics", d: 60, desc: "Examining policy intersections between Brussels, London, and Washington." },
      { t: "Bloomberg Technology: AI & Silicon", d: 60, desc: "Focus on AI hardware, cloud infrastructure, venture funding and chipmakers." },
      { t: "Bloomberg Wealth: Global Portfolios", d: 60, desc: "Strategic asset allocation, private equity trends and high-net-worth investments." }
    ],
    "bloomberg-originals": [
      { t: "The Circuit with Emily Chang", d: 45, desc: "Exclusive behind-the-scenes access to founders shaping tech, AI and space travel." },
      { t: "Big Problems, Big Ideas: Fusion Energy", d: 45, desc: "Can next-generation fusion reactors solve the global clean energy puzzle?" },
      { t: "Risk Takers: Venture Capital Pioneers", d: 45, desc: "How iconic venture firms backed the biggest transformative companies of our time." },
      { t: "The David Rubenstein Show: Peer-to-Peer", d: 30, desc: "Conversations with the most influential business and governmental leaders." },
      { t: "Bloomberg Investigates: Supply Chain Heists", d: 45, desc: "In-depth investigative reports uncovering illicit financial networks." }
    ],
    "bloomberg-politics": [
      { t: "Balance of Power: Policy & Capitol Hill", d: 60, desc: "Congressional budget negotiations, federal debt ceilings, and tax policies." },
      { t: "Political Capital: Trade Wars & Treaties", d: 60, desc: "Tariffs, trade deals and diplomatic alignments reshaping world trade routes." },
      { t: "Global Policy Briefing: Defense Spending", d: 60, desc: "NATO budgets, defense procurement and the economics of military deterrence." },
      { t: "Elections & Economic Turmoil", d: 60, desc: "How national elections across the G20 affect market volatility and sovereign bonds." }
    ],
    "aleph-business": [
      { t: "Bursa Românească Live: Deschiderea BVB", d: 60, desc: "Indicele BET, acțiunile bancare și energetice, volume de tranzacționare la București." },
      { t: "Piața Imobiliară: Prețuri și Tendințe", d: 60, desc: "Evoluția dobânzilor la credite ipotecare, noile dezvoltări rezidențiale și comerciale." },
      { t: "Start-up & Tech România", d: 60, desc: "Fondatori români de tehnologie care atrag finanțări seed și scalare internațională." },
      { t: "Analiza Macro: Inflație și Curs Valutar", d: 60, desc: "Prognozele analiștilor pentru leul românesc, deciziile BNR și deficitul bugetar." },
      { t: "Dialog cu Antreprenorii Zilei", d: 60, desc: "Povești de succes din agricultura modernă, IT, producție și servicii în România." }
    ],
    "cna-business": [
      { t: "Asia First: Market Open Singapore", d: 60, desc: "Nikkei, Hang Seng and Straits Times opens, oil benchmarks and tech supplier news." },
      { t: "Money Mind: Personal Wealth & Equities", d: 30, desc: "Investment strategies across Asian emerging markets and blue-chip dividend stocks." },
      { t: "Insight: Global Semiconductor Battle", d: 30, desc: "Taiwan, South Korea and Japan's investments in advanced lithography and chips." },
      { t: "East Asia Tonight: Geopolitics & Trade", d: 60, desc: "Comprehensive evening news wrap of Asian economic diplomacy and domestic policies." }
    ],
    "cheddar-news": [
      { t: "Opening Bell: Wall Street Tech", d: 60, desc: "Nasdaq futures, mega-cap tech earnings, retail investor momentum and crypto." },
      { t: "Cheddar Closing Bell: Daily Recap", d: 60, desc: "Final bell at NYSE, closing numbers, ETF flows and after-hours market movers." },
      { t: "Tech & Innovation Today: AI Gadgets", d: 45, desc: "Latest consumer technology releases, EV innovations, and smart home ecosystems." },
      { t: "The Weekly Pulse: Fintech Pioneers", d: 45, desc: "Digital banking, automated investing apps, and alternative payment rails." }
    ],
    "yahoo-finance": [
      { t: "Yahoo Finance Live: Opening Bell", d: 90, desc: "Opening bell ceremony at NYSE, live commentary on S&P 500 movers and earnings." },
      { t: "The First Trade: Corporate Strategies", d: 60, desc: "CEO interviews discussing quarterly results, capex plans, and workforce shifts." },
      { t: "The Ticker: Market Movers & Sector Trends", d: 60, desc: "Deep dive into energy, semiconductors, healthcare and consumer cyclical sectors." },
      { t: "Yahoo Finance Live: The Closing Bell", d: 90, desc: "Comprehensive final hour trading, closing bell, and post-market reactions." }
    ],

    // 4. ȘTIRI & GEOPOLITICĂ
    "euronews-en": [
      { t: "Euronews Now: Continental Morning", d: 60, desc: "Pan-European breaking news, diplomatic developments, and weather radar." },
      { t: "Brussels, My Love?: EU Policy Debate", d: 60, desc: "MEPs and political analysts clash over European regulation, migration and energy." },
      { t: "Euronews Tonight: World Affairs", d: 60, desc: "In-depth reporting from correspondents in Kyiv, Paris, Berlin, Rome and London." },
      { t: "The Global Conversation: Key Interviews", d: 30, desc: "Straight-talking interviews with prime ministers, commissioners and diplomats." },
      { t: "Europe Weekly: Decisions in Strasbourg", d: 30, desc: "Key legislative decisions impacting European consumers, data privacy and businesses." }
    ],
    "euronews-ro": [
      { t: "Euronews România: Ora Exactă", d: 60, desc: "Jurnal de știri matinal, trafic național, starea vremii și actualitate națională." },
      { t: "Euronews Special: Decizii la București", d: 60, desc: "Dezbateri privind pachetele legislative, infrastructura și fondurile europene PNRR." },
      { t: "Vocile Europei: Legislație și Justiție", d: 60, desc: "Cum influențează directivele europene viața de zi cu zi a cetățenilor români." },
      { t: "Jurnalul Principal Euronews România", d: 60, desc: "Cele mai importante știri ale zilei prezentate cu echilibru și rigoare profesională." }
    ],
    "france24": [
      { t: "France 24 Live: Paris Edition", d: 60, desc: "International news 24/7 with a distinct European and diplomatic perspective." },
      { t: "The Debate: Global Flashpoints", d: 60, desc: "Four international experts analyze conflict zones, peace treaties, and sanctions." },
      { t: "Eye on the Americas & Africa", d: 30, desc: "Deep coverage of political dynamics, environmental stories and cultural movements." },
      { t: "The Business Interview", d: 30, desc: "Leaders in aviation, renewable energy, luxury and technology take tough questions." }
    ],
    "dw-news": [
      { t: "DW News: Berlin Live", d: 60, desc: "Global news bulletin from Berlin focusing on human rights, climate and democracy." },
      { t: "Conflict Zone: Hard-Hitting Interviews", d: 30, desc: "Tough questioning of heads of state, opposition leaders, and international figures." },
      { t: "The Day: Geopolitical Analysis", d: 60, desc: "Comprehensive evening wrap of world events with expert live contributions." },
      { t: "Business Beyond: Economic Transitions", d: 30, desc: "Alternative economic models, circular economy, and green industrial policies." }
    ],
    "aljazeera": [
      { t: "Al Jazeera News Hour: Doha Direct", d: 60, desc: "Unrivaled grassroots coverage from the Middle East, South Asia, Africa and beyond." },
      { t: "Inside Story: Middle East Analysis", d: 30, desc: "Roundtable discussion dissecting regional diplomacy and conflict resolutions." },
      { t: "Counting the Cost: Developing World Economics", d: 30, desc: "Macroeconomic realities, debt burdens and trade opportunities in the Global South." },
      { t: "The Stream: Social Discourse & Online Debates", d: 30, desc: "A participatory daily show highlighting citizen journalism and viral topics." }
    ],
    "aleph-news": [
      { t: "Aleph News: Știrile Zilei", d: 60, desc: "Jurnale rapide de actualitate, noutăți din tehnologie, business și societate." },
      { t: "Gândurile lui Cristoiu: Sinteza Zilei", d: 60, desc: "Analiză politică incisivă a principalelor evenimente ale scenei publice românești." },
      { t: "Interviul Zilei: Politică & Decizii", d: 60, desc: "Dialoguri fără menajamente cu oameni politici, judecători și oameni de cultură." },
      { t: "Marius Tucă Show: Ediție Specială", d: 90, desc: "Talk-show de referință cu dezbateri aprinse despre marile teme ale României." }
    ],
    "court-tv": [
      { t: "Live Trials: High Profile Proceedings", d: 120, desc: "Gavel-to-gavel live courtroom coverage with experienced criminal trial lawyers." },
      { t: "Legal View with Vinnie Politan", d: 60, desc: "Breakdown of evidentiary rulings, witness testimonies, and jury dynamics." },
      { t: "Closing Arguments: Evidence Uncovered", d: 60, desc: "Analysis of the most dramatic prosecution and defense closing statements." },
      { t: "Judgment with Ashleigh Banfield", d: 60, desc: "Retrospective examination of historic cases that changed American legal history." }
    ],
    "un-web-tv": [
      { t: "UN General Assembly: Plenary Session", d: 120, desc: "Live coverage of statements by world leaders and resolutions debated in New York." },
      { t: "Security Council Briefing: Peace & Security", d: 90, desc: "Formal meetings, consultations and votes on global conflict prevention." },
      { t: "Press Briefing: Spokesperson for the SG", d: 30, desc: "Daily briefing on humanitarian missions, peace operations and climate initiatives." },
      { t: "Economic & Social Council Forum", d: 60, desc: "Dialogues on sustainable development goals, global health, and human rights." }
    ],
    "sky-news": [
      { t: "Sky News Breakfast: Westminster Briefing", d: 90, desc: "UK politics, Downing Street statements, global markets, and breaking domestic news." },
      { t: "The UK Tonight with Sarah-Jane Mee", d: 60, desc: "Insightful evening coverage of social issues, public services, and cultural stories." },
      { t: "Politics Hub with Sophy Ridge", d: 60, desc: "Tough interviews with cabinet ministers, shadow spokespeople, and commentators." },
      { t: "Sky News at Ten", d: 60, desc: "The definitive late evening news broadcast with correspondents around the globe." }
    ],

    // 5. ROMÂNIA & TELEVIZIUNI PUBLICE
    "tvr-info": [
      { t: "Info Plus: Matinal Informativ", d: 60, desc: "Jurnale orare, revista presei, meteo și informații de utilitate publică." },
      { t: "Ediție Specială: Economie și Buget", d: 60, desc: "Analiza deciziilor financiare guvernamentale, taxe, impozite și investiții publice." },
      { t: "Banii Tăi: Ghid de Educație Financiară", d: 45, desc: "Cum să-ți administrezi economiile, creditele și planurile de pensie privată." },
      { t: "Tema Zilei: Dialog cu Decidenții", d: 60, desc: "Miniștri și experți independenți răspund problemelor stringente ale societății." },
      { t: "Telejurnal TVR Info", d: 60, desc: "Jurnal complet de știri cu transmisii în direct din toate colțurile țării." },
      { t: "Prim-Plan: Anchetele TVR Info", d: 45, desc: "Jurnalism de investigație asupra achizițiilor publice și protecției mediului." }
    ],
    "tvr-1": [
      { t: "Telejurnal Matinal TVR 1", d: 90, desc: "Actualitatea primei părți a zilei, transmisiuni speciale din teritoriu și meteo." },
      { t: "România 9: Dezbaterea Zilei", d: 60, desc: "Talk-show politic și social despre cele mai aprinse subiecte de dezbatere publică." },
      { t: "Dosar România: Reportaje de Autor", d: 60, desc: "Poveștile nevăzute ale românilor obisnuiți, drame sociale și destine curajoase." },
      { t: "Orizonturi Rurale: Satul Românesc", d: 45, desc: "Tradiții, agricultură modernă, fonduri europene pentru fermieri și comunități locale." },
      { t: "Telejurnalul Principal TVR 1 (Ora 20:00)", d: 60, desc: "Jurnalul de referință al televiziunii publice: rigoare, neutralitate și context." },
      { t: "Filmul Zilei: Cinema de Patrimoniu", d: 110, desc: "Producții cinematografice românești și europene premiate internațional." }
    ],
    "tvr-2": [
      { t: "Cultura în Direct: Magazin Cultural", d: 60, desc: "Expoziții de artă plastică, noutăți editoriale, premiere teatrale și concerte." },
      { t: "Teatru TV: Arhiva de Aur a Teatrului Național", d: 90, desc: "Spectacole antologice de teatru românesc cu actori din generația de aur." },
      { t: "Documentare TVR: România Neștiută", d: 60, desc: "Zone carstice spectaculoase, monumente istorice uitate și oameni cu meșteșuguri rare." },
      { t: "Filmul de Artă: Capodopere Europene", d: 105, desc: "Cinematografie rafinată din Franța, Italia, Spania și Scandinavia." },
      { t: "Natura și Oamenii", d: 45, desc: "Descoperirea rezervațiilor biosferei și inițiativelor ecologice din România." }
    ],
    "tvr-cultural": [
      { t: "Jurnal Cultural: Noutăți & Evenimente", d: 45, desc: "Agenda zilnică a festivalurilor de film, muzică clasică, bienale și bienale de artă." },
      { t: "Maeștrii Scenei: Dialoguri Nemuritoare", d: 60, desc: "Interviuri exhaustive cu dramaturgi, actori, scenografi și compozitori români." },
      { t: "Arte Vizuale & Patrimoniu Muzeal", d: 45, desc: "Restaurarea capodoperelor de pictură și sculptură din marile muzee din țară." },
      { t: "Mari Scriitori Români în Dialog", d: 60, desc: "Dezbateri despre literatura clasică și noile apariții editoriale premiate." },
      { t: "Concert Simfonic: Orchestra Națională Radio", d: 90, desc: "Partituri celebre de Enescu, Ceaikovski, Mozart și Brahms în direct de la Sala Radio." }
    ],
    "digi24": [
      { t: "Știrile Dimineții Digi 24", d: 90, desc: "Pachete complete de știri, sinteze politice, bursa și actualitate rutieră." },
      { t: "Jurnal Economic: Cursul Leului și BVB", d: 30, desc: "Cum evoluează inflația, creditele bancare, prețul combustibililor și indicii bursieri." },
      { t: "Business Club: Antreprenoriat", d: 45, desc: "Interviuri cu liderii companiilor multinaționale și antreprenori de succes din România." },
      { t: "În Fața Ta: Confruntare Politică", d: 60, desc: "Interviu dur de actualitate cu principalii actori ai vieții politice și economice." },
      { t: "Jurnalul de Seară cu Cosmin Prelipceanu", d: 120, desc: "Sinteza zilei, analize de fond, invitați din studio și transmisiuni speciale." }
    ],

    // 6. TRANSMISIUNI OFICIALE, EVENIMENTE & PLEN
    "ebs": [
      { t: "European Commission Daily Midday Press Briefing", d: 60, desc: "Live spokesperson answers questions from the accredited international press corps." },
      { t: "College of Commissioners Decisions: Live Announcement", d: 60, desc: "Executive announcements on antitrust, single market rules, and common foreign policy." },
      { t: "EU Council of Ministers: Arrivals & Doorsteps", d: 45, desc: "Foreign, finance and interior ministers arrive in Brussels outlining their national stances." },
      { t: "Press Conference: High Representative for Foreign Affairs", d: 45, desc: "Statements regarding international security partnerships, trade sanctions and diplomacy." }
    ],
    "ebs-plus": [
      { t: "European Parliament: Plenary Session Live (Strasbourg)", d: 120, desc: "Debates on legislative directives, voting on EU regulations, and party group speeches." },
      { t: "Committee on Economic & Monetary Affairs (ECON)", d: 90, desc: "Hearings with the ECB President and reviews of monetary policy framework." },
      { t: "European Parliament: Voting Session on Key Directives", d: 60, desc: "Electronic roll-call voting on major European legislation and committee reports." },
      { t: "Debate on the Future of Europe", d: 90, desc: "Prime ministers from member states address the European Parliament." }
    ],
    "bnr": [
      { t: "Conferință de Presă: Decizia de Politică Monetară BNR", d: 60, desc: "Guvernatorul Băncii Naționale a României prezintă decizia privind rata dobânzii de politică monetară." },
      { t: "Prezentarea Raportului Trimestrial Asupra Inflației", d: 75, desc: "Prognoza BNR privind dinamica prețurilor de consum și riscurile macroeconomice." },
      { t: "Simpozion BNR: Stabilitatea Financiară Națională", d: 90, desc: "Lucrările conferinței anuale privind reziliența sistemului bancar românesc." },
      { t: "Briefing Economic: Rezervele Internaționale ale României", d: 45, desc: "Prezentarea evoluției rezervelor valutare și a rezervei de aur a țării." }
    ],
    "cdep": [
      { t: "Ședința de Plen a Camerei Deputaților: Dezbateri Legislative", d: 150, desc: "Dezbateri asupra proiectelor de lege, amendamente înaintate și discursuri ale deputaților." },
      { t: "Comisia pentru Buget, Finanțe și Bănci: Raport de Avizare", d: 90, desc: "Analiza execuției bugetare și avizarea amendamentelor la codul fiscal." },
      { t: "Vot Final pe Proiectele de Lege Organice", d: 60, desc: "Sesiunea oficială de vot prin cartele electronice a legilor ajunse la decizie finală." },
      { t: "Declarații Politice ale Grupurilor Parlamentare", d: 60, desc: "Intervenții susținute de la tribuna Parlamentului de către reprezentanții partidelor." }
    ],
    "senat": [
      { t: "Ședința Oficială de Plen a Senatului României", d: 150, desc: "Examinarea proiectelor de acte normative aflate în primă lectură sau decizie senatorială." },
      { t: "Comisia Juridică, de Numiri, Disciplină și Imunități", d: 90, desc: "Ședința de lucru pentru avizarea codurilor de procedură și numirilor în funcții publice." },
      { t: "Întrebări și Interpelări Adresate Membrilor Guvernului", d: 60, desc: "Senatorii solicită răspunsuri directe de la miniștri pe probleme de interes național." },
      { t: "Sesiunea de Vot Final a Senatului României", d: 60, desc: "Adoptarea propunerilor legislative și a tratatelor internaționale ratificate." }
    ],
    "gov-ro": [
      { t: "Briefing Oficial după Ședința Guvernului României", d: 60, desc: "Purtătorul de cuvânt al Guvernului prezintă pachetul de hotărâri și ordonanțe adoptate." },
      { t: "Conferință de Presă la Palatul Victoria", d: 45, desc: "Miniștrii de linie explică noile măsuri economice, proiectele de infrastructură și sociale." },
      { t: "Declarații de Presă ale Prim-Ministrului României", d: 30, desc: "Comunicarea priorităților executive și a concluziilor discuțiilor cu partenerii europeni." },
      { t: "Comitetul Interministerial pentru Afaceri Europene", d: 60, desc: "Reuniune guvernamentală axată pe stadiul implementării reformelor și investițiilor." }
    ]
  };

  // Helper: Generates a seamless 24h schedule for a channel for a given day
  function generateDaySchedule(channelId, date = new Date()) {
    const templates = CHANNEL_TEMPLATES[channelId] || [
      { t: "Transmisiune în Direct: Program Informativ", d: 60, desc: "Actualitate și emisiuni de sinteză transmise în direct." },
      { t: "Ediție Specială: Analiză & Perspective", d: 60, desc: "Dezbateri și opinii ale analiștilor independenți." },
      { t: "Documentar & Reportaje Explicate", d: 60, desc: "Investigații jurnalistice și teme de interes public." },
      { t: "Jurnalul Orei: Actualitatea la Minut", d: 60, desc: "Sinteza celor mai importante evenimente orare." }
    ];

    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();

    // Start day at 00:00:00 local time
    let cursor = new Date(y, m, d, 0, 0, 0, 0).getTime();
    const endOfDay = new Date(y, m, d, 23, 59, 59, 999).getTime();

    const schedule = [];
    let tIdx = 0;

    // Use a deterministic seed offset based on channelId and day to provide variety
    const seed = (channelId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + d) % templates.length;
    tIdx = seed;

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
      const total = current.endMs - current.startMs;
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
  const TIMELINE_HOURS = 6;

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
        const total = prog.endMs - prog.startMs;
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
