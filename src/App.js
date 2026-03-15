import { useState, useEffect } from 'react';
import './App.css';

const Icon = ({ d, size = 28, color = 'currentColor', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

// Termometr
const IcoTemp = ({ color }) => <Icon color={color} d={[
  "M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"
]} />;
// Kapka
const IcoHum = ({ color }) => <Icon color={color} d={[
  "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
]} />;
// Vítr
const IcoWind = ({ color }) => <Icon color={color} d={[
  "M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2",
  "M9.6 4.6A2 2 0 1 1 11 8H2",
  "M12.6 19.4A2 2 0 1 0 14 16H2"
]} />;
// Kompas
const IcoCompass = ({ color }) => <Icon color={color} d={[
  "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
  "m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"
]} />;
// Dūm
const IcoHome = ({ color }) => <Icon color={color} d={[
  "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  "M9 22V12h6v10"
]} />;
// Slunce / venku
const IcoOutdoor = ({ color }) => <Icon color={color} d={[
  "M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z",
  "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
]} />;

// ── SVG ikony počasí (fungují na Linuxu bez emoji fontů) ─────────────────

// Slunce
const WIcoSun = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" fill="#fbbf24" fillOpacity="0.3" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
    <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
    <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
  </svg>
);

// Měsíc
const WIcoMoon = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#93c5fd" fillOpacity="0.2" />
  </svg>
);

// Polojasno (slunce + mrak)
const WIcoPartlyCloudy = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="8" r="3" fill="#fbbf24" fillOpacity="0.4" stroke="#fbbf24" strokeWidth="1.5" />
    <line x1="10" y1="2" x2="10" y2="4" stroke="#fbbf24" strokeWidth="1.5" />
    <line x1="4.5" y1="4.5" x2="5.9" y2="5.9" stroke="#fbbf24" strokeWidth="1.5" />
    <line x1="2" y1="8" x2="4" y2="8" stroke="#fbbf24" strokeWidth="1.5" />
    <path d="M7 15.5a4.5 4.5 0 0 1 .6-8.9 4.5 4.5 0 0 1 8.4 2.1A3 3 0 1 1 17 15.5z" fill="#cbd5e1" fillOpacity="0.25" stroke="#94a3b8" strokeWidth="1.8" />
  </svg>
);

// Měsíc + mrak (noční polojasno)
const WIcoNightPartly = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a5 5 0 0 0-5 8.7A4 4 0 1 0 14 19h5a3 3 0 0 0 0-6h-.1A5 5 0 0 0 17 3z" fill="#93c5fd" fillOpacity="0.15" stroke="#93c5fd" strokeWidth="1.5" />
    <path d="M10 6.3A4 4 0 0 1 6 10a4 4 0 0 1-1-.1" stroke="#93c5fd" strokeWidth="1.5" />
  </svg>
);

// Mrak
const WIcoCloud = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#94a3b8" fillOpacity="0.2" />
  </svg>
);

// Déšť
const WIcoRain = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#64748b" fillOpacity="0.25" stroke="#94a3b8" strokeWidth="1.8" />
    <line x1="8" y1="19" x2="6" y2="23" stroke="#7dd3fc" strokeWidth="1.8" />
    <line x1="12" y1="19" x2="10" y2="23" stroke="#7dd3fc" strokeWidth="1.8" />
    <line x1="16" y1="19" x2="14" y2="23" stroke="#7dd3fc" strokeWidth="1.8" />
  </svg>
);

// Mírný déšť (mrak + slunce + déšť)
const WIcoLightRain = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="6" r="2.5" fill="#fbbf24" fillOpacity="0.35" stroke="#fbbf24" strokeWidth="1.5" />
    <line x1="8" y1="1.5" x2="8" y2="3" stroke="#fbbf24" strokeWidth="1.5" />
    <line x1="3.5" y1="3.5" x2="4.6" y2="4.6" stroke="#fbbf24" strokeWidth="1.5" />
    <line x1="2" y1="6" x2="3.5" y2="6" stroke="#fbbf24" strokeWidth="1.5" />
    <path d="M16 13h-.9A5.5 5.5 0 1 0 8 19h8a3.5 3.5 0 0 0 0-7z" fill="#64748b" fillOpacity="0.25" stroke="#94a3b8" strokeWidth="1.8" />
    <line x1="10" y1="19" x2="9" y2="22" stroke="#7dd3fc" strokeWidth="1.8" />
    <line x1="14" y1="19" x2="13" y2="22" stroke="#7dd3fc" strokeWidth="1.8" />
  </svg>
);

// Bouřka
const WIcoStorm = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 9h-1.26A8 8 0 1 0 10 20h9a5 5 0 0 0 0-10z" fill="#475569" fillOpacity="0.35" stroke="#64748b" strokeWidth="1.8" />
    <polyline points="13 11 10 16 14 16 11 21" fill="none" stroke="#fbbf24" strokeWidth="2" />
  </svg>
);

// Sníh
const WIcoSnow = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#bfdbfe" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#bfdbfe" fillOpacity="0.15" />
    <line x1="8" y1="15" x2="8" y2="21" stroke="#bfdbfe" strokeWidth="1.8" />
    <line x1="5" y1="16.5" x2="11" y2="19.5" stroke="#bfdbfe" strokeWidth="1.5" />
    <line x1="5" y1="19.5" x2="11" y2="16.5" stroke="#bfdbfe" strokeWidth="1.5" />
    <line x1="14" y1="15" x2="14" y2="21" stroke="#bfdbfe" strokeWidth="1.8" />
    <line x1="11" y1="16.5" x2="17" y2="19.5" stroke="#bfdbfe" strokeWidth="1.5" />
    <line x1="11" y1="19.5" x2="17" y2="16.5" stroke="#bfdbfe" strokeWidth="1.5" />
  </svg>
);

// Mlha
const WIcoFog = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="8" x2="21" y2="8" strokeOpacity="0.6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="5" y1="16" x2="19" y2="16" strokeOpacity="0.7" />
    <line x1="7" y1="20" x2="17" y2="20" strokeOpacity="0.4" />
  </svg>
);

// Vítr (šipky)
const WIcoWindy = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
    <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
    <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
  </svg>
);

// Mapování stavu počasí → komponenta
const getWeatherIcon = (condition, isNight, size = 36) => {
  const key = condition.toLowerCase();
  const isClear = key.includes('jasno') || key.includes('clear') || key.includes('sunny');
  const isPartly = key.includes('polojasno') || key.includes('partly') || key.includes('částečně');
  const isCloudy = key.includes('oblačno') || key.includes('cloudy') || key.includes('overcast') || key.includes('zataženo');
  const isRain = key.includes('déš') || key.includes('rain') || key.includes('prš');
  const isLightRain = key.includes('mírný') || key.includes('light rain');
  const isStorm = key.includes('bouřka') || key.includes('thunder');
  const isSnow = key.includes('sníh') || key.includes('snow') || key.includes('sněž');
  const isFog = key.includes('mlha') || key.includes('fog') || key.includes('mist');
  const isWindy = key.includes('větrno') || key.includes('windy');

  if (isStorm) return <WIcoStorm size={size} />;
  if (isSnow) return <WIcoSnow size={size} />;
  if (isFog) return <WIcoFog size={size} />;
  if (isWindy) return <WIcoWindy size={size} />;
  if (isLightRain) return <WIcoLightRain size={size} />;
  if (isRain) return <WIcoRain size={size} />;
  if (isCloudy) return <WIcoCloud size={size} />;
  if (isPartly) return isNight ? <WIcoNightPartly size={size} /> : <WIcoPartlyCloudy size={size} />;
  if (isClear) return isNight ? <WIcoMoon size={size} /> : <WIcoSun size={size} />;
  return isNight ? <WIcoMoon size={size} /> : <WIcoSun size={size} />;
};

// Mapování stavu počasí na třídu pozadí
const getWeatherTheme = (condition) => {
  const key = condition.toLowerCase();
  if (key.includes('jasno') || key.includes('clear') || key.includes('sunny')) return 'theme-clear';
  if (key.includes('oblačno') || key.includes('cloudy') || key.includes('overcast') || key.includes('zataženo')) return 'theme-cloudy';
  if (key.includes('déš') || key.includes('rain') || key.includes('prš')) return 'theme-rain';
  if (key.includes('sníh') || key.includes('snow') || key.includes('sněž')) return 'theme-snow';
  if (key.includes('bouřka') || key.includes('thunder')) return 'theme-storm';
  if (key.includes('mlha') || key.includes('fog') || key.includes('mist')) return 'theme-fog';
  return 'theme-default';
};

// Detekce dne/noci (6:00 - 20:00 = den)
const isNightTime = (date) => {
  const hours = date.getHours();
  return hours < 6 || hours >= 20;
};

// Demo mód - všechny stavy počasí pro testování
const DEMO_MODE = false;
const DEMO_INTERVAL = 3000; // 3 sekundy na každý stav

const demoWeatherStates = [
  { condition: 'Jasno', theme: 'theme-clear' },
  { condition: 'Polojasno', theme: 'theme-clear' },
  { condition: 'Oblačno', theme: 'theme-cloudy' },
  { condition: 'Zataženo', theme: 'theme-cloudy' },
  { condition: 'Mírný déšť', theme: 'theme-rain' },
  { condition: 'Déšť', theme: 'theme-rain' },
  { condition: 'Silný déšť', theme: 'theme-rain' },
  { condition: 'Bouřka', theme: 'theme-storm' },
  { condition: 'Sníh', theme: 'theme-snow' },
  { condition: 'Mírné sněžení', theme: 'theme-snow' },
  { condition: 'Mlha', theme: 'theme-fog' },
  { condition: 'Větrno', theme: 'theme-default' },
];

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [outdoor, setOutdoor] = useState(null);
  const [outdoorError, setOutdoorError] = useState(false);
  const [indoor, setIndoor] = useState(null);
  const [indoorError, setIndoorError] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState({ condition: 'Načítání...' });
  const [weatherTheme, setWeatherTheme] = useState('theme-default');
  const [forecast, setForecast] = useState([]);
  const [isNight, setIsNight] = useState(isNightTime(new Date()));
  const [demoIndex, setDemoIndex] = useState(0);
  const [demoNight, setDemoNight] = useState(false);

  // Časovač pro hodiny
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      if (!DEMO_MODE) {
        setIsNight(isNightTime(now));
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch venkovních dat z lokálního serveru (port 3001) - včetně stavu počasí
  useEffect(() => {
    const apiUrl = `http://192.168.0.115:3001/api/weather`;
    let retryTimer = null;

    const fetchOutdoor = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setOutdoor(data);
        setOutdoorError(false);
        if (data.forecast && data.forecast.length > 0) setForecast(data.forecast);
        // Stav počasí pochází ze serveru (Open-Meteo, WMO kód → text)
        if (data.condition) {
          setWeatherCondition({ condition: data.condition });
          setWeatherTheme(getWeatherTheme(data.condition));
        } else {
          // condition zatím null (wttr.in ještě neodpověděl) - zkus za 30s znovu
          retryTimer = setTimeout(fetchOutdoor, 30 * 1000);
        }
      } catch (e) {
        console.error('Data nedostupná:', e.message);
        setOutdoorError(true);
        setWeatherCondition({ condition: 'Nedostupné' });
        // Zkus znovu za 60 sekund (server možná ještě nestartoval)
        retryTimer = setTimeout(fetchOutdoor, 60 * 1000);
      }
    };

    fetchOutdoor();
    const interval = setInterval(fetchOutdoor, 10 * 60 * 1000);
    return () => { clearInterval(interval); clearTimeout(retryTimer); };
  }, []);

  // Fetch indoor dat ze senzoru (RPi Zero posílá data na /api/indoor)
  useEffect(() => {
    const fetchIndoor = async () => {
      try {
        const res = await fetch('/api/indoor');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.temperature !== null && data.humidity !== null) {
          setIndoor(data);
          setIndoorError(false);
        }
      } catch (e) {
        console.error('Indoor data nedostupná:', e.message);
        setIndoorError(true);
      }
    };

    fetchIndoor();
    const interval = setInterval(fetchIndoor, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Demo mód - loop přes všechny stavy
  useEffect(() => {
    if (!DEMO_MODE) return;

    const demoTimer = setInterval(() => {
      setDemoIndex(prev => {
        const nextIndex = (prev + 1) % demoWeatherStates.length;
        // Po projití všech stavů přepnout den/noc
        if (nextIndex === 0) {
          setDemoNight(prevNight => !prevNight);
        }
        return nextIndex;
      });
    }, DEMO_INTERVAL);

    return () => clearInterval(demoTimer);
  }, []);

  // Aktualizace počasí v demo módu
  useEffect(() => {
    if (!DEMO_MODE) return;

    const currentDemo = demoWeatherStates[demoIndex];
    const nightMode = demoNight;

    setWeatherCondition({
      condition: currentDemo.condition + (nightMode ? ' (noc)' : ' (den)'),
    });
    setWeatherTheme(currentDemo.theme);
    setIsNight(nightMode);
  }, [demoIndex, demoNight]);

  // Ikona se renderuje přímo z weatherCondition.condition + isNight, žádný extra efekt není potřeba

  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');

  const dayNames = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
  const monthNames = ['ledna', 'února', 'března', 'dubna', 'května', 'června',
    'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];

  const dayName = dayNames[currentTime.getDay()];
  const day = currentTime.getDate();
  const month = monthNames[currentTime.getMonth()];

  return (
    <div className={`app ${weatherTheme} ${isNight ? 'night' : 'day'}`}>
      <div className="dashboard">
        {/* LEVÝ SLOUPEC - Venku */}
        <div className="panel panel-left">
          <div className="panel-title">
            <IcoOutdoor color="#60a5fa" />
            <span>Venku</span>
            {outdoorError && <span className="data-error" title="Data nedostupná">●</span>}
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Teplota</span>
              <IcoTemp color="#7dd3fc" size={24} />
            </div>
            <span className="stat-card-value outdoor-temp">{outdoor?.temperature ?? '—'}<span className="stat-card-unit">{outdoor?.temperature != null ? '°C' : ''}</span></span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Vlhkost</span>
              <IcoHum color="#38bdf8" size={24} />
            </div>
            <span className="stat-card-value outdoor-hum">{outdoor?.humidity ?? '—'}<span className="stat-card-unit">{outdoor?.humidity != null ? '%' : ''}</span></span>
          </div>

          <div className="stat-card wind-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Vítr</span>
              <IcoWind color="#a78bfa" size={24} />
            </div>
            <div className="wind-row">
              <span className="stat-card-value wind-speed">{outdoor?.windSpeed ?? '—'}<span className="stat-card-unit">{outdoor?.windSpeed != null ? 'km/h' : ''}</span></span>
              <div className="wind-divider"></div>
              <div className="wind-dir-block">
                <span className="stat-card-value wind-dir">{outdoor?.windDirection ?? '—'}</span>
                <IcoCompass color="#c4b5fd" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* STŘEDNÍ SLOUPEC - Čas a datum */}
        <div className="panel panel-center">
          <div className="time-display">
            <span className="time-segment">{hours}</span>
            <span className="time-colon">:</span>
            <span className="time-segment">{minutes}</span>
            <span className="time-seconds">{seconds}</span>
          </div>
          <div className="date-display">
            <span className="day-name">{dayName}</span>
            <span className="day-number">{day}. {month}</span>
          </div>
          <div className="divider"></div>
          <div className="weather-condition-display">
            <span className="condition-icon">{getWeatherIcon(weatherCondition.condition, isNight, 52)}</span>
            <span className="condition-text">{weatherCondition.condition}</span>
          </div>

          {forecast.length > 0 && (
            <div className="forecast-strip">
              {forecast.slice(0, 4).map((item, i) => {
                const fDay = new Date(item.date + 'T12:00:00');
                const fDayNames = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
                return (
                  <div key={i} className="forecast-day">
                    <span className="forecast-day-name">{fDayNames[fDay.getDay()]}</span>
                    <span className="forecast-day-icon">{getWeatherIcon(item.condition, false, 34)}</span>
                    <span className="forecast-day-cond">{item.condition}</span>
                    <div className="forecast-day-temps">
                      <span className="forecast-temp-max">{item.tempMax}°</span>
                      <span className="forecast-temp-sep">/</span>
                      <span className="forecast-temp-min">{item.tempMin}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PRAVÝ SLOUPEC - Doma */}
        <div className="panel panel-right">
          <div className="panel-title">
            <IcoHome color="#fb923c" />
            <span>Doma</span>
            {indoorError && <span className="data-error" title="Senzor nedostupný">●</span>}
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Teplota</span>
              <IcoTemp color="#fb923c" size={24} />
            </div>
            <span className="stat-card-value indoor-temp">{indoor?.temperature ?? '—'}<span className="stat-card-unit">{indoor?.temperature != null ? '°C' : ''}</span></span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Vlhkost</span>
              <IcoHum color="#22d3ee" size={24} />
            </div>
            <span className="stat-card-value indoor-hum">{indoor?.humidity ?? '—'}<span className="stat-card-unit">{indoor?.humidity != null ? '%' : ''}</span></span>
          </div>

          {indoor?.updatedAt
            ? <div className="sensor-note">✔ {new Date(indoor.updatedAt).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}</div>
            : <div className="sensor-note">Senzor brzy</div>
          }
        </div>

      </div>
    </div>
  );
}

export default App;