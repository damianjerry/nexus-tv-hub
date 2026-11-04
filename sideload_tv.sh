#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

TV_IP="192.168.1.129"
APP_ID="NxTvHub261.NexusTvHub"
SDB_BIN="/Users/damianouatu/Library/Application Support/Apps2Samsung/TizenSDB/TizenSdb_v1.1.5_macos-arm64"
CERT_DIR="/Users/damianouatu/Library/Application Support/Apps2Samsung/Certificate/Jelly2Sams - Partner"
AUTHOR_P12="$CERT_DIR/author.p12"
DISTRIB_P12="$CERT_DIR/distributor.p12"
PASS="$(cat "$CERT_DIR/password.txt" | tr -d '\n\r ')"
DEVICE_PROFILE="$CERT_DIR/device-profile.xml"

echo "=== 1. Creare arhiva WGT ==="
rm -f NexusTvHub.wgt NexusTvHub-unsigned.wgt
zip -q -r NexusTvHub.wgt \
    config.xml \
    icon.png \
    index.html \
    styles.css \
    channels.js \
    app.js \
    hls.min.js

echo "Arhiva WGT creată ($(du -h NexusTvHub.wgt | cut -f1))"

echo "=== 2. Semnare cu Certificat Oficial Samsung Partner ==="
"$SDB_BIN" resign "$DIR/NexusTvHub.wgt" "$AUTHOR_P12" "$DISTRIB_P12" "$PASS"

echo "=== 3. Conectare și Permit-Install pe Samsung The Frame ($TV_IP) ==="
"$SDB_BIN" connect "$TV_IP" || true
"$SDB_BIN" permit-install "$TV_IP" "$DEVICE_PROFILE" || true

echo "=== 4. Sideload / Instalare pe TV ==="
"$SDB_BIN" install "$TV_IP" "$DIR/NexusTvHub.wgt"

echo "=== 5. Lansare aplicație pe ecranul Samsung The Frame ==="
"$SDB_BIN" launch "$TV_IP" "$APP_ID"

echo ""
echo "🎉 SUCCESS: Aplicația NEXUS TV HUB a fost instalată și lansată pe televizor!"
