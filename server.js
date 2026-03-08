/**
 * Weather Server — Open-Meteo
 * Zdarma, bez API klice, ECMWF model.
 * Lokace: Hostalková u Vsetína (49.372 N, 18.067 E)
 *
 * Spustení: node server.js
 * Endpoint:  http://192.168.0.113:3001/api/weather
 */

const https = require('https');
const http = require('http');

const LATITUDE = 49.372;
const LONGITUDE = 18.067;
const PORT = 3001;
const CACHE_TTL = 10 * 60 * 1000;

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
                    if (!c) { reject(new Error('Neocekávána struktura')); return; }

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

async function getCachedData() {
    const now = Date.now();
    if (cache.data && (now - cache.fetchedAt) < CACHE_TTL) return cache.data;
    const data = await fetchWeather();
    cache = { data, fetchedAt: now };
    return data;
}

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (req.url === '/api/weather') {
        try {
            const data = await getCachedData();
            res.writeHead(200);
            res.end(JSON.stringify(data));
        } catch (e) {
            console.error('Chyba:', e.message);
            res.writeHead(500);
            res.end(JSON.stringify({ error: e.message, updatedAt: new Date().toISOString() }));
        }
    } else if (req.url === '/api/status') {
        res.writeHead(200);
        res.end(JSON.stringify({
            ok: true,
            source: 'open-meteo',
            location: LATITUDE + 'N, ' + LONGITUDE + 'E',
            cacheAge: cache.fetchedAt ? Math.round((Date.now() - cache.fetchedAt) / 1000) + 's' : 'empty',
        }));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('\nWeather server bezi na http://0.0.0.0:' + PORT);
    console.log('   Lokace: Hostalková u Vsetína (' + LATITUDE + ' N, ' + LONGITUDE + ' E)');
    console.log('   Data:   http://localhost:' + PORT + '/api/weather\n');
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error('Port ' + PORT + ' je jiz obsazeny. Spust start-server.bat.');
    } else {
        console.error('Server chyba:', e);
    }
    process.exit(1);
});

getCachedData().catch(e => console.error('Prefetch selhal:', e.message));
