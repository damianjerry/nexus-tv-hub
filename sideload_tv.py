#!/usr/bin/env python3
"""
NEXUS TV HUB // Sideload & Launch pe Samsung The Frame
Instalează și pornește aplicația direct pe televizorul tău Samsung.
"""

import subprocess
import time
from pathlib import Path

DIR = Path(__file__).resolve().parent
TV_IP = "192.168.1.129"
SERIAL = f"{TV_IP}:26101"
APP_ID = "NxTvHub261.NexusTvHub"
SDB = "/Users/damianouatu/tizen-studio/tools/sdb"
SDB_RESIGN = "/Users/damianouatu/Library/Application Support/Apps2Samsung/TizenSDB/TizenSdb_v1.1.5_macos-arm64"
CERT_DIR = Path("/Users/damianouatu/Library/Application Support/Apps2Samsung/Certificate/Jelly2Sams - Partner")
AUTHOR_P12 = CERT_DIR / "author.p12"
DISTRIB_P12 = CERT_DIR / "distributor.p12"
PASSWORD = (CERT_DIR / "password.txt").read_text().strip()
WGT_PATH = DIR / "NexusTvHub.wgt"

def run():
    print("=== 1. Împachetare arhivă WGT ===")
    import zipfile
    files = ["config.xml", "icon.png", "index.html", "styles.css", "channels.js", "epg.js", "app.js", "hls.min.js"]
    with zipfile.ZipFile(WGT_PATH, "w", zipfile.ZIP_DEFLATED) as z:
        for f in files:
            z.write(DIR / f, f)
    print(f"✔ Arhivă creată: {WGT_PATH} ({WGT_PATH.stat().st_size // 1024} KB)")

    print("=== 2. Semnare cu Certificat Oficial Samsung Partner ===")
    cmd_resign = [SDB_RESIGN, "resign", str(WGT_PATH), str(AUTHOR_P12), str(DISTRIB_P12), PASSWORD]
    res = subprocess.run(cmd_resign, capture_output=True, text=True)
    if res.returncode != 0:
        print("Eroare la semnare:", res.stderr)
        return
    print("✔ Pachet semnat cu succes.")

    print(f"=== 3. Conectare și Push pe Samsung The Frame ({SERIAL}) ===")
    subprocess.run([SDB, "connect", SERIAL], capture_output=True)
    remote_path = f"/home/owner/share/tmp/sdk_tools/NexusTvHub-{int(time.time())}.wgt"
    push = subprocess.run([SDB, "-s", SERIAL, "push", str(WGT_PATH), remote_path], capture_output=True, text=True)
    if push.returncode != 0:
        print("Eroare la transfer:", push.stderr)
        return
    print("✔ Pachet transferat pe TV.")

    print("=== 4. Instalare nativă pe televizor (vd_appinstall) ===")
    install = subprocess.run([SDB, "-s", SERIAL, "shell", "0", "vd_appinstall", APP_ID, remote_path], capture_output=True, text=True)
    if "install completed" in install.stdout:
        print("✔ Aplicație instalată cu succes pe Tizen OS!")
    else:
        print("Output instalare:", install.stdout)

    print("=== 5. Lansare aplicație pe ecran ===")
    launch = subprocess.run([SDB, "-s", SERIAL, "shell", "0", "execute", APP_ID], capture_output=True, text=True)
    print("✔", launch.stdout.strip())
    print("\n🎉 GATA: Aplicația rulează acum pe ecranul Samsung The Frame!")

if __name__ == "__main__":
    run()
