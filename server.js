const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const https = require("https");

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(__dirname);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".wgt": "application/widget"
};

// Find local IP address on LAN
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const server = http.createServer((req, res) => {
  // Enable full CORS for all responses
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  // HLS Stream Proxy Endpoint: /api/proxy?url=...
  if (parsedUrl.pathname === "/api/proxy") {
    const targetUrl = parsedUrl.searchParams.get("url");
    if (!targetUrl) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Missing 'url' query parameter.");
      return;
    }

    try {
      const client = targetUrl.startsWith("https") ? https : http;
      client.get(targetUrl, { headers: { "User-Agent": "Mozilla/5.0" } }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, {
          "Content-Type": proxyRes.headers["content-type"] || "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": "*"
        });
        proxyRes.pipe(res);
      }).on("error", (err) => {
        res.writeHead(502, { "Content-Type": "text/plain" });
        res.end("Proxy error: " + err.message);
      });
    } catch (e) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal proxy error: " + e.message);
    }
    return;
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, parsedUrl.pathname === "/" ? "index.html" : parsedUrl.pathname);

  // Safety check against directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routing if requested
      filePath = path.join(PUBLIC_DIR, "index.html");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading " + path.basename(filePath));
        return;
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, "0.0.0.0", () => {
  const localIP = getLocalIP();
  console.log("==================================================================");
  console.log("📺 NEXUS TV HUB // Server Activ");
  console.log("==================================================================");
  console.log(`💻 Test pe calculator (Browser):       http://localhost:${PORT}`);
  console.log(`🖼️  Test pe Samsung The Frame (TV):     http://${localIP}:${PORT}`);
  console.log("------------------------------------------------------------------");
  console.log("📌 Pe Samsung The Frame:");
  console.log("   1. Deschide aplicația 'Internet' pe televizor.");
  console.log(`   2. Tastează adresa: http://${localIP}:${PORT}`);
  console.log("   3. Apasă Ecran Complet în browser-ul TV.");
  console.log("   4. Navighează direct cu telecomanda (D-Pad, OK, Back, Ch+/-)!");
  console.log("==================================================================");
});
