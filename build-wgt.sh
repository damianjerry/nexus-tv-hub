#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "=== Împachetare NEXUS TV HUB pentru Samsung Tizen ==="
OUTPUT_WGT="NexusTvHub-unsigned.wgt"

rm -f "$OUTPUT_WGT"

# Create zip archive as .wgt
zip -r "$OUTPUT_WGT" \
    config.xml \
    icon.png \
    index.html \
    styles.css \
    channels.js \
    app.js \
    hls.min.js

echo "✅ Pachet creat cu succes: $DIR/$OUTPUT_WGT"
echo "Dimensiune pachet: $(du -h "$OUTPUT_WGT" | cut -f1)"
echo ""
echo "Pentru semnare și sideload pe Samsung The Frame (Tizen Studio CLI):"
echo "  tizen package -t wgt -s <nume_certificat> -- $OUTPUT_WGT"
echo "  tizen install -n NexusTvHub.wgt -t <target_ip_tv>"
