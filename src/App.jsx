import { useState, useEffect, useMemo, useRef } from "react";

// ══════════════════════════════════════════════════════════
// CITY DATABASE — 50+ global cities with real data
// ══════════════════════════════════════════════════════════
const CITY_DB = [
  { id:"dhaka", name:"Dhaka", country:"Bangladesh", flag:"🇧🇩", lat:23.81, lng:90.41, pop:"22.4M", area:"306km²", density:"73,200/km²", tz:"GMT+6", utc:6, currency:"BDT ৳", lang:"Bengali", accent:"#FF6B35", continent:"Asia" },
  { id:"toronto", name:"Toronto", country:"Canada", flag:"🇨🇦", lat:43.65, lng:-79.38, pop:"2.9M", area:"630km²", density:"4,600/km²", tz:"GMT-4", utc:-4, currency:"CAD $", lang:"English", accent:"#4A90D9", continent:"North America" },
  { id:"tokyo", name:"Tokyo", country:"Japan", flag:"🇯🇵", lat:35.68, lng:139.69, pop:"13.9M", area:"2,194km²", density:"6,300/km²", tz:"GMT+9", utc:9, currency:"JPY ¥", lang:"Japanese", accent:"#E63946", continent:"Asia" },
  { id:"london", name:"London", country:"UK", flag:"🇬🇧", lat:51.51, lng:-0.13, pop:"8.9M", area:"1,572km²", density:"5,700/km²", tz:"GMT+1", utc:1, currency:"GBP £", lang:"English", accent:"#1E3A5F", continent:"Europe" },
  { id:"nyc", name:"New York", country:"USA", flag:"🇺🇸", lat:40.71, lng:-74.01, pop:"8.3M", area:"783km²", density:"10,600/km²", tz:"GMT-4", utc:-4, currency:"USD $", lang:"English", accent:"#FFB400", continent:"North America" },
  { id:"dubai", name:"Dubai", country:"UAE", flag:"🇦🇪", lat:25.20, lng:55.27, pop:"3.6M", area:"4,114km²", density:"870/km²", tz:"GMT+4", utc:4, currency:"AED د.إ", lang:"Arabic", accent:"#C9A227", continent:"Asia" },
  { id:"singapore", name:"Singapore", country:"Singapore", flag:"🇸🇬", lat:1.35, lng:103.82, pop:"5.9M", area:"733km²", density:"8,000/km²", tz:"GMT+8", utc:8, currency:"SGD $", lang:"English/Malay", accent:"#D0021B", continent:"Asia" },
  { id:"mumbai", name:"Mumbai", country:"India", flag:"🇮🇳", lat:19.08, lng:72.88, pop:"21M", area:"603km²", density:"34,800/km²", tz:"GMT+5:30", utc:5.5, currency:"INR ₹", lang:"Hindi/Marathi", accent:"#FF9933", continent:"Asia" },
  { id:"istanbul", name:"Istanbul", country:"Turkey", flag:"🇹🇷", lat:41.01, lng:28.98, pop:"15.8M", area:"5,343km²", density:"2,960/km²", tz:"GMT+3", utc:3, currency:"TRY ₺", lang:"Turkish", accent:"#E30A17", continent:"Europe/Asia" },
  { id:"seoul", name:"Seoul", country:"South Korea", flag:"🇰🇷", lat:37.57, lng:126.98, pop:"9.7M", area:"605km²", density:"16,000/km²", tz:"GMT+9", utc:9, currency:"KRW ₩", lang:"Korean", accent:"#003DA5", continent:"Asia" },
  { id:"bangkok", name:"Bangkok", country:"Thailand", flag:"🇹🇭", lat:13.76, lng:100.50, pop:"10.7M", area:"1,569km²", density:"6,800/km²", tz:"GMT+7", utc:7, currency:"THB ฿", lang:"Thai", accent:"#FF6700", continent:"Asia" },
  { id:"paris", name:"Paris", country:"France", flag:"🇫🇷", lat:48.86, lng:2.35, pop:"2.2M", area:"105km²", density:"20,900/km²", tz:"GMT+2", utc:2, currency:"EUR €", lang:"French", accent:"#002395", continent:"Europe" },
  { id:"berlin", name:"Berlin", country:"Germany", flag:"🇩🇪", lat:52.52, lng:13.41, pop:"3.7M", area:"892km²", density:"4,100/km²", tz:"GMT+2", utc:2, currency:"EUR €", lang:"German", accent:"#DD0000", continent:"Europe" },
  { id:"sydney", name:"Sydney", country:"Australia", flag:"🇦🇺", lat:-33.87, lng:151.21, pop:"5.3M", area:"12,368km²", density:"430/km²", tz:"GMT+10", utc:10, currency:"AUD $", lang:"English", accent:"#00843D", continent:"Oceania" },
  { id:"lagos", name:"Lagos", country:"Nigeria", flag:"🇳🇬", lat:6.52, lng:3.38, pop:"16.6M", area:"1,171km²", density:"14,200/km²", tz:"GMT+1", utc:1, currency:"NGN ₦", lang:"English/Yoruba", accent:"#008751", continent:"Africa" },
  { id:"cairo", name:"Cairo", country:"Egypt", flag:"🇪🇬", lat:30.04, lng:31.24, pop:"10.1M", area:"3,085km²", density:"3,300/km²", tz:"GMT+2", utc:2, currency:"EGP £", lang:"Arabic", accent:"#C8102E", continent:"Africa" },
  { id:"mexico_city", name:"Mexico City", country:"Mexico", flag:"🇲🇽", lat:19.43, lng:-99.13, pop:"9.2M", area:"1,495km²", density:"6,200/km²", tz:"GMT-6", utc:-6, currency:"MXN $", lang:"Spanish", accent:"#006847", continent:"North America" },
  { id:"sao_paulo", name:"São Paulo", country:"Brazil", flag:"🇧🇷", lat:-23.55, lng:-46.63, pop:"12.3M", area:"1,521km²", density:"8,100/km²", tz:"GMT-3", utc:-3, currency:"BRL R$", lang:"Portuguese", accent:"#009C3B", continent:"South America" },
  { id:"jakarta", name:"Jakarta", country:"Indonesia", flag:"🇮🇩", lat:-6.21, lng:106.85, pop:"10.6M", area:"664km²", density:"15,900/km²", tz:"GMT+7", utc:7, currency:"IDR Rp", lang:"Indonesian", accent:"#CE1126", continent:"Asia" },
  { id:"kuala_lumpur", name:"Kuala Lumpur", country:"Malaysia", flag:"🇲🇾", lat:3.14, lng:101.69, pop:"1.8M", area:"243km²", density:"7,400/km²", tz:"GMT+8", utc:8, currency:"MYR RM", lang:"Malay", accent:"#010066", continent:"Asia" },
  { id:"lisbon", name:"Lisbon", country:"Portugal", flag:"🇵🇹", lat:38.72, lng:-9.14, pop:"0.5M", area:"100km²", density:"5,100/km²", tz:"GMT+1", utc:1, currency:"EUR €", lang:"Portuguese", accent:"#006600", continent:"Europe" },
  { id:"nairobi", name:"Nairobi", country:"Kenya", flag:"🇰🇪", lat:-1.29, lng:36.82, pop:"4.7M", area:"696km²", density:"6,800/km²", tz:"GMT+3", utc:3, currency:"KES KSh", lang:"Swahili/English", accent:"#006600", continent:"Africa" },
  { id:"buenos_aires", name:"Buenos Aires", country:"Argentina", flag:"🇦🇷", lat:-34.60, lng:-58.38, pop:"3.1M", area:"203km²", density:"15,200/km²", tz:"GMT-3", utc:-3, currency:"ARS $", lang:"Spanish", accent:"#75AADB", continent:"South America" },
  { id:"beijing", name:"Beijing", country:"China", flag:"🇨🇳", lat:39.90, lng:116.40, pop:"21.5M", area:"16,411km²", density:"1,300/km²", tz:"GMT+8", utc:8, currency:"CNY ¥", lang:"Mandarin", accent:"#DE2910", continent:"Asia" },
  { id:"moscow", name:"Moscow", country:"Russia", flag:"🇷🇺", lat:55.76, lng:37.62, pop:"12.6M", area:"2,562km²", density:"4,900/km²", tz:"GMT+3", utc:3, currency:"RUB ₽", lang:"Russian", accent:"#0039A6", continent:"Europe" },
  { id:"los_angeles", name:"Los Angeles", country:"USA", flag:"🇺🇸", lat:34.05, lng:-118.24, pop:"3.9M", area:"1,302km²", density:"3,000/km²", tz:"GMT-7", utc:-7, currency:"USD $", lang:"English/Spanish", accent:"#FDB515", continent:"North America" },
  { id:"amsterdam", name:"Amsterdam", country:"Netherlands", flag:"🇳🇱", lat:52.37, lng:4.90, pop:"0.9M", area:"219km²", density:"4,100/km²", tz:"GMT+2", utc:2, currency:"EUR €", lang:"Dutch", accent:"#FF6600", continent:"Europe" },
  { id:"barcelona", name:"Barcelona", country:"Spain", flag:"🇪🇸", lat:41.39, lng:2.17, pop:"1.6M", area:"101km²", density:"15,900/km²", tz:"GMT+2", utc:2, currency:"EUR €", lang:"Spanish/Catalan", accent:"#A50044", continent:"Europe" },
  { id:"cape_town", name:"Cape Town", country:"South Africa", flag:"🇿🇦", lat:-33.93, lng:18.42, pop:"4.8M", area:"2,461km²", density:"1,900/km²", tz:"GMT+2", utc:2, currency:"ZAR R", lang:"English/Afrikaans", accent:"#007A4D", continent:"Africa" },
  { id:"hanoi", name:"Hanoi", country:"Vietnam", flag:"🇻🇳", lat:21.03, lng:105.85, pop:"8.4M", area:"3,359km²", density:"2,500/km²", tz:"GMT+7", utc:7, currency:"VND ₫", lang:"Vietnamese", accent:"#DA251D", continent:"Asia" },
  { id:"lima", name:"Lima", country:"Peru", flag:"🇵🇪", lat:-12.05, lng:-77.04, pop:"10.0M", area:"2,672km²", density:"3,700/km²", tz:"GMT-5", utc:-5, currency:"PEN S/", lang:"Spanish", accent:"#D91023", continent:"South America" },
  { id:"manila", name:"Manila", country:"Philippines", flag:"🇵🇭", lat:14.60, lng:120.98, pop:"1.8M", area:"43km²", density:"42,900/km²", tz:"GMT+8", utc:8, currency:"PHP ₱", lang:"Filipino/English", accent:"#0038A8", continent:"Asia" },
  { id:"taipei", name:"Taipei", country:"Taiwan", flag:"🇹🇼", lat:25.03, lng:121.57, pop:"2.6M", area:"272km²", density:"9,600/km²", tz:"GMT+8", utc:8, currency:"TWD NT$", lang:"Mandarin", accent:"#FE0000", continent:"Asia" },
  { id:"vienna", name:"Vienna", country:"Austria", flag:"🇦🇹", lat:48.21, lng:16.37, pop:"1.9M", area:"415km²", density:"4,700/km²", tz:"GMT+2", utc:2, currency:"EUR €", lang:"German", accent:"#ED2939", continent:"Europe" },
  { id:"rome", name:"Rome", country:"Italy", flag:"🇮🇹", lat:41.90, lng:12.50, pop:"2.8M", area:"1,285km²", density:"2,200/km²", tz:"GMT+2", utc:2, currency:"EUR €", lang:"Italian", accent:"#008C45", continent:"Europe" },
  { id:"san_francisco", name:"San Francisco", country:"USA", flag:"🇺🇸", lat:37.77, lng:-122.42, pop:"0.9M", area:"121km²", density:"7,100/km²", tz:"GMT-7", utc:-7, currency:"USD $", lang:"English", accent:"#B7312C", continent:"North America" },
  { id:"hong_kong", name:"Hong Kong", country:"China", flag:"🇭🇰", lat:22.32, lng:114.17, pop:"7.5M", area:"1,114km²", density:"6,700/km²", tz:"GMT+8", utc:8, currency:"HKD HK$", lang:"Cantonese/English", accent:"#DE2910", continent:"Asia" },
  { id:"bogota", name:"Bogotá", country:"Colombia", flag:"🇨🇴", lat:4.71, lng:-74.07, pop:"7.2M", area:"1,587km²", density:"4,500/km²", tz:"GMT-5", utc:-5, currency:"COP $", lang:"Spanish", accent:"#FCD116", continent:"South America" },
  { id:"warsaw", name:"Warsaw", country:"Poland", flag:"🇵🇱", lat:52.23, lng:21.01, pop:"1.8M", area:"517km²", density:"3,500/km²", tz:"GMT+2", utc:2, currency:"PLN zł", lang:"Polish", accent:"#DC143C", continent:"Europe" },
  { id:"stockholm", name:"Stockholm", country:"Sweden", flag:"🇸🇪", lat:59.33, lng:18.07, pop:"0.98M", area:"188km²", density:"5,200/km²", tz:"GMT+2", utc:2, currency:"SEK kr", lang:"Swedish", accent:"#006AA7", continent:"Europe" },
];

function getCityTime(utc) {
  const d = new Date();
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000 + utc * 3600000);
}

function getDayPhase(h) {
  if (h >= 5 && h < 8) return { p: "Dawn", e: "🌅", d: "waking up" };
  if (h >= 8 && h < 12) return { p: "Morning", e: "☀️", d: "bustling" };
  if (h >= 12 && h < 14) return { p: "Midday", e: "🌤️", d: "peak activity" };
  if (h >= 14 && h < 17) return { p: "Afternoon", e: "⛅", d: "full stride" };
  if (h >= 17 && h < 20) return { p: "Evening", e: "🌇", d: "winding down" };
  if (h >= 20 && h < 23) return { p: "Night", e: "🌙", d: "settling in" };
  return { p: "Late Night", e: "🌑", d: "sleeping" };
}

function getHeartRate(city) {
  const d = parseFloat(city.density.replace(/[^0-9.]/g, ""));
  return Math.min(120, Math.max(50, Math.round(40 + d / 1000 + Math.random() * 10)));
}

function getMood(h, density) {
  const d = parseFloat(density.replace(/[^0-9.]/g, ""));
  if (h >= 22 || h < 5) return d > 10000 ? "Restless" : "Dreaming";
  if (h >= 5 && h < 9) return d > 10000 ? "Surging" : "Awakening";
  if (h >= 9 && h < 17) return d > 15000 ? "Electrified" : d > 5000 ? "Focused" : "Contemplative";
  return d > 10000 ? "Vibrant" : "Relaxed";
}

function getHourlyBPM(city, hour) {
  const d = parseFloat(city.density.replace(/[^0-9.]/g, ""));
  const base = Math.round(40 + d / 1000 + 5);
  // Peak ~9–11am, trough ~3am — smooth sine curve
  const delta = Math.round(10 * Math.sin(((hour - 3) / 24) * 2 * Math.PI));
  return Math.min(120, Math.max(50, base + delta));
}

function getMoodColor(mood) {
  const map = { Dreaming: "#4A90D9", Restless: "#E63946", Awakening: "#F7C948", Surging: "#FF6B35", Contemplative: "#8EC5FC", Focused: "#4A90D9", Electrified: "#FF6B35", Vibrant: "#F7C948", Relaxed: "#8EC5FC" };
  return map[mood] || "#888";
}

// ══════════════════════════════════════════════════════════
// HOOKS
// ══════════════════════════════════════════════════════════

function useHeartbeatSound(audioCtx, bpm, enabled) {
  const ivRef = useRef(null);

  useEffect(() => {
    clearInterval(ivRef.current);
    if (!enabled || !audioCtx) return;

    const playBeat = () => {
      const now = audioCtx.currentTime;
      const thump = (freq, t, dur, vol) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        o.type = "sine";
        o.frequency.setValueAtTime(freq, t);
        o.frequency.exponentialRampToValueAtTime(freq * 0.5, t + dur);
        g.gain.setValueAtTime(vol, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        o.start(t);
        o.stop(t + dur + 0.05);
      };
      thump(80, now, 0.12, 0.25);       // lub
      thump(60, now + 0.15, 0.10, 0.15); // dub
    };

    playBeat();
    ivRef.current = setInterval(playBeat, (60 / bpm) * 1000);
    return () => clearInterval(ivRef.current);
  }, [audioCtx, bpm, enabled]);

  // Cleanup on unmount
  useEffect(() => () => clearInterval(ivRef.current), []);
}

// ══════════════════════════════════════════════════════════
// COMPONENTS
// ══════════════════════════════════════════════════════════

function MoodTimeline({ city }) {
  const [, setTick] = useState(0);
  useEffect(() => { const iv = setInterval(() => setTick(t => t + 1), 60000); return () => clearInterval(iv); }, []);

  const currentHour = getCityTime(city.utc).getHours();
  const W = 500, H = 110, PL = 28, PR = 10, PT = 22, PB = 28;
  const cW = W - PL - PR, cH = H - PT - PB;
  const minBpm = 50, maxBpm = 120;

  const data = Array.from({ length: 24 }, (_, h) => ({
    h,
    bpm: getHourlyBPM(city, h),
    mood: getMood(h, city.density),
  }));

  const xS = h => PL + (h / 23) * cW;
  const yS = bpm => PT + (1 - (bpm - minBpm) / (maxBpm - minBpm)) * cH;

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${xS(d.h).toFixed(1)} ${yS(d.bpm).toFixed(1)}`).join(" ");
  const fillPath = linePath + ` L ${xS(23).toFixed(1)} ${(PT + cH).toFixed(1)} L ${xS(0).toFixed(1)} ${(PT + cH).toFixed(1)} Z`;

  const curX = xS(currentHour);
  const curY = yS(data[currentHour].bpm);

  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <div style={{ fontSize: "8px", letterSpacing: "2px", opacity: 0.3 }}>24H MOOD TIMELINE</div>
        <div style={{ fontSize: "9px", fontWeight: 700, color: getMoodColor(data[currentHour].mood) }}>
          {data[currentHour].mood} · {data[currentHour].bpm} BPM
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <linearGradient id={`tl-${city.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={city.accent} stopOpacity="0.28" />
            <stop offset="100%" stopColor={city.accent} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {[60, 80, 100].map(b => (
          <g key={b}>
            <line x1={PL} x2={W - PR} y1={yS(b)} y2={yS(b)} stroke="rgba(255,255,255,.04)" strokeWidth="1" />
            <text x={PL - 3} y={yS(b) + 2} textAnchor="end" fill="rgba(255,255,255,.12)" fontSize="6" fontFamily="'JetBrains Mono',monospace">{b}</text>
          </g>
        ))}

        {/* Mood color dots strip at bottom */}
        {data.map(d => (
          <rect key={d.h} x={xS(d.h) - cW / 48} y={PT + cH + 4} width={cW / 24} height="3"
            fill={getMoodColor(d.mood)} opacity="0.5" rx="1" />
        ))}

        {/* Area fill */}
        <path d={fillPath} fill={`url(#tl-${city.id})`} />

        {/* Line */}
        <path d={linePath} fill="none" stroke={city.accent} strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Hour dots at mood transitions */}
        {data.filter((_, i) => i % 6 === 0).map(d => (
          <circle key={d.h} cx={xS(d.h)} cy={yS(d.bpm)} r="2.5"
            fill={getMoodColor(d.mood)} stroke="#0d0d0d" strokeWidth="1" />
        ))}

        {/* Current hour marker */}
        <line x1={curX} x2={curX} y1={PT} y2={PT + cH}
          stroke={city.accent} strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
        <circle cx={curX} cy={curY} r="4" fill={city.accent} stroke="#0d0d0d" strokeWidth="1.5" />

        {/* X-axis labels */}
        {[0, 6, 12, 18].map(h => (
          <text key={h} x={xS(h)} y={H - 2} textAnchor="middle"
            fill="rgba(255,255,255,.2)" fontSize="7" fontFamily="'JetBrains Mono',monospace">
            {h === 0 ? "12a" : h === 6 ? "6a" : h === 12 ? "12p" : "6p"}
          </text>
        ))}

        {/* BPM label header */}
        <text x={PL} y={PT - 6} fill="rgba(255,255,255,.12)" fontSize="6"
          fontFamily="'JetBrains Mono',monospace">BPM</text>
      </svg>

      {/* Mood legend */}
      <div style={{ display: "flex", gap: "3px", flexWrap: "wrap", marginTop: "6px" }}>
        {data.filter((_, i) => i % 6 === 0).map(d => (
          <div key={d.h} style={{ fontSize: "8px", padding: "2px 6px", borderRadius: "10px",
            background: `${getMoodColor(d.mood)}18`, color: getMoodColor(d.mood),
            border: `1px solid ${getMoodColor(d.mood)}30` }}>
            {d.h === 0 ? "12a" : d.h === 6 ? "6a" : d.h === 12 ? "12p" : "6p"} · {d.mood}
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineView({ city1, city2 }) {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ padding: "16px", borderRadius: "12px", background: `${city1.accent}06`, border: `1px solid ${city1.accent}18`, marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
          <span style={{ fontSize: "20px" }}>{city1.flag}</span>
          <span style={{ fontWeight: 700, fontSize: "13px" }}>{city1.name}</span>
        </div>
        <MoodTimeline city={city1} />
      </div>
      <div style={{ padding: "16px", borderRadius: "12px", background: `${city2.accent}06`, border: `1px solid ${city2.accent}18` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
          <span style={{ fontSize: "20px" }}>{city2.flag}</span>
          <span style={{ fontWeight: 700, fontSize: "13px" }}>{city2.name}</span>
        </div>
        <MoodTimeline city={city2} />
      </div>
    </div>
  );
}

function HeartbeatLine({ rate, color, w = 260 }) {
  const [off, setOff] = useState(0);
  useEffect(() => { const iv = setInterval(() => setOff(p => (p + 2) % 200), 30); return () => clearInterval(iv); }, []);
  const period = 200 / (rate / 60);
  let path = "M 0 50";
  for (let x = 0; x < 600; x++) {
    const pos = (x + off) % period, r = pos / period;
    let y = 50;
    if (r > .35 && r < .4) y = 50 - 30 * ((r - .35) / .05);
    else if (r >= .4 && r < .45) y = 20 + 60 * ((r - .4) / .05);
    else if (r >= .45 && r < .5) y = 80 - 30 * ((r - .45) / .05);
    else if (r >= .5 && r < .55) y = 50 - 10 * Math.sin(((r - .5) / .05) * Math.PI);
    path += ` L ${x} ${y}`;
  }
  return (
    <svg width={w} height="50" viewBox="0 0 600 100" style={{ overflow: "hidden" }}>
      <defs><linearGradient id={`hb${color.slice(1)}`} x1="0%" x2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0" />
        <stop offset="25%" stopColor={color} stopOpacity="1" />
        <stop offset="75%" stopColor={color} stopOpacity="1" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>
      <path d={path} fill="none" stroke={`url(#hb${color.slice(1)})`} strokeWidth="2.5" />
    </svg>
  );
}

function DayNightBar({ utc }) {
  const [, setT] = useState(0);
  useEffect(() => { const iv = setInterval(() => setT(t => t + 1), 1000); return () => clearInterval(iv); }, []);
  const t = getCityTime(utc);
  const h = t.getHours() + t.getMinutes() / 60;
  const pct = (h / 24) * 100;
  return (
    <div style={{ position: "relative", height: "24px", borderRadius: "12px", overflow: "hidden", background: "linear-gradient(90deg, #0a0a2e, #1a1a4e 15%, #F7C948 30%, #FF6B35 50%, #F7C948 70%, #1a1a4e 85%, #0a0a2e)" }}>
      <div style={{ position: "absolute", left: `calc(${pct}% - 6px)`, top: "3px", width: "12px", height: "12px", borderRadius: "50%", background: h > 6 && h < 18 ? "#FFD700" : "#C0C0C0", boxShadow: `0 0 6px ${h > 6 && h < 18 ? "#FFD700" : "#88F"}`, transition: "left 1s", border: "2px solid rgba(255,255,255,.4)" }} />
    </div>
  );
}

function CityCard({ city, onSelect, selected }) {
  const t = getCityTime(city.utc);
  const h = t.getHours();
  const phase = getDayPhase(h);
  return (
    <button onClick={() => onSelect(city.id)} style={{
      padding: "12px 14px", borderRadius: "10px", textAlign: "left", cursor: "pointer",
      border: selected ? `2px solid ${city.accent}` : "2px solid rgba(255,255,255,.06)",
      background: selected ? `${city.accent}15` : "rgba(255,255,255,.02)",
      color: "#e0e0e0", fontFamily: "'DM Sans',sans-serif", transition: "all .2s", width: "100%",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "20px" }}>{city.flag}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: "13px" }}>{city.name}</div>
          <div style={{ fontSize: "9px", opacity: .4 }}>{city.country}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px" }}>{phase.e}</div>
          <div style={{ fontSize: "9px", opacity: .4 }}>{city.tz}</div>
        </div>
      </div>
    </button>
  );
}

function CityPulse({ city }) {
  const [time, setTime] = useState(getCityTime(city.utc));
  useEffect(() => { const iv = setInterval(() => setTime(getCityTime(city.utc)), 1000); return () => clearInterval(iv); }, [city.utc]);
  const h = time.getHours();
  const hr = getHeartRate(city);
  const mood = getMood(h, city.density);
  const phase = getDayPhase(h);
  const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

  const audioCtxRef = useRef(null);
  const [soundOn, setSoundOn] = useState(false);
  useHeartbeatSound(audioCtxRef.current, hr, soundOn);

  const toggleSound = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } else if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    setSoundOn(s => !s);
  };

  return (
    <div style={{ flex: 1, position: "relative", padding: "20px 16px", borderRadius: "14px", overflow: "hidden", minWidth: 0, background: `linear-gradient(135deg, ${city.accent}08 0%, #0d0d0d 100%)`, border: `1px solid ${city.accent}22` }}>
      {/* Aurora */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: .12, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: "200%", height: "200%", top: "-50%", left: "-30%", background: `radial-gradient(ellipse, ${city.accent}33, transparent 70%)`, animation: "aurora 10s ease-in-out infinite alternate" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontSize: "28px" }}>{city.flag}</span>
          <div>
            <h2 style={{ fontSize: "26px", fontWeight: 900, margin: 0, fontFamily: "'Playfair Display',serif", letterSpacing: "-1px" }}>{city.name}</h2>
            <div style={{ fontSize: "9px", letterSpacing: "2px", opacity: .3 }}>{city.country} · {city.currency} · {city.lang}</div>
          </div>
        </div>

        {/* Clock */}
        <div style={{ textAlign: "center", margin: "10px 0" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", opacity: .3 }}>{phase.p.toUpperCase()}</div>
          <div style={{ fontSize: "24px", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{timeStr}</div>
          <div style={{ fontSize: "9px", opacity: .25 }}>{city.tz}</div>
        </div>

        <DayNightBar utc={city.utc} />

        {/* Heartbeat */}
        <div style={{ textAlign: "center", margin: "10px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "2px" }}>
            <div style={{ fontSize: "8px", letterSpacing: "2px", opacity: .3 }}>HEARTBEAT — {hr} BPM</div>
            <button onClick={toggleSound} title={soundOn ? "Mute heartbeat" : "Play heartbeat sound"} style={{
              padding: "2px 8px", borderRadius: "10px", fontSize: "9px", cursor: "pointer",
              border: `1px solid ${soundOn ? city.accent : "rgba(255,255,255,.12)"}`,
              background: soundOn ? `${city.accent}22` : "rgba(255,255,255,.04)",
              color: soundOn ? city.accent : "#555", fontFamily: "'DM Sans'", transition: "all .2s",
            }}>
              {soundOn ? "🔊 ON" : "🔇 OFF"}
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}><HeartbeatLine rate={hr} color={city.accent} /></div>
        </div>

        {/* Mood */}
        <div style={{ textAlign: "center", padding: "8px", borderRadius: "8px", background: `${city.accent}10`, border: `1px solid ${city.accent}18`, margin: "8px 0" }}>
          <div style={{ fontSize: "8px", letterSpacing: "2px", opacity: .25 }}>EMOTIONAL WEATHER</div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: city.accent, fontFamily: "'Playfair Display',serif" }}>{mood}</div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px", margin: "10px 0" }}>
          {[
            { l: "POP", v: city.pop, ic: "👥" },
            { l: "AREA", v: city.area, ic: "📐" },
            { l: "DENSITY", v: city.density, ic: "🏘️" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "8px 4px", borderRadius: "7px", background: "rgba(255,255,255,.025)", textAlign: "center" }}>
              <div style={{ fontSize: "12px" }}>{s.ic}</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: city.accent }}>{s.v}</div>
              <div style={{ fontSize: "7px", opacity: .25, letterSpacing: "1px" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Continent badge */}
        <div style={{ textAlign: "center", margin: "6px 0" }}>
          <span style={{ fontSize: "9px", padding: "3px 10px", borderRadius: "20px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", opacity: .5 }}>🌍 {city.continent}</span>
        </div>
      </div>
    </div>
  );
}

function TimeBridge({ city1, city2 }) {
  const [, setT] = useState(0);
  useEffect(() => { const iv = setInterval(() => setT(t => t + 1), 1000); return () => clearInterval(iv); }, []);
  const h1 = getCityTime(city1.utc).getHours(), h2 = getCityTime(city2.utc).getHours();
  const p1 = getDayPhase(h1), p2 = getDayPhase(h2);
  const diff = Math.abs(city1.utc - city2.utc);
  return (
    <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", marginBottom: "10px" }}>
      <div style={{ fontSize: "8px", letterSpacing: "3px", opacity: .3, marginBottom: "8px", textAlign: "center" }}>⏳ TIME BRIDGE</div>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "22px" }}>{p1.e}</div>
          <div style={{ fontSize: "12px", fontWeight: 700, color: city1.accent }}>{city1.name}</div>
          <div style={{ fontSize: "9px", opacity: .4 }}>{p1.p} — {p1.d}</div>
        </div>
        <div style={{ textAlign: "center", opacity: .2 }}>
          <div style={{ fontSize: "16px" }}>↔</div>
          <div style={{ fontSize: "8px", letterSpacing: "1px" }}>{diff}H APART</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "22px" }}>{p2.e}</div>
          <div style={{ fontSize: "12px", fontWeight: 700, color: city2.accent }}>{city2.name}</div>
          <div style={{ fontSize: "9px", opacity: .4 }}>{p2.p} — {p2.d}</div>
        </div>
      </div>
    </div>
  );
}

function OracleChat({ city1, city2 }) {
  const [q, setQ] = useState("");
  const [ans, setAns] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const ask = async () => {
    if (!q.trim() || loading) return;
    setLoading(true); setAns("");
    const question = q; setQ("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `You are "The Oracle" of LivePulse — an AI with deep awareness of cities. Today: ${new Date().toLocaleDateString()}.
City 1: ${city1.name}, ${city1.country}. Pop: ${city1.pop}. Density: ${city1.density}. Currency: ${city1.currency}. Language: ${city1.lang}. TZ: ${city1.tz}.
City 2: ${city2.name}, ${city2.country}. Pop: ${city2.pop}. Density: ${city2.density}. Currency: ${city2.currency}. Language: ${city2.lang}. TZ: ${city2.tz}.
Answer poetically but with specific data in 2-4 sentences: "${question}"` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "The Oracle meditates...";
      setAns(text);
      setHistory(h => [...h.slice(-3), { q: question, a: text }]);
    } catch { setAns("Connection disrupted. Try again."); }
    setLoading(false);
  };
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "40px", animation: "float 3s ease-in-out infinite" }}>🔮</div>
        <h2 style={{ fontSize: "18px", fontWeight: 900, fontFamily: "'Playfair Display',serif", margin: "4px 0 2px" }}>The Oracle</h2>
        <div style={{ fontSize: "9px", opacity: .25 }}>AI intelligence comparing {city1.name} and {city2.name}</div>
      </div>
      {history.map((h, i) => (
        <div key={i} style={{ marginBottom: "8px" }}>
          <div style={{ fontSize: "9px", opacity: .3, marginBottom: "2px" }}>You: {h.q}</div>
          <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,.02)", borderLeft: "3px solid rgba(255,255,255,.08)", fontStyle: "italic", fontSize: "12px", lineHeight: 1.5, fontFamily: "'Playfair Display',serif" }}>{h.a}</div>
        </div>
      ))}
      <div style={{ display: "flex", gap: "6px" }}>
        <input type="text" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && ask()}
          placeholder={`Ask about ${city1.name} or ${city2.name}...`}
          style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", color: "#fff", fontSize: "13px", outline: "none", fontFamily: "'DM Sans'" }} />
        <button onClick={ask} disabled={loading} style={{ padding: "10px 18px", borderRadius: "8px", border: "none", background: `linear-gradient(135deg, ${city1.accent}, ${city2.accent})`, color: "#fff", fontWeight: 700, cursor: loading ? "wait" : "pointer", fontSize: "13px", fontFamily: "'DM Sans'", opacity: loading ? .5 : 1 }}>
          {loading ? "⏳" : "Ask"}
        </button>
      </div>
      {ans && !history.find(h => h.a === ans) && (
        <div style={{ marginTop: "8px", padding: "12px", borderRadius: "8px", background: `linear-gradient(135deg, ${city1.accent}08, ${city2.accent}08)`, borderLeft: "3px solid rgba(255,255,255,.1)", fontStyle: "italic", fontSize: "13px", lineHeight: 1.6, fontFamily: "'Playfair Display',serif" }}>{ans}</div>
      )}
      <div style={{ marginTop: "10px", display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
        {["Which is safer?", "Best food?", "Cost comparison?", "Better for remote work?", "Which never sleeps?"].map(s => (
          <button key={s} onClick={() => setQ(s)} style={{ padding: "4px 10px", borderRadius: "16px", border: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.02)", color: "#555", fontSize: "9px", cursor: "pointer", fontFamily: "'DM Sans'" }}>{s}</button>
        ))}
      </div>
    </div>
  );
}

function DuelView({ city1, city2 }) {
  const bars = [
    { l: "Population", d: parseFloat(city1.pop), t: parseFloat(city2.pop), u: "M" },
    { l: "Density", d: parseFloat(city1.density.replace(/[^0-9.]/g, "")), t: parseFloat(city2.density.replace(/[^0-9.]/g, "")), u: "/km²" },
  ];
  const hr1 = getHeartRate(city1), hr2 = getHeartRate(city2);
  bars.push({ l: "Energy (BPM)", d: hr1, t: hr2, u: "" });
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginBottom: "16px" }}>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: "28px" }}>{city1.flag}</div><div style={{ fontSize: "12px", fontWeight: 700, color: city1.accent }}>{city1.name}</div></div>
        <div style={{ fontSize: "10px", opacity: .15, letterSpacing: "3px" }}>VS</div>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: "28px" }}>{city2.flag}</div><div style={{ fontSize: "12px", fontWeight: 700, color: city2.accent }}>{city2.name}</div></div>
      </div>
      {bars.map((b, i) => {
        const max = Math.max(b.d, b.t) || 1;
        return (
          <div key={i} style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", marginBottom: "2px" }}>
              <span style={{ color: b.d >= b.t ? city1.accent : "#555", fontWeight: b.d >= b.t ? 700 : 400 }}>{b.d.toLocaleString()}{b.u}{b.d >= b.t ? " 👑" : ""}</span>
              <span style={{ opacity: .3, letterSpacing: "1px" }}>{b.l}</span>
              <span style={{ color: b.t > b.d ? city2.accent : "#555", fontWeight: b.t > b.d ? 700 : 400 }}>{b.t > b.d ? "👑 " : ""}{b.t.toLocaleString()}{b.u}</span>
            </div>
            <div style={{ display: "flex", gap: "2px", height: "5px" }}>
              <div style={{ flex: 1, borderRadius: "3px", background: "rgba(255,255,255,.04)", overflow: "hidden", direction: "rtl" }}>
                <div style={{ height: "100%", width: `${(b.d / max) * 100}%`, borderRadius: "3px", background: city1.accent }} />
              </div>
              <div style={{ flex: 1, borderRadius: "3px", background: "rgba(255,255,255,.04)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(b.t / max) * 100}%`, borderRadius: "3px", background: city2.accent }} />
              </div>
            </div>
          </div>
        );
      })}
      {/* Quick Facts */}
      <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)", marginTop: "12px" }}>
        <div style={{ fontSize: "8px", letterSpacing: "2px", opacity: .3, marginBottom: "8px" }}>📋 QUICK FACTS</div>
        {[
          ["🌍 Continent", city1.continent, city2.continent],
          ["💱 Currency", city1.currency, city2.currency],
          ["🗣️ Language", city1.lang, city2.lang],
          ["📐 Area", city1.area, city2.area],
          ["⏰ Timezone", city1.tz, city2.tz],
        ].map(([l, d, t], i) => (
          <div key={i} style={{ display: "flex", padding: "3px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,.03)" : "none", fontSize: "10px" }}>
            <div style={{ width: "90px", opacity: .3 }}>{l}</div>
            <div style={{ flex: 1, color: city1.accent }}>{d}</div>
            <div style={{ flex: 1, color: city2.accent }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════
export default function LivePulse() {
  const [city1Id, setCity1Id] = useState("dhaka");
  const [city2Id, setCity2Id] = useState("toronto");
  const [tab, setTab] = useState("pulse");
  const [search, setSearch] = useState("");
  const [selecting, setSelecting] = useState(null); // null | 1 | 2
  const [showPro, setShowPro] = useState(false);

  const city1 = CITY_DB.find(c => c.id === city1Id);
  const city2 = CITY_DB.find(c => c.id === city2Id);

  const filtered = useMemo(() => {
    if (!search) return CITY_DB;
    const s = search.toLowerCase();
    return CITY_DB.filter(c => c.name.toLowerCase().includes(s) || c.country.toLowerCase().includes(s) || c.continent.toLowerCase().includes(s));
  }, [search]);

  const selectCity = (id) => {
    if (selecting === 1) setCity1Id(id);
    else if (selecting === 2) setCity2Id(id);
    setSelecting(null);
    setSearch("");
  };

  const tabs = [
    { id: "pulse", label: "🧠 Pulse" },
    { id: "timeline", label: "📊 Timeline" },
    { id: "duel", label: "⚔️ Duel" },
    { id: "oracle", label: "🔮 Oracle" },
  ];

  const PRO_FEATURES = ["Multi-city (40+ cities)", "Full cost of living data", "Air quality tracking", "Livability radar", "Historical trends", "API access"];
  const FREE_FEATURES = ["2-city comparison", "Real-time clocks & heartbeats", "Emotional weather", "AI Oracle (5 queries/day)", "Time bridge"];

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#e0e0e0", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        @keyframes aurora{0%{transform:translate(0,0) scale(1)}100%{transform:translate(20px,-15px) scale(1.1)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#333;border-radius:3px}
        input::placeholder{color:rgba(255,255,255,.18)}
        .city-btn:hover{background:rgba(255,255,255,.06)!important;border-color:rgba(255,255,255,.15)!important}
      `}</style>

      {/* HEADER */}
      <div style={{ textAlign: "center", padding: "24px 16px 8px", animation: "slideUp .6s ease-out" }}>
        <h1 style={{ fontSize: "clamp(24px,5vw,38px)", fontWeight: 900, margin: "0 0 2px", fontFamily: "'Playfair Display',serif", background: "linear-gradient(135deg, #FF6B35, #F7C948, #4A90D9, #8EC5FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LIVEPULSE</h1>
        <div style={{ fontSize: "9px", letterSpacing: "3px", opacity: .2 }}>FEEL A CITY BEFORE YOU GO</div>
      </div>

      {/* CITY SELECTOR BAR */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "10px 16px", flexWrap: "wrap" }}>
        <button onClick={() => setSelecting(selecting === 1 ? null : 1)} style={{
          padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: "13px",
          border: `2px solid ${city1.accent}${selecting === 1 ? "" : "44"}`, background: selecting === 1 ? `${city1.accent}22` : "rgba(255,255,255,.03)", color: "#fff",
        }}>
          {city1.flag} {city1.name}
        </button>
        <span style={{ opacity: .15, fontSize: "12px", letterSpacing: "2px" }}>VS</span>
        <button onClick={() => setSelecting(selecting === 2 ? null : 2)} style={{
          padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: "13px",
          border: `2px solid ${city2.accent}${selecting === 2 ? "" : "44"}`, background: selecting === 2 ? `${city2.accent}22` : "rgba(255,255,255,.03)", color: "#fff",
        }}>
          {city2.flag} {city2.name}
        </button>
      </div>

      {/* CITY PICKER DROPDOWN */}
      {selecting && (
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "0 16px 12px", animation: "fadeIn .3s" }}>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} autoFocus
            placeholder="Search 40+ cities..." style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.04)", color: "#fff", fontSize: "13px", outline: "none", fontFamily: "'DM Sans'", marginBottom: "8px" }} />
          <div style={{ maxHeight: "250px", overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
            {filtered.map(c => (
              <CityCard key={c.id} city={c} onSelect={selectCity} selected={c.id === (selecting === 1 ? city1Id : city2Id)} />
            ))}
          </div>
        </div>
      )}

      {/* TABS */}
      <div style={{ display: "flex", justifyContent: "center", gap: "4px", padding: "4px 14px 10px" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "6px 16px", borderRadius: "20px", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Sans'", transition: "all .2s",
            border: tab === t.id ? "1px solid rgba(255,255,255,.1)" : "1px solid rgba(255,255,255,.04)",
            background: tab === t.id ? "rgba(255,255,255,.06)" : "transparent",
            color: tab === t.id ? "#fff" : "#555", fontWeight: tab === t.id ? 700 : 400,
          }}>{t.label}</button>
        ))}
        <button onClick={() => setShowPro(!showPro)} style={{
          padding: "6px 14px", borderRadius: "20px", fontSize: "10px", cursor: "pointer", fontFamily: "'DM Sans'",
          border: "1px solid #F7C94844", background: "rgba(247,201,72,.08)", color: "#F7C948", fontWeight: 700, letterSpacing: "1px",
        }}>⭐ PRO</button>
      </div>

      {/* PRO MODAL */}
      {showPro && (
        <div style={{ maxWidth: "500px", margin: "0 auto 16px", padding: "20px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(247,201,72,.06), rgba(255,107,53,.06))", border: "1px solid rgba(247,201,72,.2)", animation: "fadeIn .3s" }}>
          <div style={{ textAlign: "center", marginBottom: "12px" }}>
            <div style={{ fontSize: "24px" }}>⭐</div>
            <div style={{ fontSize: "18px", fontWeight: 900, fontFamily: "'Playfair Display',serif", color: "#F7C948" }}>LivePulse Pro</div>
            <div style={{ fontSize: "10px", opacity: .4 }}>Unlock the full city consciousness experience</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <div style={{ fontSize: "9px", letterSpacing: "2px", opacity: .4, marginBottom: "6px" }}>FREE</div>
              {FREE_FEATURES.map(f => <div key={f} style={{ fontSize: "10px", opacity: .5, padding: "2px 0" }}>✓ {f}</div>)}
            </div>
            <div>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#F7C948", marginBottom: "6px" }}>PRO — $5/MO</div>
              {PRO_FEATURES.map(f => <div key={f} style={{ fontSize: "10px", color: "#F7C948", padding: "2px 0" }}>⭐ {f}</div>)}
            </div>
          </div>
          <button style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #F7C948, #FF6B35)", color: "#000", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans'" }}>
            Coming Soon — Join Waitlist
          </button>
          <button onClick={() => setShowPro(false)} style={{ width: "100%", padding: "6px", border: "none", background: "none", color: "#666", fontSize: "10px", cursor: "pointer", marginTop: "6px", fontFamily: "'DM Sans'" }}>Close</button>
        </div>
      )}

      {/* CONTENT */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 10px 30px" }}>
        {tab === "pulse" && (
          <div style={{ animation: "slideUp .4s ease-out" }}>
            <TimeBridge city1={city1} city2={city2} />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 360px", minWidth: "300px" }}><CityPulse city={city1} /></div>
              <div style={{ flex: "1 1 360px", minWidth: "300px" }}><CityPulse city={city2} /></div>
            </div>
          </div>
        )}
        {tab === "timeline" && <div style={{ animation: "slideUp .4s ease-out" }}><TimelineView city1={city1} city2={city2} /></div>}
        {tab === "duel" && <div style={{ animation: "slideUp .4s ease-out" }}><DuelView city1={city1} city2={city2} /></div>}
        {tab === "oracle" && <div style={{ animation: "slideUp .4s ease-out" }}><OracleChat city1={city1} city2={city2} /></div>}
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "14px", borderTop: "1px solid rgba(255,255,255,.03)" }}>
        <div style={{ fontSize: "8px", letterSpacing: "2px", opacity: .08 }}>LIVEPULSE v3.0 · BUILT BY TAHSEEN · POWERED BY CLAUDE</div>
      </div>
    </div>
  );
}
