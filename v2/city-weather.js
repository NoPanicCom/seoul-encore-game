const HOUR = 3600000;
const DAY = 24 * HOUR;
const KST = 9 * HOUR;
const SPEED = 60;
const CLOCK_KEY = 'encore.v2.seoul-clock.v1';
const FORECAST_KEY = 'encore.v2.seoul-forecast.v1';
const params = new URLSearchParams({
  latitude:'37.5665', longitude:'126.9780', hourly:'temperature_2m,weather_code,wind_speed_10m',
  daily:'sunrise,sunset', timezone:'Asia/Seoul', timeformat:'unixtime', forecast_days:'7',
});
const endpoint = 'https://api.open-meteo.com/v1/forecast?' + params;
const dateKey = ms => new Date(ms + KST).toISOString().slice(0, 10);
const dayNumber = ms => Math.floor((ms + KST) / DAY);
const hourAt = ms => ((ms + KST) % DAY) / HOUR;

export function weatherKind(code) {
  if (code >= 95) return 'storm';
  if ([71,73,75,77,85,86].includes(code)) return 'snow';
  if (code >= 51) return 'rain';
  if (code === 45 || code === 48) return 'fog';
  return code === 2 || code === 3 ? 'cloudy' : 'clear';
}

function solarHours(ms, report) {
  const date = dateKey(ms);
  if (report) {
    const i = report.daily.sunrise.findIndex(second => Number.isFinite(second) && dateKey(second * 1000) === date);
    if (i >= 0 && Number.isFinite(report.daily.sunset[i])) {
      return [hourAt(report.daily.sunrise[i] * 1000), hourAt(report.daily.sunset[i] * 1000)];
    }
  }
  // Latitude and seasonal solar declination approximate Seoul's daylight outside forecast coverage.
  const dayOfYear = (Date.parse(date) - Date.UTC(Number(date.slice(0,4)),0,1)) / DAY + 1;
  const declination = .409 * Math.sin(2*Math.PI*(dayOfYear-81)/365.24);
  const halfDay = Math.acos(-Math.tan(37.5665*Math.PI/180)*Math.tan(declination))*12/Math.PI;
  return [12.53-halfDay,12.53+halfDay];
}

function fallback(ms) {
  const day = dayNumber(ms);
  const hour = hourAt(ms);
  const month = new Date(ms+KST).getUTCMonth();
  const average = [-2,1,6,13,18,23,26,26,21,15,7,1][month];
  const hash = n => { const x = Math.sin(n*12.9898 + 78.233)*43758.5453; return x-Math.floor(x); };
  const front = hash(day*4+Math.floor(hour/6));
  const temperature = Math.round(average+4*Math.cos((hour-14)*Math.PI/12)+4*(hash(day)-.5));
  const weather = front < .43 ? 'clear' : front < .72 ? 'cloudy' : front < .79 ? 'fog' :
    temperature < 1 ? 'snow' : front > .96 && month >= 5 && month <= 8 ? 'storm' : 'rain';
  return {temperature,weather,windKph:Math.round(3+14*front)};
}

function usable(report) {
  const h = report?.hourly, d = report?.daily;
  if (!Array.isArray(h?.time) || !h.time.length || h.time.length > 384 ||
      !['temperature_2m','weather_code','wind_speed_10m'].every(k=>Array.isArray(h[k]) && h[k].length === h.time.length)) return false;
  if (!h.time.every((n,i)=>Number.isFinite(n) && (!i || n === h.time[i-1]+3600))) return false;
  return Array.isArray(d?.sunrise) && Array.isArray(d.sunset) && d.sunrise.length === d.sunset.length;
}

export function createCityWeather({now = Date.now, getStorage = () => localStorage, request = (...args)=>fetch(...args)} = {}) {
  function read(key) {
    try { return JSON.parse(getStorage().getItem(key)); } catch { return null; }
  }
  function write(key, value) {
    try { getStorage().setItem(key,JSON.stringify(value)); } catch { /* Session can continue in memory. */ }
  }

  const start = now();
  const previous = read(CLOCK_KEY);
  const resumed = Number.isFinite(previous?.at) && Math.abs(previous.at-start) < 366*DAY &&
    Number.isInteger(previous.firstDay) && previous.firstDay <= dayNumber(previous.at) && dayNumber(previous.at)-previous.firstDay < 366;
  let gameAnchor = resumed ? previous.at : start;
  let firstDay = resumed ? previous.firstDay : dayNumber(start);
  let realAnchor = start;
  let paused = false;
  let lastSaved = start;
  let report, fetchedAt = 0, source = 'simulation', retryAt = 0, pending;
  const stored = read(FORECAST_KEY);
  if (stored?.at > start-DAY && stored.at <= start && usable(stored.data)) {
    report = stored.data; fetchedAt = stored.at; source = 'cached';
  }

  function clock() { return gameAnchor + (paused ? 0 : Math.max(0,now()-realAnchor)*SPEED); }
  function save() {
    write(CLOCK_KEY,{at:clock(),firstDay});
    lastSaved = now();
  }

  async function refresh() {
    if (pending) return pending;
    if (now() < retryAt || (report && now()-fetchedAt < HOUR)) return;
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(),7000);
    pending = (async () => {
      try {
        const response = await request(endpoint,{signal:controller.signal, credentials:'omit', referrerPolicy:'no-referrer'});
        if (!response.ok) throw new Error('Forecast unavailable');
        const data = await response.json();
        if (!usable(data)) throw new Error('Invalid hourly weather');
        report = data; source = 'forecast'; fetchedAt = now();
        write(FORECAST_KEY,{at:fetchedAt,data});
      } catch {
        if (report) source = 'cached';
        retryAt = now()+5*60000;
      } finally { clearTimeout(timer); }
    })();
    try { await pending; } finally { pending = undefined; }
  }

  function sample() {
    const ms = clock();
    const hour = hourAt(ms);
    const [rise,set] = solarHours(ms,report);
    const ramp = x => { const a = Math.max(0,Math.min(1,x)); return a*a*(3-2*a); };
    const daylight = ramp((hour-rise+.6)/1.25) * ramp((set-hour+.7)/1.35);
    const result = {date:dateKey(ms), day:Math.max(1,dayNumber(ms)-firstDay+1), hour, sunriseHour:rise,
      sunsetHour:set, daylight, night:1-daylight};
    if (now()-lastSaved > 15000) save();
    const h = report?.hourly;
    const index = h ? Math.floor((ms/1000-h.time[0])/3600) : -1;
    if (h && index >= 0 && index < h.time.length && [h.temperature_2m[index],h.weather_code[index],h.wind_speed_10m[index]].every(Number.isFinite)) {
      return {...result,temperature:Math.round(h.temperature_2m[index]),windKph:Math.round(h.wind_speed_10m[index]),
        weather:weatherKind(h.weather_code[index]),source};
    }
    return {...result,...fallback(ms),source:'simulation'};
  }

  function jump(action) {
    const ms = clock();
    let target;
    if (action === 'now') { target = now(); firstDay = dayNumber(target); }
    else if (action === 'sunrise' || action === 'sunset') {
      const event = timestamp => {
        const hours = solarHours(timestamp,report);
        const h = action === 'sunrise' ? hours[0]+.25 : hours[1]+.75;
        return dayNumber(timestamp)*DAY-KST+h*HOUR;
      };
      target = event(ms);
      if (target <= ms) target = event(ms+DAY);
    } else return;
    gameAnchor = target; realAnchor = now(); save();
  }

  function pause(value) {
    if (paused === value) return;
    gameAnchor = clock(); realAnchor = now(); paused = value; save();
  }
  return {sample,jump,save,pause,refresh};
}
