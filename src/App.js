import { useState, useEffect } from 'react';
import './App.css';

const Icon = ({ d, size = 28, color = 'currentColor', strokeWidth = 1.5 }) => (
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

// Denní ikony
const dayIcons = {
  'clear': '☀️',
  'sunny': '☀️',
  'jasno': '☀️',
  'partly cloudy': '⛅',
  'polojasno': '⛅',
  'částečně oblačno': '⛅',
  'cloudy': '☁️',
  'oblačno': '☁️',
  'zataženo': '☁️',
  'overcast': '☁️',
  'rain': '🌧️',
  'déšť': '🌧️',
  'prší': '🌧️',
  'light rain': '🌦️',
  'mírný déšť': '🌦️',
  'heavy rain': '🌧️',
  'silný déšť': '🌧️',
  'thunderstorm': '⛈️',
  'bouřka': '⛈️',
  'thunder': '⛈️',
  'snow': '❄️',
  'sníh': '❄️',
  'sněží': '❄️',
  'light snow': '🌨️',
  'mírné sněžení': '🌨️',
  'fog': '🌫️',
  'mlha': '🌫️',
  'mist': '🌫️',
  'windy': '💨',
  'větrno': '💨',
  'default': '🌤️'
};

// Noční ikony
const nightIcons = {
  'clear': '🌙',
  'sunny': '🌙',
  'jasno': '🌙',
  'partly cloudy': '🌙',
  'polojasno': '🌙',
  'částečně oblačno': '🌙',
  'cloudy': '☁️',
  'oblačno': '☁️',
  'zataženo': '☁️',
  'overcast': '☁️',
  'rain': '🌧️',
  'déšť': '🌧️',
  'prší': '🌧️',
  'light rain': '🌧️',
  'mírný déšť': '🌧️',
  'heavy rain': '🌧️',
  'silný déšť': '🌧️',
  'thunderstorm': '⛈️',
  'bouřka': '⛈️',
  'thunder': '⛈️',
  'snow': '❄️',
  'sníh': '❄️',
  'sněží': '❄️',
  'light snow': '🌨️',
  'mírné sněžení': '🌨️',
  'fog': '🌫️',
  'mlha': '🌫️',
  'mist': '🌫️',
  'windy': '💨',
  'větrno': '💨',
  'default': '🌙'
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

// Funkce pro získání ikony podle stavu a času
const getWeatherIcon = (condition, isNight) => {
  const key = condition.toLowerCase();
  const icons = isNight ? nightIcons : dayIcons;
  return icons[key] || icons['default'];
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
  const [weatherCondition, setWeatherCondition] = useState({ condition: 'Načítání...', icon: '⏳' });
  const [weatherTheme, setWeatherTheme] = useState('theme-default');
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
        // Stav počasí pochází ze serveru (Open-Meteo, WMO kód → text)
        if (data.condition) {
          const night = isNightTime(new Date());
          setWeatherCondition({
            condition: data.condition,
            icon: getWeatherIcon(data.condition, night)
          });
          setWeatherTheme(getWeatherTheme(data.condition));
        } else {
          // condition zatím null (wttr.in ještě neodpověděl) - zkus za 30s znovu
          retryTimer = setTimeout(fetchOutdoor, 30 * 1000);
        }
      } catch (e) {
        console.error('Data nedostupná:', e.message);
        setOutdoorError(true);
        setWeatherCondition({ condition: 'Nedostupné', icon: '❓' });
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
      icon: getWeatherIcon(currentDemo.condition, nightMode)
    });
    setWeatherTheme(currentDemo.theme);
    setIsNight(nightMode);
  }, [demoIndex, demoNight]);

  // Aktualizace ikony při změně den/noc
  useEffect(() => {
    if (DEMO_MODE) return;
    if (weatherCondition.condition !== 'Načítání...' && weatherCondition.condition !== 'Nedostupné') {
      setWeatherCondition(prev => ({
        ...prev,
        icon: getWeatherIcon(prev.condition, isNight)
      }));
    }
  }, [isNight, weatherCondition.condition]);

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
              <IcoTemp color="#7dd3fc" size={22} />
            </div>
            <span className="stat-card-value outdoor-temp">{outdoor?.temperature ?? '—'}<span className="stat-card-unit">{outdoor?.temperature != null ? '°C' : ''}</span></span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Vlhkost</span>
              <IcoHum color="#38bdf8" size={22} />
            </div>
            <span className="stat-card-value outdoor-hum">{outdoor?.humidity ?? '—'}<span className="stat-card-unit">{outdoor?.humidity != null ? '%' : ''}</span></span>
          </div>

          <div className="stat-card wind-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Vítr</span>
              <IcoWind color="#a78bfa" size={22} />
            </div>
            <div className="wind-row">
              <span className="stat-card-value wind-speed">{outdoor?.windSpeed ?? '—'}<span className="stat-card-unit">{outdoor?.windSpeed != null ? 'km/h' : ''}</span></span>
              <div className="wind-divider"></div>
              <div className="wind-dir-block">
                <span className="stat-card-value wind-dir">{outdoor?.windDirection ?? '—'}</span>
                <IcoCompass color="#c4b5fd" size={18} />
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
            <span className="condition-icon">{weatherCondition.icon}</span>
            <span className="condition-text">{weatherCondition.condition}</span>
          </div>
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
              <IcoTemp color="#fb923c" size={22} />
            </div>
            <span className="stat-card-value indoor-temp">{indoor?.temperature ?? '—'}<span className="stat-card-unit">{indoor?.temperature != null ? '°C' : ''}</span></span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Vlhkost</span>
              <IcoHum color="#22d3ee" size={22} />
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