# NEXUS TV // Smart TV Guide & Linear Player
### Information, Finance, Public Policy & Culture Hub for Samsung The Frame (Tizen 6.5)

O aplicație TV liniară cu ghid TV (EPG) din sticlă mată translucidă, creată special pentru televizorul **Samsung The Frame (LS03B / Tizen 6.5)** și browsere web moderne.

Prioritizează macroeconomia, piețele de capital, legislația, dezbaterile instituționale și documentarele de patrimoniu, fără cancan și fără liste piratate instabile.

---

## ✨ Caracteristici Cheie

* **Redare Liniară Instantanee:** La deschidere, intră direct în transmisiunea primului post TV (Bloomberg Television HD) pe fundal, fără ecrane intermediare sau timpi de așteptare.
* **Ghid TV din Sticlă (EPG Glass UI):** Inspirat din arhitectura *TiviMate*, *Samsung TV Plus* și *Apple TV Live Guide*:
  * Coloană laterală de categorii (`Finanțe`, `Geopolitică`, `Instituții & UE`, `TVR & Stat`, `Documentare & Artă`).
  * Listă de canale cu numere mari de canal (`CH 01`, `CH 02`), logo, titlu, emisiune și indicator `● LIVE`.
  * Panou lateral cu detalii editoriale, descriere completă și protocolul de streaming.
* **Bara Rapidă de Info OSD (10-Foot UI):** În modul ecran complet, la schimbarea canalelor (`CH+ / CH-`) sau la apăsarea tastei `OK`, apare o bară elegantă jos pe ecran de dimensiuni mari (`3.6rem` pentru număr de canal, ceas București live, titlu și calitatea fluxului).
* **100% Fluxuri Oficiale & CDN Direct:** Fără liste M3U piratate care dispar. 16+ canale sunt transmisiuni oficiale HLS directe (`.m3u8`) din CDN-urile instituționale și televiziunile de stat (TVR, Digi, Comisia Europeană, NHK World Tokyo, Bloomberg, France 24, Euronews, DW, ARTE).
* **Decupaj Nativ YouTube:** Pentru streamurile YouTube, antetul și bara de stare sunt decupate precis din câmpul vizual pentru un aspect curat de televiziune prin cablu.
* **Zero Dependență de Server:** Aplicația este un pachet nativ client-side (.wgt / static HTML5) care nu necesită server local, backend sau proxy pentru a funcționa.

---

## 📺 Grila de Canale Oficiale (22 Canale)

| Nr. | Canal | Categorie | Sursă & Calitate |
|---|---|---|---|
| **CH 01** | **Bloomberg Television** | Finanțe & Burse | 1080p HLS Direct CDN |
| **CH 02** | **CNA Asia & World Business** | Finanțe & Burse | 1080p HLS Direct CloudFront |
| **CH 03** | **Yahoo Finance Live** | Finanțe & Burse | 1080p Live (NYSE Bell-to-Bell) |
| **CH 04** | **BNR (Banca Națională a României)** | Finanțe & Burse | Evenimente Live & Politică Monetară |
| **CH 05** | **Euronews România** | Geopolitică & Știri | 1080p HLS Direct |
| **CH 06** | **France 24 English** | Geopolitică & Știri | 1080p HLS Direct France Télévisions |
| **CH 07** | **DW News (Deutsche Welle)** | Geopolitică & Știri | 1080p HLS Direct Amagi Playout |
| **CH 08** | **Al Jazeera English** | Geopolitică & Știri | 1080p HLS Direct AJE Network |
| **CH 09** | **Sky News International** | Geopolitică & Știri | 1080p Live Stream |
| **CH 10** | **EbS - Comisia Europeană** | Instituții & UE | 1080p HLS Direct Bruxelles |
| **CH 11** | **EbS+ - Parlamentul European** | Instituții & UE | 1080p HLS Direct Strasbourg |
| **CH 12** | **Camera Deputaților (România)** | Instituții & UE | Live Oficial Plen & Comisii |
| **CH 13** | **Senatul României** | Instituții & UE | Live Oficial Plen |
| **CH 14** | **Guvernul României** | Instituții & UE | Live Oficial Briefinguri Palatul Victoria |
| **CH 15** | **TVR Info HD** | TVR & Naționale | 1080p HLS CDN Oficial TVR |
| **CH 16** | **TVR 1 HD** | TVR & Naționale | 1080p HLS CDN Oficial TVR |
| **CH 17** | **TVR 2 HD** | TVR & Naționale | 1080p HLS CDN Oficial TVR |
| **CH 18** | **TVR Cultural HD** | TVR & Naționale | 1080p HLS CDN Oficial TVR |
| **CH 19** | **Digi 24 HD** | TVR & Naționale | 1080p HLS Direct RCS & RDS |
| **CH 20** | **NHK World-Japan HD** | Documentare & Cultură | 1080p 60fps Master CDN Tokyo |
| **CH 21** | **ARTE European Culture & Cinema** | Documentare & Cultură | 1080p HLS Direct |
| **CH 22** | **DW Documentary** | Documentare & Cultură | 1080p HD Investigații |

---

## 🎮 Navigare Telecomandă Samsung & Taste

| Funcție | Telecomandă Samsung The Frame | Tastatură PC / Mac |
|---|---|---|
| **Navigare în Ghid** | Săgeți `▲ ▼` (D-Pad) | Săgeți `↑ ↓` |
| **Comutare Categorii** | Săgeți `◄ ►` sau Tasta Albastră | Săgeți `← →` sau Tasta `B` |
| **Deschide Canal / Fullscreen** | Tasta `Select / OK` | Tasta `Enter` sau `Space` |
| **Deschide / Închide Ghidul** | Tasta `Back / Return` | Tasta `Escape` sau `G` |
| **Zapping Canale (Ecran Complet)** | Rocker `CH+` (Următorul) / `CH-` (Anteriorul) | Săgeata `↑` (+1) / Săgeata `↓` (-1) |
| **Săritură Directă Canal** | Tastele numerice `1` - `9` | Cifrele `1` - `9` |
| **Ecran Complet** | Tasta Roșie | Tasta `F` |

---

## 🚀 Instalare & Rulare

### Opțiunea 1: Sideload Direct pe Samsung The Frame (Automatizat)
Dacă televizorul are Developer Mode activat în rețeaua locală:
```bash
python3 sideload_tv.py
```
Scriptul împachetează arhiva WGT, o semnează cu certificatul Samsung Partner, o transferă prin SDB și o lansează instant pe ecranul televizorului.

### Opțiunea 2: Rulare în Browser / Rețea Locală
```bash
npm start
# sau: node server.js
```
Deschide în orice browser web la: `http://localhost:8080` (sau adresa IP locală a mașinii).

---

## 📄 Licență
MIT License. Creat pentru uz personal și pasionații de informație calitativă pe televizoare Smart TV.
