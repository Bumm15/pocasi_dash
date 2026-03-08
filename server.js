const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const LATITUDE = 49.372;
const LONGITUDE = 18.067;
const PORT = 3001;
const CACHE_TTL = 10 * 60 * 1000;
const BUILD_DIR = path.join(__dirname, 'build');

// ...existing code... (degreesToCompass, wmoToCondition, fetchWeather, getCachedData)

// MIME typy pro statické soubory
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.map': 'application/json',
};

function serveStaticFile(filePath, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // Soubor nenalezen → vrať index.html (React SPA routing)
            fs.readFile(path.join(BUILD_DIR, 'index.html'), (err2, html) => {
                if (err2) {
                    res.writeHead(404);
                    res.end('Not found');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(html);
            });
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const mime = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
    });
}

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // API routes
    if (req.url === '/api/weather') {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        try {
            const data = await getCachedData();
            res.writeHead(200);
            res.end(JSON.stringify(data));
        } catch (e) {
            console.error('Chyba:', e.message);
            res.writeHead(500);
            res.end(JSON.stringify({ error: e.message, updatedAt: new Date().toISOString() }));
        }
        return;
    }

    if (req.url === '/api/status') {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.writeHead(200);
        res.end(JSON.stringify({
            ok: true,
            source: 'open-meteo',
            location: LATITUDE + 'N, ' + LONGITUDE + 'E',
            cacheAge: cache.fetchedAt ? Math.round((Date.now() - cache.fetchedAt) / 1000) + 's' : 'empty',
        }));
        return;
    }

    // Statické soubory z build/
    let filePath = path.join(BUILD_DIR, req.url === '/' ? 'index.html' : req.url);
    serveStaticFile(filePath, res);
});

// ...existing code... (server.listen, server.on('error'))