/**
 * Weather Server — Open-Meteo + React Static Server
 * Zdarma, bez API klice, ECMWF model.
 * Lokace: Hostalková u Vsetína (49.372 N, 18.067 E)
 *
 * Spustení: node server.js
 * Frontend:  http://192.168.0.115:3001
 * API:       http://192.168.0.115:3001/api/weather
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const LATITUDE = 49.372;
const LONGITUDE = 18.067;
const PORT = 3001;
const CACHE_TTL = 10 * 60 * 1000;
const BUILD_DIR = path.join(__dirname, 'build');

function degreesToCompass(deg) {
    const dirs = ['S', 'SV', 'V', 'JV', 'J', 'JZ', 'Z', 'SZ'];
    return dirs[Math.round(deg / 45) % 8];
}

function wmoToCondition(code) {
    if (code === 0 || code === 1) return 'Jasno';
    if (code === 2) return 'Polojasno';
    if (code === 3) return 'Zataženo';
    if (code === 45 || code === 48) return 'Mlha';
    if (code === 51 || code === 53 || code === 56) return 'Mírný déšť';
    if (code === 55 || code === 57) return 'Déšť';
    if (code === 61 || code === 66) return 'Mírný déšť';
    if (code === 63) return 'Déšť';
    if (code === 65 || code === 67) return 'Silný déšť';
    if (code === 71 || code === 73) return 'Mírné sněžení';
    if (code === 75 || code === 77) return 'Sníh';
    if (code === 80 || code === 81) return 'Déšť';
    if (code === 82) return 'Silný déšť';
    if (code === 85 || code === 86) return 'Sníh';
    if (code === 95 || code === 96 || code === 99) return 'Bouřka';
    return 'Oblačno';
}

function fetchWeather() {
    return new Promise((resolve, reject) => {
        const params = [
            'latitude=' + LATITUDE,
            'longitude=' + LONGITUDE,
            'current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure',
            'wind_speed_unit=kmh',
            'timezone=Europe%2FPrague',
        ].join('&');
        const url = 'https://api.open-meteo.com/v1/forecast?' + params;

        console.log('[' + new Date().toISOString() + '] Fetchuji Open-Meteo...');

        const req = https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error('HTTP ' + res.statusCode));
                res.resume();
                return;
            }
            let raw = '';
            res.on('data', chunk => raw += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(raw);
                    const c = json.current;
                    if (!c) { reject(new Error('Neočekávaná struktura')); return; }

                    const condition = wmoToCondition(c.weather_code);
                    const result = {
                        temperature: c.temperature_2m != null ? Math.round(c.temperature_2m * 10) / 10 : null,
                        humidity: c.relative_humidity_2m != null ? Math.round(c.relative_humidity_2m) : null,
                        windSpeed: c.wind_speed_10m != null ? Math.round(c.wind_speed_10m) : null,
                        windDirection: c.wind_direction_10m != null ? degreesToCompass(c.wind_direction_10m) : null,
                        windGust: c.wind_gusts_10m != null ? Math.round(c.wind_gusts_10m) : null,
                        rain: c.precipitation != null ? Math.round(c.precipitation * 10) / 10 : null,
                        pressure: c.surface_pressure != null ? Math.round(c.surface_pressure) : null,
                        condition,
                        updatedAt: new Date().toISOString(),
                        dataTimestamp: c.time ?? null,
                    };
                    console.log('OK: ' + condition + ' | ' + result.temperature + 'C | ' + result.humidity + '% | vitr ' + result.windSpeed + ' km/h ' + result.windDirection);
                    resolve(result);
                } catch (e) {
                    reject(new Error('Parse error: ' + e.message));
                }
            });
        });
        req.on('error', reject);
        req.setTimeout(10000, () => req.destroy(new Error('Timeout')));
    });
}

let cache = { data: null, fetchedAt: 0 };

// In-memory úložiště dat z indoor senzoru (RPi Zero)
let indoorData = { temperature: null, humidity: null, updatedAt: null };

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try { resolve(JSON.parse(body)); }
            catch (e) { reject(new Error('Invalid JSON')); }
        });
        req.on('error', reject);
    });
}

async function getCachedData() {
    const now = Date.now();
    if (cache.data && (now - cache.fetchedAt) < CACHE_TTL) return cache.data;
    const data = await fetchWeather();
    cache = { data, fetchedAt: now };
    return data;
}

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // POST /api/indoor — příjem dat ze senzoru (RPi Zero)
    if (req.method === 'POST' && req.url === '/api/indoor') {
        try {
            const body = await parseBody(req);
            const temp = parseFloat(body.temperature);
            const hum = parseFloat(body.humidity);
            if (isNaN(temp) || isNaN(hum)) throw new Error('Chybí temperature nebo humidity');
            indoorData = { temperature: Math.round(temp * 10) / 10, humidity: Math.round(hum * 10) / 10, updatedAt: new Date().toISOString() };
            console.log('[INDOOR] ' + indoorData.temperature + '°C | ' + indoorData.humidity + '%');
            res.writeHead(200);
            res.end(JSON.stringify({ ok: true }));
        } catch (e) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    // GET /api/indoor — poslední data pro frontend
    if (req.method === 'GET' && req.url === '/api/indoor') {
        res.writeHead(200);
        res.end(JSON.stringify(indoorData));
        return;
    }

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
    const urlPath = req.url.split('?')[0]; // ignoruj query parametry
    const filePath = path.join(BUILD_DIR, urlPath === '/' ? 'index.html' : urlPath);
    serveStaticFile(filePath, res);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('\n Weather server bezi na http://0.0.0.0:' + PORT);
    console.log('   Lokace:   Hostalková u Vsetína (' + LATITUDE + ' N, ' + LONGITUDE + ' E)');
    console.log('   Frontend: http://192.168.0.115:' + PORT);
    console.log('   API:      http://192.168.0.115:' + PORT + '/api/weather');
    console.log('   Status:   http://192.168.0.115:' + PORT + '/api/status\n');
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error('Port ' + PORT + ' je jiz obsazeny.');
    } else {
        console.error('Server chyba:', e);
    }
    process.exit(1);
});