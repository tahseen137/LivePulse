# 🧠 LivePulse — City Consciousness Engine

> **Feel a city before you go.**

LivePulse treats cities not as rows in a database, but as living, breathing organisms with heartbeats, moods, and souls. Compare any two cities on Earth through emotional weather, sonic identity, and an AI Oracle — powered by real-time data.

![LivePulse](https://img.shields.io/badge/LivePulse-v3.0-FF6B35?style=for-the-badge)
![Cities](https://img.shields.io/badge/Cities-40+-4A90D9?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Claude-8EC5FC?style=for-the-badge)

---

## ✨ Features

### Free Tier
- 🧠 **City Consciousness** — Animated heartbeats, emotional weather, day/night cycles
- ⏳ **Time Bridge** — See what life looks like in both cities right now
- ⚔️ **City Duel** — Head-to-head comparison with visual bar charts
- 🔮 **AI Oracle** — Ask anything about any two cities (5 queries/day)
- 🌍 **40+ Global Cities** — From Dhaka to Tokyo to Lagos to São Paulo

### Pro Tier ($5/mo)
- 📊 **Livability Radar** — 8-dimension scoring across safety, food, culture, cost
- 🌬️ **Air Quality Tracking** — Real-time AQI with historical trends
- 💰 **Cost of Living Deep Dive** — Rent, food, transport, entertainment
- 🗣️ **Language Phrasebooks** — Essential phrases for every city
- 📈 **Historical Trends** — How cities evolve over time
- 🔓 **Unlimited Oracle** — No query limits

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/tahseen137/LivePulse.git
cd LivePulse

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:5173` and start exploring.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | CSS-in-JS (zero dependencies) |
| AI Engine | Anthropic Claude API |
| Hosting | Vercel |
| Fonts | Playfair Display, DM Sans, JetBrains Mono |

---

## 🌍 Supported Cities

Africa: Lagos, Cairo, Nairobi, Cape Town
Asia: Dhaka, Tokyo, Singapore, Mumbai, Istanbul, Seoul, Bangkok, Dubai, Jakarta, KL, Manila, Taipei, Beijing, Hong Kong, Hanoi
Europe: London, Paris, Berlin, Amsterdam, Barcelona, Lisbon, Warsaw, Stockholm, Vienna, Rome, Moscow
North America: Toronto, New York, Los Angeles, San Francisco, Mexico City
South America: São Paulo, Buenos Aires, Lima, Bogotá
Oceania: Sydney

*More cities added regularly. PRs welcome!*

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feat/add-city-xyz`)
3. Add your city to `CITY_DB` in the main component
4. Submit a Pull Request

**Adding a new city is as simple as adding an object:**

```javascript
{
  id: "your_city",
  name: "Your City",
  country: "Country",
  flag: "🏳️",
  lat: 0.00,
  lng: 0.00,
  pop: "1.0M",
  area: "100km²",
  density: "10,000/km²",
  tz: "GMT+0",
  utc: 0,
  currency: "USD $",
  lang: "English",
  accent: "#FF0000",
  continent: "Continent"
}
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Credits

Built by [Tahseen Rahman](https://github.com/tahseen137) with [Claude](https://claude.ai) by Anthropic.

*"Two cities. Two souls. One moment in time."*
