# LivePulse — CLAUDE.md

## What It Is
**City Consciousness Engine** — a real-time city comparison app. Treats cities as living organisms: animated ECG heartbeats, emotional moods, day/night cycles, and an AI Oracle powered by local Ollama for natural-language city queries.

- v3.3.0 · Author: Tahseen Rahman · Repo: https://github.com/tahseen137/LivePulse
- Client-side React SPA, **no backend, no database** — everything runs in the browser

## Run / Build
```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # → dist/
npm run preview  # test production build locally
```

Deployed to **Vercel** via GitHub push (`vercel.json` + `npm run build`).

## File Map
```
src/App.jsx         # Entire application — ~1550 lines, intentionally monolithic
src/main.jsx        # React entry point
index.html          # Vite HTML shell (imports fonts)
landing.html        # Marketing landing page (plain HTML, no React)
vite.config.js      # Port 5173, output dist/
vercel.json         # Vercel build config
```

No CSS files — all styles are inline React style objects + a `<style>` tag with keyframe animations.

## Architecture
- **Monolithic by design** — single `App.jsx`, no component folders, no routing, no state library
- **Client-side only** — timezone math, heartbeat generation, mood computation, and all Pro data in the browser
- **No tests** — no jest/vitest setup
- **Oracle powered by local Ollama** — calls `http://localhost:11434/api/chat` with the `gemma4` model. Requires Ollama running locally (`ollama serve`). Graceful error message if offline.
- **localStorage persistence** — Oracle chat history per city pair, favorites, recents, Pro status and user info

## Key Data Constants (`src/App.jsx`)

| Name | Purpose |
|------|---------|
| `CITY_DB` | 40 city objects with lat/lng, pop, density, UTC, accent colour |
| `COST_OF_LIVING` | Monthly USD estimates (rent, food, transport, entertainment) for all 40 cities |
| `LIVABILITY` | 8-dimension scores [Safety, Affordability, Internet, Weather, Culture, Food, Transport, Nightlife] for all 40 cities |
| `HISTORY` | Population trend in millions, 2020–2024, for all 40 cities |
| `LIVABILITY_LABELS` | Label array for the 8 radar dimensions |
| `HISTORY_YEARS` | `[2020, 2021, 2022, 2023, 2024]` |

## Key Functions (`src/App.jsx`)

| Name | Purpose |
|------|---------|
| `getCityTime(utc)` | Current local time from UTC offset |
| `getDayPhase(h)` | Hour → `{p, e, d}` (phase, emoji, description) |
| `getHeartRate(city)` | Density → BPM in range 50–120 |
| `getMood(h, density)` | Hour + density → emotional state string |
| `getHourlyBPM(city, hour)` | BPM with sine-curve daily variation |
| `getMoodColor(mood)` | Mood → hex accent colour |
| `getAqiColor(aqi)` | US AQI number → colour (green→maroon scale) |
| `getAqiLabel(aqi)` | US AQI → human-readable label |

## Key Components (`src/App.jsx`)

| Component | Purpose |
|-----------|---------|
| `HeartbeatLine` | SVG ECG waveform animated at 30fps |
| `DayNightBar` | 24h gradient bar with animated sun/moon orb |
| `MoodTimeline` | 24-hour BPM and mood bar chart |
| `TimelineView` | Side-by-side MoodTimeline for two cities |
| `CityCard` | City picker button (flag, name, phase emoji, favorite star) |
| `FilterChips` | Continent + UTC range filter chips for city picker |
| `CityPulse` | Main city panel — heartbeat, clock, mood, stats |
| `TimeBridge` | Side-by-side time comparison, shows hour difference (supports 3 cities) |
| `OracleChat` | AI chat — calls Cloudflare-proxied Ollama gemma4:e4b, persists last 20 messages per city pair |
| `DuelView` | Head-to-head bar charts (population, density, BPM) — supports 3 cities |
| `ShareCard` | Share modal with copyable URL |
| `ProCitySelector` | Pro: shared city pill bar — clickable chips to remove cities, `+ City` button to add |
| `MultiCityGrid` | Pro: grid of live CityPulse cards for selected cities |
| `CostOfLivingPanel` | Pro: bar chart comparison of monthly costs across selected cities |
| `AirQualityPanel` | Pro: real-time PM2.5/PM10/AQI cards via Open-Meteo API |
| `RadarChart` | Pro: SVG octagonal radar chart for 8 livability dimensions |
| `LiveabilityRadar` | Pro: grid of RadarChart per city with score table |
| `HistoricalTrends` | Pro: SVG multi-line population trend chart (2020–2024) |
| `App` (LivePulse) | Root — all state, 9 tabs (Pulse/Timeline/Duel/Oracle + 5 Pro), city picker, Pro modal |

## Tab System

| Tab | Label | Type |
|-----|-------|------|
| `pulse` | 🧠 Pulse | Free |
| `timeline` | 📊 Timeline | Free |
| `duel` | ⚔️ Duel | Free |
| `oracle` | 🔮 Oracle | Free |
| `multi` | 🏙️ Multi ⭐ | Pro |
| `costs` | 💰 Costs ⭐ | Pro |
| `air` | 🌬️ Air ⭐ | Pro |
| `radar` | 📡 Radar ⭐ | Pro |
| `history` | 📈 History ⭐ | Pro |

Pro tabs require sign-up. Clicking a Pro tab without signing up opens the sign-up modal. Sign-up is free (name + email); Pro access is granted immediately and persisted in localStorage.

## City Data Shape
```js
{
  id,        // unique key e.g. "dhaka"
  name,      // display name
  country,   // country name
  flag,      // emoji flag
  lat, lng,  // coordinates (used for Open-Meteo air quality API)
  pop,       // formatted string e.g. "22.4M"
  area,      // formatted string e.g. "306km²"
  density,   // formatted string e.g. "73,200/km²"
  tz,        // display string e.g. "GMT+6"
  utc,       // numeric offset e.g. 6, -5, 5.5
  currency,  // e.g. "৳ BDT"
  lang,      // primary language(s)
  accent,    // hex color for UI theming
  continent
}
```

40 cities across Africa, Asia, Europe, North/South America, Oceania.

## External Integrations
- **Ollama (Cloudflare proxy)** — endpoint `${VITE_OLLAMA_URL}/api/chat`, model `gemma4:e4b`, stream: true (NDJSON). Called in `OracleChat`. Requires `VITE_OLLAMA_URL` and `VITE_OLLAMA_KEY` env vars (set in `.env`, never committed). Auth via `Authorization: Bearer <VITE_OLLAMA_KEY>`.
- **Open-Meteo Air Quality API** — `https://air-quality-api.open-meteo.com/v1/air-quality` with `?latitude=&longitude=&current=pm2_5,pm10,us_aqi`. Free, no API key. Called in `AirQualityPanel` when the Air tab is active.
- **Google Fonts** — Playfair Display, DM Sans, JetBrains Mono (loaded in `index.html`)
- **Vercel** — hosting + CI/CD

## localStorage Keys

| Key | Value |
|-----|-------|
| `lp_pro` | `"true"` if user signed up for Pro (free sign-up gate) |
| `lp_pro_user` | JSON `{name, email}` from the Pro sign-up form |
| `livepulse_favorites` | JSON array of city ids |
| `livepulse_recents` | JSON array of `{c1, c2}` recent pairs (max 5) |
| `livepulse_oracle_<ids>` | JSON array of `{q, a}` Oracle history per city pair (max 20) |

## Multi-City State
`multiCities` is a `useState` array of up to 6 city ids, defaulting to `["dhaka", "toronto", "tokyo", "london", "nyc", "dubai"]`. It is shared across all 5 Pro tabs. The `ProCitySelector` bar at the top of every Pro tab shows the current cities as chips (click to remove) and a `+ City` button to add more (capped at 6).

## Known Gaps / Gotchas
- **Oracle env vars required** — `VITE_OLLAMA_URL` and `VITE_OLLAMA_KEY` must be set in `.env` (local) and in Vercel env vars (production). Falls back to `http://localhost:11434` with no auth if vars are absent.
- **Pro sign-up is honor system** — name + email form grants Pro access client-side only. No server validation, no email verification, no payment.
- **Air quality depends on Open-Meteo** — if the API is down or rate-limited, AQI shows "—". No caching; refetches on every tab visit.
- **No real-time external data for other features** — weather, news, sports are not implemented; all Pro data (cost, livability, history) is hardcoded.
- **Each component owns its own `setInterval`** — no shared animation tick. With 6 cities in multi-view this is ~18 intervals.
- **No error boundaries** — unhandled React errors will crash the whole app.
- **No accessibility** — missing ARIA labels and keyboard navigation.
- **Adding a city:** Add an object to `CITY_DB`, then add entries to `COST_OF_LIVING`, `LIVABILITY`, and `HISTORY` with the same id key.
