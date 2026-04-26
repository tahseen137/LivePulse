import { useState, useEffect, useMemo, useRef, useCallback } from "react";

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

const LS = {
  get: (k, fallback) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ══════════════════════════════════════════════════════════
// COST OF LIVING — monthly estimates in USD
// ══════════════════════════════════════════════════════════
const COST_OF_LIVING = {
  dhaka:         { rent: 300,  food: 150, transport: 30,  entertainment: 50  },
  toronto:       { rent: 2200, food: 600, transport: 150, entertainment: 300 },
  tokyo:         { rent: 1400, food: 500, transport: 120, entertainment: 250 },
  london:        { rent: 2500, food: 700, transport: 180, entertainment: 350 },
  nyc:           { rent: 3500, food: 800, transport: 130, entertainment: 400 },
  dubai:         { rent: 2000, food: 500, transport: 100, entertainment: 350 },
  singapore:     { rent: 2800, food: 600, transport: 100, entertainment: 300 },
  mumbai:        { rent: 600,  food: 200, transport: 50,  entertainment: 100 },
  istanbul:      { rent: 500,  food: 300, transport: 50,  entertainment: 150 },
  seoul:         { rent: 1200, food: 400, transport: 100, entertainment: 200 },
  bangkok:       { rent: 800,  food: 300, transport: 50,  entertainment: 150 },
  paris:         { rent: 2200, food: 700, transport: 90,  entertainment: 350 },
  berlin:        { rent: 1500, food: 500, transport: 100, entertainment: 250 },
  sydney:        { rent: 2000, food: 600, transport: 150, entertainment: 300 },
  lagos:         { rent: 700,  food: 300, transport: 80,  entertainment: 100 },
  cairo:         { rent: 400,  food: 200, transport: 40,  entertainment: 80  },
  mexico_city:   { rent: 700,  food: 300, transport: 50,  entertainment: 150 },
  sao_paulo:     { rent: 900,  food: 350, transport: 70,  entertainment: 200 },
  jakarta:       { rent: 600,  food: 250, transport: 50,  entertainment: 120 },
  kuala_lumpur:  { rent: 700,  food: 300, transport: 60,  entertainment: 150 },
  lisbon:        { rent: 1400, food: 500, transport: 80,  entertainment: 200 },
  nairobi:       { rent: 600,  food: 300, transport: 60,  entertainment: 120 },
  buenos_aires:  { rent: 700,  food: 300, transport: 50,  entertainment: 150 },
  beijing:       { rent: 1200, food: 400, transport: 70,  entertainment: 200 },
  moscow:        { rent: 800,  food: 400, transport: 60,  entertainment: 200 },
  los_angeles:   { rent: 2800, food: 700, transport: 200, entertainment: 400 },
  amsterdam:     { rent: 2000, food: 600, transport: 120, entertainment: 300 },
  barcelona:     { rent: 1600, food: 550, transport: 100, entertainment: 280 },
  cape_town:     { rent: 700,  food: 300, transport: 70,  entertainment: 150 },
  hanoi:         { rent: 600,  food: 200, transport: 40,  entertainment: 100 },
  lima:          { rent: 500,  food: 250, transport: 50,  entertainment: 120 },
  manila:        { rent: 500,  food: 200, transport: 40,  entertainment: 100 },
  taipei:        { rent: 900,  food: 350, transport: 80,  entertainment: 200 },
  vienna:        { rent: 1500, food: 500, transport: 100, entertainment: 250 },
  rome:          { rent: 1400, food: 550, transport: 100, entertainment: 250 },
  san_francisco: { rent: 3600, food: 800, transport: 150, entertainment: 450 },
  hong_kong:     { rent: 3000, food: 700, transport: 100, entertainment: 350 },
  bogota:        { rent: 500,  food: 250, transport: 50,  entertainment: 120 },
  warsaw:        { rent: 800,  food: 400, transport: 70,  entertainment: 180 },
  stockholm:     { rent: 1700, food: 600, transport: 120, entertainment: 280 },
};

// ══════════════════════════════════════════════════════════
// LIVABILITY SCORES — 8 dimensions [0-100]
// Order: Safety, Affordability, Internet, Weather, Culture, Food, Transport, Nightlife
// ══════════════════════════════════════════════════════════
const LIVABILITY = {
  dhaka:         [30, 90, 55, 45, 70, 80, 55, 40],
  toronto:       [78, 35, 85, 45, 85, 85, 70, 70],
  tokyo:         [92, 40, 95, 65, 95, 98, 95, 85],
  london:        [72, 25, 88, 45, 95, 88, 85, 85],
  nyc:           [60, 20, 82, 55, 98, 95, 75, 95],
  dubai:         [88, 40, 85, 35, 70, 85, 70, 60],
  singapore:     [95, 35, 95, 40, 80, 95, 97, 65],
  mumbai:        [45, 75, 65, 40, 85, 90, 60, 55],
  istanbul:      [55, 70, 72, 65, 90, 92, 65, 75],
  seoul:         [88, 55, 98, 60, 90, 95, 92, 90],
  bangkok:       [65, 75, 78, 35, 82, 92, 65, 88],
  paris:         [65, 30, 85, 55, 98, 97, 85, 85],
  berlin:        [72, 50, 80, 45, 92, 82, 88, 98],
  sydney:        [80, 30, 78, 80, 82, 85, 72, 70],
  lagos:         [30, 72, 45, 45, 75, 78, 35, 70],
  cairo:         [40, 80, 55, 50, 85, 82, 50, 45],
  mexico_city:   [40, 72, 70, 65, 88, 90, 65, 75],
  sao_paulo:     [35, 65, 72, 55, 82, 88, 60, 80],
  jakarta:       [45, 75, 68, 35, 75, 85, 55, 55],
  kuala_lumpur:  [72, 72, 80, 40, 75, 90, 68, 62],
  lisbon:        [82, 52, 78, 75, 88, 88, 70, 80],
  nairobi:       [38, 70, 65, 68, 72, 72, 40, 60],
  buenos_aires:  [45, 72, 72, 65, 88, 88, 68, 90],
  beijing:       [78, 60, 55, 45, 90, 90, 85, 65],
  moscow:        [55, 62, 80, 20, 90, 82, 82, 75],
  los_angeles:   [52, 22, 88, 85, 88, 90, 40, 80],
  amsterdam:     [78, 38, 90, 45, 88, 82, 88, 85],
  barcelona:     [62, 45, 85, 78, 92, 95, 80, 95],
  cape_town:     [38, 70, 68, 80, 78, 80, 50, 68],
  hanoi:         [70, 80, 72, 45, 80, 88, 55, 60],
  lima:          [42, 72, 65, 55, 75, 85, 55, 62],
  manila:        [40, 75, 65, 35, 72, 82, 45, 65],
  taipei:        [90, 60, 95, 55, 85, 95, 90, 72],
  vienna:        [88, 42, 88, 52, 95, 88, 90, 72],
  rome:          [65, 45, 78, 72, 98, 97, 65, 80],
  san_francisco: [48, 15, 92, 72, 88, 92, 65, 72],
  hong_kong:     [88, 28, 92, 45, 88, 95, 95, 80],
  bogota:        [38, 72, 70, 62, 78, 80, 58, 68],
  warsaw:        [78, 62, 88, 35, 82, 82, 80, 75],
  stockholm:     [85, 32, 92, 35, 88, 82, 85, 68],
};
const LIVABILITY_LABELS = ["Safety", "Affordability", "Internet", "Weather", "Culture", "Food", "Transport", "Nightlife"];

// ══════════════════════════════════════════════════════════
// HISTORICAL POPULATION TRENDS — millions, 2020–2024
// ══════════════════════════════════════════════════════════
const HISTORY = {
  dhaka:         [21.0, 21.5, 21.9, 22.2, 22.4],
  toronto:       [2.73, 2.76, 2.80, 2.85, 2.93],
  tokyo:         [13.96, 13.96, 13.95, 13.94, 13.92],
  london:        [8.80, 8.82, 8.85, 8.87, 8.90],
  nyc:           [8.34, 8.34, 8.34, 8.34, 8.34],
  dubai:         [3.30, 3.40, 3.50, 3.55, 3.60],
  singapore:     [5.69, 5.45, 5.64, 5.83, 5.92],
  mumbai:        [20.4, 20.5, 20.7, 20.9, 21.0],
  istanbul:      [15.0, 15.2, 15.4, 15.6, 15.8],
  seoul:         [9.73, 9.72, 9.72, 9.71, 9.70],
  bangkok:       [10.5, 10.6, 10.6, 10.7, 10.7],
  paris:         [2.16, 2.17, 2.17, 2.18, 2.20],
  berlin:        [3.64, 3.66, 3.68, 3.70, 3.71],
  sydney:        [5.13, 5.23, 5.25, 5.28, 5.31],
  lagos:         [15.3, 15.7, 16.0, 16.3, 16.6],
  cairo:         [9.85, 9.90, 9.95, 10.0, 10.1],
  mexico_city:   [8.96, 9.00, 9.05, 9.10, 9.20],
  sao_paulo:     [12.1, 12.2, 12.2, 12.2, 12.3],
  jakarta:       [10.5, 10.5, 10.6, 10.6, 10.6],
  kuala_lumpur:  [1.73, 1.75, 1.76, 1.78, 1.80],
  lisbon:        [0.505, 0.506, 0.507, 0.510, 0.513],
  nairobi:       [4.4, 4.5, 4.5, 4.6, 4.7],
  buenos_aires:  [3.05, 3.07, 3.08, 3.09, 3.10],
  beijing:       [21.5, 21.5, 21.6, 21.6, 21.7],
  moscow:        [12.5, 12.5, 12.6, 12.6, 12.6],
  los_angeles:   [3.87, 3.88, 3.89, 3.90, 3.90],
  amsterdam:     [0.87, 0.88, 0.88, 0.89, 0.90],
  barcelona:     [1.61, 1.62, 1.62, 1.63, 1.63],
  cape_town:     [4.6, 4.7, 4.7, 4.8, 4.8],
  hanoi:         [8.0, 8.1, 8.2, 8.3, 8.4],
  lima:          [9.75, 9.82, 9.88, 9.93, 10.0],
  manila:        [1.78, 1.79, 1.80, 1.80, 1.80],
  taipei:        [2.62, 2.63, 2.63, 2.64, 2.64],
  vienna:        [1.88, 1.89, 1.90, 1.90, 1.92],
  rome:          [2.80, 2.80, 2.80, 2.80, 2.82],
  san_francisco: [0.874, 0.880, 0.880, 0.888, 0.900],
  hong_kong:     [7.48, 7.41, 7.43, 7.47, 7.50],
  bogota:        [7.08, 7.15, 7.18, 7.20, 7.24],
  warsaw:        [1.77, 1.78, 1.79, 1.80, 1.80],
  stockholm:     [0.970, 0.972, 0.974, 0.977, 0.980],
};
const HISTORY_YEARS = [2020, 2021, 2022, 2023, 2024];

// ── Feature 7: Filter config ───────────────────────────────
const CONTINENT_FILTERS = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"];
const UTC_RANGES = [
  { label: "≤ UTC−5", range: [-12, -5] },
  { label: "UTC−4 to 0", range: [-4, 0] },
  { label: "UTC+1 to +4", range: [1, 4] },
  { label: "UTC+5 to +8", range: [5, 8] },
  { label: "UTC+9+", range: [9, 14] },
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

function getAqiColor(aqi) {
  if (!aqi) return "#888";
  if (aqi <= 50) return "#00E400";
  if (aqi <= 100) return "#FFFF00";
  if (aqi <= 150) return "#FF7E00";
  if (aqi <= 200) return "#FF0000";
  if (aqi <= 300) return "#8F3F97";
  return "#7E0023";
}

function getAqiLabel(aqi) {
  if (!aqi) return "No data";
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy (Sensitive)";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
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

function CityCard({ city, onSelect, selected, isFavorite, onToggleFavorite }) {
  const t = getCityTime(city.utc);
  const h = t.getHours();
  const phase = getDayPhase(h);
  return (
    <button onClick={() => onSelect(city.id)} style={{
      padding: "12px 14px", borderRadius: "10px", textAlign: "left", cursor: "pointer",
      border: selected ? `2px solid ${city.accent}` : "2px solid rgba(255,255,255,.06)",
      background: selected ? `${city.accent}15` : "rgba(255,255,255,.02)",
      color: "#e0e0e0", fontFamily: "'DM Sans',sans-serif", transition: "all .2s", width: "100%",
      position: "relative",
    }}>
      {onToggleFavorite && (
        <span onClick={e => { e.stopPropagation(); onToggleFavorite(city.id); }} style={{
          position: "absolute", top: "5px", right: "6px", fontSize: "12px",
          color: isFavorite ? "#F7C948" : "rgba(255,255,255,.2)", cursor: "pointer", userSelect: "none",
          lineHeight: 1,
        }}>
          {isFavorite ? "★" : "☆"}
        </span>
      )}
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

// ── Feature 7: Filter Chips ────────────────────────────────
function FilterChips({ continentFilter, setContinentFilter, utcFilter, setUtcFilter }) {
  const chipBase = { padding: "3px 10px", borderRadius: "16px", fontSize: "9px", cursor: "pointer", fontFamily: "'DM Sans'", border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)", color: "#666", transition: "all .15s" };
  const chipActive = { ...chipBase, background: "rgba(255,255,255,.1)", color: "#e0e0e0", border: "1px solid rgba(255,255,255,.2)" };
  return (
    <div style={{ marginBottom: "8px" }}>
      <div style={{ fontSize: "7px", letterSpacing: "2px", opacity: .25, marginBottom: "4px" }}>CONTINENT</div>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "8px" }}>
        {CONTINENT_FILTERS.map(c => <button key={c} onClick={() => setContinentFilter(continentFilter === c ? null : c)} style={continentFilter === c ? chipActive : chipBase}>{c}</button>)}
      </div>
      <div style={{ fontSize: "7px", letterSpacing: "2px", opacity: .25, marginBottom: "4px" }}>TIMEZONE</div>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {UTC_RANGES.map(u => { const active = utcFilter && utcFilter[0] === u.range[0]; return <button key={u.label} onClick={() => setUtcFilter(active ? null : u.range)} style={active ? chipActive : chipBase}>{u.label}</button>; })}
      </div>
    </div>
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

// ── Feature 8: TimeBridge supports optional 3rd city ──────
function TimeBridge({ city1, city2, city3 }) {
  const [, setT] = useState(0);
  useEffect(() => { const iv = setInterval(() => setT(t => t + 1), 1000); return () => clearInterval(iv); }, []);
  const cities = city3 ? [city1, city2, city3] : [city1, city2];
  const phases = cities.map(c => getDayPhase(getCityTime(c.utc).getHours()));
  return (
    <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", marginBottom: "10px" }}>
      <div style={{ fontSize: "8px", letterSpacing: "3px", opacity: .3, marginBottom: "8px", textAlign: "center" }}>⏳ TIME BRIDGE</div>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {cities.map((city, i) => (
          <>
            <div key={city.id} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "22px" }}>{phases[i].e}</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: city.accent }}>{city.name}</div>
              <div style={{ fontSize: "9px", opacity: .4 }}>{phases[i].p} — {phases[i].d}</div>
            </div>
            {i < cities.length - 1 && <div key={`gap-${i}`} style={{ textAlign: "center", opacity: .2 }}><div style={{ fontSize: "16px" }}>↔</div><div style={{ fontSize: "8px", letterSpacing: "1px" }}>{Math.abs(cities[i].utc - cities[i + 1].utc)}H</div></div>}
          </>
        ))}
      </div>
    </div>
  );
}

// ── Oracle — powered by local Ollama gemma4 ───────────────
function OracleChat({ city1, city2, city3 }) {
  const pairKey = `livepulse_oracle_${[city1.id, city2.id, city3?.id].filter(Boolean).sort().join("_")}`;
  const [q, setQ] = useState("");
  const [ans, setAns] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() => LS.get(pairKey, []));

  useEffect(() => {
    setHistory(LS.get(pairKey, []));
    setAns("");
  }, [pairKey]);

  const ask = async () => {
    if (!q.trim() || loading) return;
    setLoading(true); setAns("");
    const question = q; setQ("");

    const cityList = [city1, city2, city3].filter(Boolean);
    const cityContext = cityList.map(c =>
      `${c.name}, ${c.country}: Pop ${c.pop}, Density ${c.density}, Currency ${c.currency}, Language ${c.lang}, TZ ${c.tz}`
    ).join("\n");

    const systemPrompt = `You are "The Oracle" of LivePulse — an AI with deep awareness of cities worldwide. Today: ${new Date().toLocaleDateString()}. Answer queries about cities with poetic flair but grounded in specific data. Keep responses to 2-4 sentences.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.flatMap(h => [
        { role: "user", content: h.q },
        { role: "assistant", content: h.a },
      ]),
      { role: "user", content: `Cities:\n${cityContext}\n\nQuestion: ${question}` },
    ];

    try {
      const res = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemma4",
          messages,
          stream: false,
          options: { temperature: 0.7, num_predict: 400 },
        }),
      });
      if (!res.ok) throw new Error(`Ollama ${res.status}`);
      const data = await res.json();
      const text = data.message?.content || "The Oracle meditates in silence...";
      setAns(text);
      setHistory(h => {
        const next = [...h, { q: question, a: text }].slice(-20);
        LS.set(pairKey, next);
        return next;
      });
    } catch {
      setAns("The Oracle is offline. Start Ollama locally (run: ollama serve) then try again.");
    }
    setLoading(false);
  };

  const clearHistory = () => { setHistory([]); LS.set(pairKey, []); setAns(""); };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "40px", animation: "float 3s ease-in-out infinite" }}>🔮</div>
        <h2 style={{ fontSize: "18px", fontWeight: 900, fontFamily: "'Playfair Display',serif", margin: "4px 0 2px" }}>The Oracle</h2>
        <div style={{ fontSize: "9px", opacity: .25 }}>Local AI · {city3 ? `${city1.name}, ${city2.name} & ${city3.name}` : `${city1.name} & ${city2.name}`} · powered by Ollama gemma4</div>
      </div>
      {history.length > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "6px" }}>
          <button onClick={clearHistory} style={{ padding: "2px 8px", borderRadius: "10px", border: "1px solid rgba(255,255,255,.06)", background: "none", color: "#555", fontSize: "9px", cursor: "pointer", fontFamily: "'DM Sans'" }}>Clear history</button>
        </div>
      )}
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

// ── Feature 8: DuelView supports optional 3rd city ────────
function DuelView({ city1, city2, city3 }) {
  const cities = city3 ? [city1, city2, city3] : [city1, city2];
  const cityMetrics = cities.map(city => ({
    population: parseFloat(city.pop),
    density: parseFloat(city.density.replace(/[^0-9.]/g, "")),
    energy: getHeartRate(city),
  }));
  const metrics = [
    { label: "Population", key: "population", unit: "M" },
    { label: "Density (/km²)", key: "density", unit: "" },
    { label: "Energy (BPM)", key: "energy", unit: "" },
  ];
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
        {cities.map((city, i) => (
          <div key={city.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {i > 0 && <div style={{ fontSize: "10px", opacity: .15, letterSpacing: "3px" }}>VS</div>}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px" }}>{city.flag}</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: city.accent }}>{city.name}</div>
            </div>
          </div>
        ))}
      </div>
      {metrics.map((metric, mi) => {
        const values = cityMetrics.map(m => m[metric.key]);
        const max = Math.max(...values) || 1;
        const winnerIdx = values.indexOf(Math.max(...values));
        return (
          <div key={mi} style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "8px", letterSpacing: "2px", opacity: .3, marginBottom: "6px", textAlign: "center" }}>{metric.label.toUpperCase()}</div>
            {cities.map((city, ci) => (
              <div key={city.id} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                <div style={{ width: "70px", textAlign: "right", fontSize: "9px", color: ci === winnerIdx ? city.accent : "#555", fontWeight: ci === winnerIdx ? 700 : 400, flexShrink: 0 }}>
                  {ci === winnerIdx ? "👑 " : ""}{values[ci].toLocaleString()}{metric.unit}
                </div>
                <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "rgba(255,255,255,.04)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(values[ci] / max) * 100}%`, borderRadius: "3px", background: city.accent, transition: "width .5s" }} />
                </div>
                <div style={{ width: "72px", fontSize: "9px", color: city.accent, opacity: .7, flexShrink: 0 }}>{city.flag} {city.name}</div>
              </div>
            ))}
          </div>
        );
      })}
      <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)", marginTop: "12px", overflowX: "auto" }}>
        <div style={{ fontSize: "8px", letterSpacing: "2px", opacity: .3, marginBottom: "8px" }}>📋 QUICK FACTS</div>
        {[["🌍 Continent", "continent"], ["💱 Currency", "currency"], ["🗣️ Language", "lang"], ["📐 Area", "area"], ["⏰ Timezone", "tz"]].map(([label, key], i) => (
          <div key={i} style={{ display: "flex", padding: "3px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,.03)" : "none", fontSize: "10px" }}>
            <div style={{ width: "90px", opacity: .3, flexShrink: 0 }}>{label}</div>
            {cities.map(city => <div key={city.id} style={{ flex: 1, color: city.accent, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{city[key]}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SHARE CARD
// ══════════════════════════════════════════════════════════
function ShareCard({ city1, city2, url, onClose }) {
  const [copied, setCopied] = useState(false);
  const [, setTick] = useState(0);
  useEffect(() => { const iv = setInterval(() => setTick(t => t + 1), 1000); return () => clearInterval(iv); }, []);

  const t1 = getCityTime(city1.utc), t2 = getCityTime(city2.utc);
  const mood1 = getMood(t1.getHours(), city1.density);
  const mood2 = getMood(t2.getHours(), city2.density);
  const bpm1 = useMemo(() => getHeartRate(city1), [city1.id]);
  const bpm2 = useMemo(() => getHeartRate(city2), [city2.id]);
  const time1 = t1.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  const time2 = t2.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(url); } catch { /* fallback: select */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => navigator.share({
    title: `${city1.name} vs ${city2.name} — LivePulse`,
    text: `${city1.name} is ${mood1} · ${city2.name} is ${mood2}. Feel both cities now:`,
    url,
  });

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", animation: "fadeIn .2s" }}>
      <div onClick={e => e.stopPropagation()} style={{ maxWidth: "460px", width: "100%", borderRadius: "16px", background: "#0e0e0e", border: "1px solid rgba(255,255,255,.1)", overflow: "hidden", animation: "slideUp .25s ease-out" }}>

        {/* Preview */}
        <div style={{ padding: "22px 20px 18px", background: `linear-gradient(135deg, ${city1.accent}14 0%, #0e0e0e 45%, ${city2.accent}14 100%)`, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
          <div style={{ fontSize: "7px", letterSpacing: "4px", opacity: .25, textAlign: "center", marginBottom: "14px" }}>LIVEPULSE · CITY CONSCIOUSNESS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "10px", alignItems: "center" }}>
            {[{ city: city1, mood: mood1, bpm: bpm1, time: time1 }, null, { city: city2, mood: mood2, bpm: bpm2, time: time2 }].map((item, i) =>
              item === null
                ? <div key="vs" style={{ textAlign: "center", opacity: .15 }}><div style={{ fontSize: "10px", letterSpacing: "3px" }}>VS</div></div>
                : <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "30px" }}>{item.city.flag}</div>
                    <div style={{ fontSize: "15px", fontWeight: 900, fontFamily: "'Playfair Display',serif", color: item.city.accent, marginTop: "4px" }}>{item.city.name}</div>
                    <div style={{ fontSize: "8px", opacity: .35, marginBottom: "8px" }}>{item.city.country}</div>
                    <div style={{ padding: "7px 4px", borderRadius: "8px", background: `${item.city.accent}12`, border: `1px solid ${item.city.accent}20` }}>
                      <div style={{ fontSize: "12px", fontWeight: 800, color: item.city.accent, fontFamily: "'Playfair Display',serif" }}>{item.mood}</div>
                      <div style={{ fontSize: "8px", opacity: .45, marginTop: "3px" }}>{item.bpm} BPM</div>
                      <div style={{ fontSize: "8px", opacity: .45 }}>{item.time}</div>
                    </div>
                  </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: "14px 16px" }}>
          <div style={{ fontSize: "9px", opacity: .25, padding: "6px 10px", borderRadius: "6px", background: "rgba(255,255,255,.03)", fontFamily: "'JetBrains Mono',monospace", wordBreak: "break-all", marginBottom: "10px" }}>{url}</div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleCopy} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: `1px solid ${copied ? "rgba(100,220,100,.3)" : "rgba(255,255,255,.1)"}`, background: copied ? "rgba(100,220,100,.08)" : "rgba(255,255,255,.04)", color: copied ? "#7de87d" : "#ccc", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans'", fontWeight: 700, transition: "all .2s" }}>
              {copied ? "✓ Copied!" : "Copy Link"}
            </button>
            {typeof navigator !== "undefined" && navigator.share && (
              <button onClick={handleNativeShare} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: `linear-gradient(135deg, ${city1.accent}, ${city2.accent})`, color: "#fff", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans'", fontWeight: 700 }}>
                Share ↗
              </button>
            )}
          </div>
          <button onClick={onClose} style={{ width: "100%", padding: "6px", border: "none", background: "none", color: "#555", fontSize: "10px", cursor: "pointer", marginTop: "6px", fontFamily: "'DM Sans'" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// PRO COMPONENTS
// ══════════════════════════════════════════════════════════

function MultiCityGrid({ multiCities }) {
  const cities = multiCities.map(id => CITY_DB.find(c => c.id === id)).filter(Boolean);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "10px" }}>
        {cities.map(city => <CityPulse key={city.id} city={city} />)}
      </div>
      {cities.length === 0 && <div style={{ textAlign: "center", padding: "40px", opacity: .3 }}>Use the city bar above to add cities</div>}
    </div>
  );
}

function CostOfLivingPanel({ multiCities }) {
  const cities = multiCities.map(id => CITY_DB.find(c => c.id === id)).filter(Boolean);
  const cats = [
    { key: "rent", label: "🏠 Rent", color: "#4A90D9" },
    { key: "food", label: "🍜 Food", color: "#FF9933" },
    { key: "transport", label: "🚇 Transport", color: "#00843D" },
    { key: "entertainment", label: "🎭 Entertainment", color: "#A50044" },
  ];
  if (cities.length === 0) return <div style={{ textAlign: "center", padding: "40px", opacity: .3 }}>Select cities in the Multi tab to compare costs</div>;
  const maxVals = cats.reduce((acc, cat) => {
    acc[cat.key] = Math.max(...cities.map(c => COST_OF_LIVING[c.id]?.[cat.key] || 0)) || 1;
    return acc;
  }, {});
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "3px", opacity: .3 }}>MONTHLY COST OF LIVING · USD ESTIMATES</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `140px repeat(${cities.length}, 1fr)`, gap: "6px", marginBottom: "8px" }}>
        <div />
        {cities.map(c => <div key={c.id} style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, color: c.accent }}>{c.flag} {c.name}</div>)}
      </div>
      {cats.map(cat => (
        <div key={cat.key} style={{ marginBottom: "12px" }}>
          <div style={{ fontSize: "9px", opacity: .4, marginBottom: "4px" }}>{cat.label}</div>
          <div style={{ display: "grid", gridTemplateColumns: `140px repeat(${cities.length}, 1fr)`, gap: "6px", alignItems: "center" }}>
            <div />
            {cities.map(c => {
              const val = COST_OF_LIVING[c.id]?.[cat.key] || 0;
              return (
                <div key={c.id}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: c.accent, marginBottom: "2px" }}>${val}/mo</div>
                  <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,.05)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(val / maxVals[cat.key]) * 100}%`, borderRadius: "2px", background: cat.color, opacity: .8 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ marginTop: "16px", padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
        <div style={{ fontSize: "8px", letterSpacing: "2px", opacity: .3, marginBottom: "8px" }}>💰 MONTHLY TOTAL</div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cities.length}, 1fr)`, gap: "8px" }}>
          {cities.map(c => {
            const col = COST_OF_LIVING[c.id] || {};
            const total = (col.rent || 0) + (col.food || 0) + (col.transport || 0) + (col.entertainment || 0);
            return (
              <div key={c.id} style={{ textAlign: "center", padding: "10px", borderRadius: "8px", background: `${c.accent}08`, border: `1px solid ${c.accent}22` }}>
                <div style={{ fontSize: "10px", opacity: .5 }}>{c.flag} {c.name}</div>
                <div style={{ fontSize: "20px", fontWeight: 900, color: c.accent, fontFamily: "'JetBrains Mono',monospace" }}>${total.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AirQualityPanel({ multiCities }) {
  const [airData, setAirData] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const cities = multiCities.map(id => CITY_DB.find(c => c.id === id)).filter(Boolean);
  const cityKey = multiCities.join(",");

  const fetchAirData = useCallback(async () => {
    if (cities.length === 0) return;
    setLoading(true);
    const results = await Promise.all(
      cities.map(async city => {
        try {
          const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lng}&current=pm2_5,pm10,us_aqi&timezone=auto`;
          const res = await fetch(url);
          const data = await res.json();
          return { id: city.id, pm25: data.current?.pm2_5, pm10: data.current?.pm10, aqi: data.current?.us_aqi };
        } catch {
          return { id: city.id, pm25: null, pm10: null, aqi: null };
        }
      })
    );
    const map = {};
    results.forEach(r => { map[r.id] = r; });
    setAirData(map);
    setLastFetch(new Date());
    setLoading(false);
  }, [cityKey]);

  useEffect(() => { fetchAirData(); }, [fetchAirData]);

  if (cities.length === 0) return <div style={{ textAlign: "center", padding: "40px", opacity: .3 }}>Select cities in the Multi tab to view air quality</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "3px", opacity: .3 }}>REAL-TIME AIR QUALITY · OPEN-METEO</div>
        <button onClick={fetchAirData} disabled={loading} style={{ padding: "4px 12px", borderRadius: "16px", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.03)", color: "#888", fontSize: "9px", cursor: "pointer", fontFamily: "'DM Sans'" }}>
          {loading ? "⏳ Loading..." : "↻ Refresh"}
        </button>
      </div>
      {lastFetch && <div style={{ fontSize: "8px", opacity: .2, textAlign: "right", marginBottom: "10px" }}>Updated: {lastFetch.toLocaleTimeString()}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
        {cities.map(city => {
          const d = airData[city.id];
          const aqi = d?.aqi;
          const aqiColor = getAqiColor(aqi);
          return (
            <div key={city.id} style={{ padding: "16px", borderRadius: "12px", background: `${city.accent}08`, border: `1px solid ${city.accent}22`, textAlign: "center" }}>
              <div style={{ fontSize: "20px", marginBottom: "4px" }}>{city.flag}</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: city.accent, marginBottom: "8px" }}>{city.name}</div>
              {loading && !d ? (
                <div style={{ opacity: .3, fontSize: "10px" }}>Fetching...</div>
              ) : (
                <>
                  <div style={{ fontSize: "32px", fontWeight: 900, fontFamily: "'JetBrains Mono',monospace", color: aqiColor, marginBottom: "2px" }}>{aqi ?? "—"}</div>
                  <div style={{ fontSize: "8px", color: aqiColor, fontWeight: 700, marginBottom: "8px" }}>{getAqiLabel(aqi)}</div>
                  <div style={{ display: "flex", justifyContent: "space-around", fontSize: "9px", opacity: .6 }}>
                    <span>PM2.5: <b>{d?.pm25?.toFixed(1) ?? "—"}</b></span>
                    <span>PM10: <b>{d?.pm10?.toFixed(1) ?? "—"}</b></span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
        {[["0–50","Good","#00E400"],["51–100","Moderate","#FFFF00"],["101–150","Unhealthy (Sensitive)","#FF7E00"],["151–200","Unhealthy","#FF0000"],["201+","Very Unhealthy+","#8F3F97"]].map(([range, label, color]) => (
          <div key={range} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "8px", opacity: .6 }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: color }} />
            <span>{range} {label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarChart({ scores, color, size = 200 }) {
  const n = LIVABILITY_LABELS.length;
  const cx = size / 2, cy = size / 2, r = size * 0.36;
  const angles = Array.from({ length: n }, (_, i) => (i * 2 * Math.PI / n) - Math.PI / 2);
  const gridPts = level => angles.map(a => { const d = (level / 100) * r; return `${(cx + d * Math.cos(a)).toFixed(1)},${(cy + d * Math.sin(a)).toFixed(1)}`; }).join(" ");
  const dataPts = scores.map((val, i) => { const a = angles[i]; const d = (val / 100) * r; return [cx + d * Math.cos(a), cy + d * Math.sin(a)]; });
  return (
    <svg width={size} height={size} style={{ overflow: "visible" }}>
      {[25, 50, 75, 100].map(level => <polygon key={level} points={gridPts(level)} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="1" />)}
      {angles.map((a, i) => <line key={i} x1={cx} y1={cy} x2={(cx + r * Math.cos(a)).toFixed(1)} y2={(cy + r * Math.sin(a)).toFixed(1)} stroke="rgba(255,255,255,.07)" strokeWidth="1" />)}
      <polygon points={dataPts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")} fill={`${color}28`} stroke={color} strokeWidth="1.5" />
      {dataPts.map((p, i) => <circle key={i} cx={p[0].toFixed(1)} cy={p[1].toFixed(1)} r="3" fill={color} />)}
      {LIVABILITY_LABELS.map((label, i) => {
        const a = angles[i]; const d = r + 20;
        return <text key={i} x={(cx + d * Math.cos(a)).toFixed(1)} y={(cy + d * Math.sin(a)).toFixed(1)} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,.45)" fontSize="8" fontFamily="'DM Sans',sans-serif">{label}</text>;
      })}
    </svg>
  );
}

function LiveabilityRadar({ multiCities }) {
  const cities = multiCities.slice(0, 4).map(id => CITY_DB.find(c => c.id === id)).filter(Boolean);
  if (cities.length === 0) return <div style={{ textAlign: "center", padding: "40px", opacity: .3 }}>Select cities in the Multi tab to view livability scores</div>;
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "3px", opacity: .3 }}>LIVABILITY RADAR · 8 DIMENSIONS (0–100) · FIRST 4 CITIES</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px", justifyItems: "center" }}>
        {cities.map(city => {
          const scores = LIVABILITY[city.id] || Array(8).fill(50);
          const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
          return (
            <div key={city.id} style={{ textAlign: "center", padding: "16px", borderRadius: "12px", background: `${city.accent}06`, border: `1px solid ${city.accent}20` }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: city.accent, marginBottom: "4px" }}>{city.flag} {city.name}</div>
              <div style={{ fontSize: "9px", opacity: .4, marginBottom: "10px" }}>Avg: <span style={{ color: city.accent, fontWeight: 700 }}>{avg}/100</span></div>
              <RadarChart scores={scores} color={city.accent} size={200} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", marginTop: "8px" }}>
                {LIVABILITY_LABELS.map((label, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", padding: "1px 4px" }}>
                    <span style={{ opacity: .4 }}>{label}</span>
                    <span style={{ color: city.accent, fontWeight: 700 }}>{scores[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HistoricalTrends({ multiCities }) {
  const cities = multiCities.map(id => CITY_DB.find(c => c.id === id)).filter(Boolean);
  const w = 560, h = 200;
  const pad = { t: 20, r: 20, b: 30, l: 50 };
  const chartW = w - pad.l - pad.r, chartH = h - pad.t - pad.b;
  const allVals = cities.flatMap(c => HISTORY[c.id] || []);
  const minY = allVals.length ? Math.min(...allVals) * 0.97 : 0;
  const maxY = allVals.length ? Math.max(...allVals) * 1.03 : 10;
  const xScale = i => pad.l + (i / (HISTORY_YEARS.length - 1)) * chartW;
  const yScale = v => pad.t + chartH - ((v - minY) / (maxY - minY || 1)) * chartH;
  if (cities.length === 0) return <div style={{ textAlign: "center", padding: "40px", opacity: .3 }}>Select cities in the Multi tab to view population trends</div>;
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "3px", opacity: .3 }}>POPULATION TRENDS · 2020–2024 (MILLIONS)</div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <svg width={w} height={h} style={{ display: "block", margin: "0 auto" }}>
          {[0, 0.25, 0.5, 0.75, 1].map(t => {
            const y = pad.t + chartH * (1 - t); const val = minY + t * (maxY - minY);
            return <g key={t}><line x1={pad.l} y1={y} x2={pad.l + chartW} y2={y} stroke="rgba(255,255,255,.05)" /><text x={pad.l - 4} y={y} textAnchor="end" dominantBaseline="middle" fill="rgba(255,255,255,.25)" fontSize="8" fontFamily="'JetBrains Mono',monospace">{val.toFixed(1)}</text></g>;
          })}
          {HISTORY_YEARS.map((year, i) => <text key={year} x={xScale(i)} y={pad.t + chartH + 16} textAnchor="middle" fill="rgba(255,255,255,.3)" fontSize="8" fontFamily="'DM Sans'">{year}</text>)}
          {cities.map(city => {
            const data = HISTORY[city.id]; if (!data) return null;
            const pts = data.map((v, i) => [xScale(i), yScale(v)]);
            const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
            return (
              <g key={city.id}>
                <path d={`${pathD} L ${xScale(data.length - 1).toFixed(1)} ${(pad.t + chartH).toFixed(1)} L ${xScale(0).toFixed(1)} ${(pad.t + chartH).toFixed(1)} Z`} fill={`${city.accent}12`} />
                <path d={pathD} fill="none" stroke={city.accent} strokeWidth="2" />
                {pts.map((p, i) => <circle key={i} cx={p[0].toFixed(1)} cy={p[1].toFixed(1)} r="3" fill={city.accent} />)}
                <text x={xScale(data.length - 1) + 4} y={yScale(data[data.length - 1])} dominantBaseline="middle" fill={city.accent} fontSize="8" fontFamily="'DM Sans'" fontWeight="700">{city.name}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginTop: "12px" }}>
        {cities.map(city => {
          const data = HISTORY[city.id] || [];
          const growth = data.length >= 2 ? (((data[data.length - 1] - data[0]) / data[0]) * 100).toFixed(1) : "0";
          return (
            <div key={city.id} style={{ padding: "8px 12px", borderRadius: "8px", background: `${city.accent}08`, border: `1px solid ${city.accent}22`, fontSize: "9px", textAlign: "center" }}>
              <div style={{ color: city.accent, fontWeight: 700 }}>{city.flag} {city.name}</div>
              <div style={{ opacity: .5 }}>4yr growth: <span style={{ color: parseFloat(growth) >= 0 ? "#00E400" : "#FF4444", fontWeight: 700 }}>{growth > 0 ? "+" : ""}{growth}%</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── ProCitySelector — shared city bar for all Pro tabs ───
function ProCitySelector({ multiCities, onToggleCity, onAddCity }) {
  const cities = multiCities.map(id => CITY_DB.find(c => c.id === id)).filter(Boolean);
  return (
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center", padding: "10px 12px", borderRadius: "10px", background: "rgba(247,201,72,.04)", border: "1px solid rgba(247,201,72,.12)", marginBottom: "14px" }}>
      <span style={{ fontSize: "8px", letterSpacing: "2px", opacity: .3, whiteSpace: "nowrap" }}>CITIES:</span>
      {cities.map(city => (
        <button key={city.id} onClick={() => onToggleCity(city.id)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "20px", background: `${city.accent}18`, border: `1px solid ${city.accent}44`, cursor: "pointer", fontFamily: "'DM Sans'" }}>
          <span style={{ fontSize: "13px" }}>{city.flag}</span>
          <span style={{ fontSize: "11px", color: city.accent, fontWeight: 600 }}>{city.name}</span>
          <span style={{ fontSize: "9px", color: city.accent, opacity: .6, marginLeft: "2px" }}>✕</span>
        </button>
      ))}
      {cities.length < 6 && (
        <button onClick={onAddCity} style={{ padding: "4px 10px", borderRadius: "20px", border: "1px dashed rgba(247,201,72,.3)", background: "none", color: "#F7C948", fontSize: "10px", cursor: "pointer", fontFamily: "'DM Sans'" }}>+ City</button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════
export default function LivePulse() {
  const [city1Id, setCity1Id] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    const c1 = p.get("c1");
    return CITY_DB.some(c => c.id === c1) ? c1 : "dhaka";
  });
  const [city2Id, setCity2Id] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    const c2 = p.get("c2");
    return CITY_DB.some(c => c.id === c2) ? c2 : "toronto";
  });
  const [tab, setTab] = useState("pulse");
  const [search, setSearch] = useState("");
  const [city3Id, setCity3Id] = useState(null);
  const [selecting, setSelecting] = useState(null); // null | 1 | 2 | 3
  const [continentFilter, setContinentFilter] = useState(null);
  const [utcFilter, setUtcFilter] = useState(null);
  const [showPro, setShowPro] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [favorites, setFavorites] = useState(() => LS.get("livepulse_favorites", []));
  const [recents, setRecents] = useState(() => LS.get("livepulse_recents", []));
  const [isPro, setIsPro] = useState(() => localStorage.getItem("lp_pro") === "true");
  const [multiCities, setMultiCities] = useState(["dhaka", "toronto", "tokyo", "london", "nyc", "dubai"]);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupError, setSignupError] = useState("");

  const city1 = CITY_DB.find(c => c.id === city1Id);
  const city2 = CITY_DB.find(c => c.id === city2Id);
  const city3 = city3Id ? CITY_DB.find(c => c.id === city3Id) : null;

  // Sync URL and meta tags whenever cities change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("c1", city1Id);
    params.set("c2", city2Id);
    window.history.replaceState(null, "", `?${params.toString()}`);

    const title = `${city1.name} vs ${city2.name} — LivePulse`;
    document.title = title;
    const setMeta = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[name="twitter:title"]', "content", title);
    const desc = `${city1.name} is ${getMood(getCityTime(city1.utc).getHours(), city1.density)} · ${city2.name} is ${getMood(getCityTime(city2.utc).getHours(), city2.density)}. Feel both cities on LivePulse.`;
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[name="twitter:description"]', "content", desc);
    const shareUrl = `${window.location.origin}${window.location.pathname}?c1=${city1Id}&c2=${city2Id}`;
    setMeta('meta[property="og:url"]', "content", shareUrl);
  }, [city1Id, city2Id]);

  const shareUrl = `${window.location.origin}${window.location.pathname}?c1=${city1Id}&c2=${city2Id}`;

  const filtered = useMemo(() => {
    let results = CITY_DB;
    if (search) {
      const s = search.toLowerCase();
      results = results.filter(c => c.name.toLowerCase().includes(s) || c.country.toLowerCase().includes(s) || c.continent.toLowerCase().includes(s));
    }
    if (continentFilter) results = results.filter(c => c.continent.includes(continentFilter));
    if (utcFilter) { const [min, max] = utcFilter; results = results.filter(c => c.utc >= min && c.utc <= max); }
    return results;
  }, [search, continentFilter, utcFilter]);

  const sortedFiltered = useMemo(() => {
    if (!favorites.length) return filtered;
    const favSet = new Set(favorites);
    return [...filtered.filter(c => favSet.has(c.id)), ...filtered.filter(c => !favSet.has(c.id))];
  }, [filtered, favorites]);

  const openPicker = (slot) => { setSelecting(selecting === slot ? null : slot); setSearch(""); setContinentFilter(null); setUtcFilter(null); };
  const removeCity3 = () => { setCity3Id(null); if (selecting === 3) setSelecting(null); };
  const currentSelectedId = selecting === 1 ? city1Id : selecting === 2 ? city2Id : selecting === 3 ? city3Id : null;

  const selectCity = (id) => {
    if (selecting === "multi_add") {
      toggleMultiCity(id);
      setSelecting(null);
      setSearch("");
      return;
    }
    const n1 = selecting === 1 ? id : city1Id;
    const n2 = selecting === 2 ? id : city2Id;
    if (selecting === 1) setCity1Id(id);
    else if (selecting === 2) setCity2Id(id);
    else if (selecting === 3) setCity3Id(id);
    if (selecting !== 3) {
      setRecents(prev => {
        const pair = { c1: n1, c2: n2 };
        const next = [pair, ...prev.filter(p => !(p.c1 === n1 && p.c2 === n2))].slice(0, 5);
        LS.set("livepulse_recents", next);
        return next;
      });
    }
    setSelecting(null);
    setSearch("");
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      LS.set("livepulse_favorites", next);
      return next;
    });
  };

  const toggleMultiCity = (id) => {
    setMultiCities(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id);
      if (prev.length >= 6) return prev;
      return [...prev, id];
    });
  };

  const handleSignup = () => {
    const name = signupName.trim();
    const email = signupEmail.trim();
    if (!name) { setSignupError("Please enter your name."); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSignupError("Please enter a valid email address."); return;
    }
    LS.set("lp_pro_user", { name, email });
    localStorage.setItem("lp_pro", "true");
    setIsPro(true);
    setSignupError("");
    setShowPro(false);
  };

  const tabs = [
    { id: "pulse", label: "🧠 Pulse", pro: false },
    { id: "timeline", label: "📊 Timeline", pro: false },
    { id: "duel", label: "⚔️ Duel", pro: false },
    { id: "oracle", label: "🔮 Oracle", pro: false },
    { id: "multi", label: "🏙️ Multi", pro: true },
    { id: "costs", label: "💰 Costs", pro: true },
    { id: "air", label: "🌬️ Air", pro: true },
    { id: "radar", label: "📡 Radar", pro: true },
    { id: "history", label: "📈 History", pro: true },
  ];

  const PRO_FEATURES = ["Multi-city grid (up to 6 cities)", "Cost of living data (rent, food, transport)", "Real-time air quality (PM2.5, AQI)", "Livability radar (8 dimensions)", "Population trend charts (2020–2024)", "Unlimited Oracle queries"];
  const FREE_FEATURES = ["2-city comparison", "Real-time clocks & heartbeats", "Emotional weather", "AI Oracle (unlimited)", "Time bridge"];

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
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
          <h1 style={{ fontSize: "clamp(24px,5vw,38px)", fontWeight: 900, margin: "0", fontFamily: "'Playfair Display',serif", background: "linear-gradient(135deg, #FF6B35, #F7C948, #4A90D9, #8EC5FC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LIVEPULSE</h1>
          {isPro && <span style={{ padding: "3px 9px", borderRadius: "20px", background: "linear-gradient(135deg, #F7C948, #FF6B35)", color: "#000", fontSize: "9px", fontWeight: 900, letterSpacing: "2px" }}>PRO</span>}
        </div>
        <div style={{ fontSize: "9px", letterSpacing: "3px", opacity: .2, marginTop: "2px" }}>FEEL A CITY BEFORE YOU GO</div>
      </div>

      {/* CITY SELECTOR BAR */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "10px 16px", flexWrap: "wrap" }}>
        <button onClick={() => openPicker(1)} style={{
          padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: "13px",
          border: `2px solid ${city1.accent}${selecting === 1 ? "" : "44"}`, background: selecting === 1 ? `${city1.accent}22` : "rgba(255,255,255,.03)", color: "#fff",
        }}>
          {city1.flag} {city1.name}
        </button>
        <span style={{ opacity: .15, fontSize: "12px", letterSpacing: "2px" }}>VS</span>
        <button onClick={() => openPicker(2)} style={{
          padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: "13px",
          border: `2px solid ${city2.accent}${selecting === 2 ? "" : "44"}`, background: selecting === 2 ? `${city2.accent}22` : "rgba(255,255,255,.03)", color: "#fff",
        }}>
          {city2.flag} {city2.name}
        </button>
        {city3 ? (
          <>
            <span style={{ opacity: .15, fontSize: "11px", letterSpacing: "2px" }}>VS</span>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <button onClick={() => openPicker(3)} style={{
                padding: "8px 16px", borderRadius: "8px 0 0 8px", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: "13px",
                border: `2px solid ${city3.accent}${selecting === 3 ? "" : "44"}`, borderRight: "none", background: selecting === 3 ? `${city3.accent}22` : "rgba(255,255,255,.03)", color: "#fff",
              }}>
                {city3.flag} {city3.name}
              </button>
              <button onClick={removeCity3} style={{
                padding: "8px 8px", borderRadius: "0 8px 8px 0", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: "12px",
                border: `2px solid ${city3.accent}44`, borderLeft: "none", background: "rgba(255,255,255,.03)", color: "#888",
              }}>✕</button>
            </div>
          </>
        ) : (
          <button onClick={() => { setCity3Id("london"); openPicker(3); }} style={{
            padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: "12px",
            border: "2px dashed rgba(255,255,255,.12)", background: "rgba(255,255,255,.02)", color: "#555",
          }}>+ City</button>
        )}
        <button onClick={() => setShowShare(true)} title="Share this comparison" style={{
          padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: "13px",
          border: "2px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.04)", color: "#aaa",
        }}>🔗</button>
      </div>

      {/* CITY PICKER DROPDOWN */}
      {selecting && (
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "0 16px 12px", animation: "fadeIn .3s" }}>
          {selecting !== 3 && recents.length > 0 && (
            <div style={{ marginBottom: "8px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "2px", opacity: .3, marginBottom: "4px" }}>RECENT</div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {recents.map((r, i) => {
                  const rc1 = CITY_DB.find(c => c.id === r.c1);
                  const rc2 = CITY_DB.find(c => c.id === r.c2);
                  if (!rc1 || !rc2) return null;
                  return (
                    <button key={i} onClick={() => { setCity1Id(r.c1); setCity2Id(r.c2); setSelecting(null); setSearch(""); }} style={{
                      padding: "3px 8px", borderRadius: "12px", border: "1px solid rgba(255,255,255,.08)",
                      background: "rgba(255,255,255,.03)", color: "#aaa", fontSize: "9px", cursor: "pointer", fontFamily: "'DM Sans'",
                    }}>
                      {rc1.flag} {rc1.name} vs {rc2.flag} {rc2.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <FilterChips continentFilter={continentFilter} setContinentFilter={setContinentFilter} utcFilter={utcFilter} setUtcFilter={setUtcFilter} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} autoFocus
            placeholder="Search 40+ cities..." style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.04)", color: "#fff", fontSize: "13px", outline: "none", fontFamily: "'DM Sans'", marginBottom: "8px" }} />
          <div style={{ maxHeight: "250px", overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
            {sortedFiltered.length === 0
              ? <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "20px", fontSize: "11px", opacity: .3 }}>No cities match these filters</div>
              : sortedFiltered.map(c => (
                <CityCard key={c.id} city={c} onSelect={selectCity} selected={c.id === currentSelectedId}
                  isFavorite={favorites.includes(c.id)} onToggleFavorite={toggleFavorite} />
              ))
            }
          </div>
        </div>
      )}

      {/* TABS */}
      <div style={{ display: "flex", justifyContent: "center", gap: "4px", padding: "4px 14px 10px", flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { if (t.pro && !isPro) { setShowPro(true); return; } setTab(t.id); }} style={{
            padding: "6px 12px", borderRadius: "20px", fontSize: "10px", cursor: "pointer", fontFamily: "'DM Sans'", transition: "all .2s",
            border: tab === t.id ? `1px solid ${t.pro ? "#F7C94855" : "rgba(255,255,255,.1)"}` : `1px solid ${t.pro ? "#F7C94822" : "rgba(255,255,255,.04)"}`,
            background: tab === t.id ? (t.pro ? "rgba(247,201,72,.1)" : "rgba(255,255,255,.06)") : "transparent",
            color: tab === t.id ? (t.pro ? "#F7C948" : "#fff") : (t.pro ? "#F7C94866" : "#555"),
            fontWeight: tab === t.id ? 700 : 400,
          }}>{t.label}{t.pro ? " ⭐" : ""}</button>
        ))}
        <button onClick={() => setShowPro(!showPro)} style={{
          padding: "6px 14px", borderRadius: "20px", fontSize: "10px", cursor: "pointer", fontFamily: "'DM Sans'",
          border: "1px solid #F7C94844", background: "rgba(247,201,72,.08)", color: "#F7C948", fontWeight: 700, letterSpacing: "1px",
        }}>⭐ PRO</button>
      </div>

      {/* PRO SIGN-UP MODAL */}
      {showPro && (
        <div style={{ maxWidth: "460px", margin: "0 auto 16px", padding: "20px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(247,201,72,.06), rgba(255,107,53,.06))", border: "1px solid rgba(247,201,72,.2)", animation: "fadeIn .3s" }}>
          <div style={{ textAlign: "center", marginBottom: "14px" }}>
            <div style={{ fontSize: "28px" }}>⭐</div>
            <div style={{ fontSize: "18px", fontWeight: 900, fontFamily: "'Playfair Display',serif", color: "#F7C948" }}>LivePulse Pro</div>
            <div style={{ fontSize: "10px", opacity: .4, marginTop: "2px" }}>Free — unlock the full city consciousness experience</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
            <div>
              <div style={{ fontSize: "9px", letterSpacing: "2px", opacity: .4, marginBottom: "6px" }}>FREE</div>
              {FREE_FEATURES.map(f => <div key={f} style={{ fontSize: "10px", opacity: .5, padding: "2px 0" }}>✓ {f}</div>)}
            </div>
            <div>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#F7C948", marginBottom: "6px" }}>PRO — FREE</div>
              {PRO_FEATURES.map(f => <div key={f} style={{ fontSize: "10px", color: "#F7C948", padding: "2px 0" }}>⭐ {f}</div>)}
            </div>
          </div>
          {isPro ? (
            <div style={{ textAlign: "center", padding: "12px", borderRadius: "8px", background: "rgba(127,255,154,.08)", border: "1px solid rgba(127,255,154,.2)", fontSize: "12px", color: "#7FFF9A", fontWeight: 700 }}>
              ✓ You're on Pro — all features unlocked
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <input type="text" value={signupName} onChange={e => { setSignupName(e.target.value); setSignupError(""); }}
                placeholder="Your name"
                style={{ padding: "10px 12px", borderRadius: "8px", border: `1px solid ${signupError && !signupName.trim() ? "#FF4444" : "rgba(255,255,255,.12)"}`, background: "rgba(255,255,255,.04)", color: "#fff", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'" }} />
              <input type="email" value={signupEmail} onChange={e => { setSignupEmail(e.target.value); setSignupError(""); }} onKeyDown={e => e.key === "Enter" && handleSignup()}
                placeholder="your@email.com"
                style={{ padding: "10px 12px", borderRadius: "8px", border: `1px solid ${signupError && !signupEmail.trim() ? "#FF4444" : "rgba(255,255,255,.12)"}`, background: "rgba(255,255,255,.04)", color: "#fff", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'" }} />
              {signupError && <div style={{ fontSize: "9px", color: "#FF4444" }}>{signupError}</div>}
              <button onClick={handleSignup} style={{ padding: "11px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #F7C948, #FF6B35)", color: "#000", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans'" }}>
                Get Pro — Free
              </button>
            </div>
          )}
          <button onClick={() => setShowPro(false)} style={{ width: "100%", padding: "6px", border: "none", background: "none", color: "#555", fontSize: "10px", cursor: "pointer", marginTop: "8px", fontFamily: "'DM Sans'" }}>Close</button>
        </div>
      )}

      {/* SHARE CARD */}
      {showShare && <ShareCard city1={city1} city2={city2} url={shareUrl} onClose={() => setShowShare(false)} />}

      {/* CONTENT */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 10px 30px" }}>
        {tab === "pulse" && (
          <div style={{ animation: "slideUp .4s ease-out" }}>
            <TimeBridge city1={city1} city2={city2} city3={city3} />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 280px", minWidth: "260px" }}><CityPulse city={city1} /></div>
              <div style={{ flex: "1 1 280px", minWidth: "260px" }}><CityPulse city={city2} /></div>
              {city3 && <div style={{ flex: "1 1 280px", minWidth: "260px" }}><CityPulse city={city3} /></div>}
            </div>
          </div>
        )}
        {tab === "timeline" && <div style={{ animation: "slideUp .4s ease-out" }}><TimelineView city1={city1} city2={city2} /></div>}
        {tab === "duel" && <div style={{ animation: "slideUp .4s ease-out" }}><DuelView city1={city1} city2={city2} city3={city3} /></div>}
        {tab === "oracle" && <div style={{ animation: "slideUp .4s ease-out" }}><OracleChat city1={city1} city2={city2} city3={city3} /></div>}
        {["multi","costs","air","radar","history"].includes(tab) && (
          <div style={{ animation: "slideUp .4s ease-out" }}>
            <ProCitySelector
              multiCities={multiCities}
              onToggleCity={toggleMultiCity}
              onAddCity={() => { setSelecting("multi_add"); setSearch(""); setContinentFilter(null); setUtcFilter(null); }}
            />
            {selecting === "multi_add" && (
              <div style={{ maxWidth: "500px", margin: "0 auto 12px", animation: "fadeIn .3s" }}>
                <FilterChips continentFilter={continentFilter} setContinentFilter={setContinentFilter} utcFilter={utcFilter} setUtcFilter={setUtcFilter} />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} autoFocus
                  placeholder="Search cities to add..." style={{ width: "100%", padding: "9px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.04)", color: "#fff", fontSize: "12px", outline: "none", fontFamily: "'DM Sans'", marginBottom: "6px" }} />
                <div style={{ maxHeight: "220px", overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                  {sortedFiltered.map(c => (
                    <CityCard key={c.id} city={c} onSelect={selectCity} selected={multiCities.includes(c.id)}
                      isFavorite={favorites.includes(c.id)} onToggleFavorite={toggleFavorite} />
                  ))}
                </div>
                <button onClick={() => { setSelecting(null); setSearch(""); }} style={{ width: "100%", padding: "6px", border: "1px solid rgba(255,255,255,.06)", background: "none", color: "#555", fontSize: "9px", cursor: "pointer", borderRadius: "6px", marginTop: "6px", fontFamily: "'DM Sans'" }}>Done</button>
              </div>
            )}
            {tab === "multi" && <MultiCityGrid multiCities={multiCities} />}
            {tab === "costs" && <CostOfLivingPanel multiCities={multiCities} />}
            {tab === "air" && <AirQualityPanel multiCities={multiCities} />}
            {tab === "radar" && <LiveabilityRadar multiCities={multiCities} />}
            {tab === "history" && <HistoricalTrends multiCities={multiCities} />}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "14px", borderTop: "1px solid rgba(255,255,255,.03)" }}>
        <div style={{ fontSize: "8px", letterSpacing: "2px", opacity: .08 }}>LIVEPULSE v3.1 · BUILT BY TAHSEEN · ORACLE POWERED BY OLLAMA</div>
      </div>
    </div>
  );
}
