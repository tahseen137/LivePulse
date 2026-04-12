# I Built a City Consciousness Engine in One Conversation with AI

*How LivePulse went from a blank prompt to a production app with 40+ cities in under 24 hours*

---

It started with six words: **"Give me an idea where I can use your maximum potential."**

No spec. No wireframe. No Figma file. Just a human saying to an AI: show me what you've got.

What emerged was LivePulse — a real-time city consciousness engine that treats cities not as rows in a database, but as living organisms with heartbeats, moods, and souls.

## The Problem Nobody Talks About

I've used every city comparison tool out there. Nomad List. Numbeo. Teleport (RIP). They all do the same thing: give you a spreadsheet. Temperature. Rent. Safety score. Internet speed.

All useful. All lifeless.

None of them answer the question that actually matters when you're deciding where to live, visit, or move: **What does this city FEEL like right now?**

Not last month's average. Not a static rating from 2023. Right now. Is the city buzzing with energy or settling into quiet? Are fans roaring in a stadium or streets emptying into night?

## The Solution: Cities as Living Organisms

LivePulse gives every city a consciousness:

**A Heartbeat.** Each city has an animated ECG-style heartbeat line. The rate is derived from population density, traffic intensity, and urban energy. Dhaka pulses at 92 BPM — frenetic, dense, never stopping. Stockholm hums at 55 BPM — calm, measured, precise. You can literally see a city's nervous system.

**Emotional Weather.** Beyond temperature, LivePulse shows a city's emotional state. Is Tokyo "Focused" at 2pm or "Restless" at midnight? Is Lagos "Surging" at dawn or "Vibrant" at sunset? The mood is computed from time of day, density, and urban rhythm.

**A Day/Night Cycle.** A gradient bar shows where each city sits in its 24-hour cycle, with a moving sun or moon orb. When Dhaka is in blazing afternoon, Toronto is in pre-dawn darkness.

**An AI Oracle.** Ask it anything. "Which city is safer?" "Best food under $5?" "Where should a remote worker live?" It synthesizes city data into poetic, specific answers. This is not a chatbot pasted onto a dashboard. It's an AI that genuinely understands the cities it speaks about.

## How It Was Built (The Weird Part)

Here's what makes this story unusual: **the entire product was built inside a single conversation with an AI.**

No IDE. No terminal. No local dev environment. No deployment pipeline.

The AI:
- Searched the web for live breaking news in both cities
- Pulled real-time weather data
- Fetched live NBA and MLB scores (the Raptors were beating the Heat 117-95 that night)
- Searched Google Places for top restaurants and landmarks with ratings
- Then synthesized everything into a complete React application

The first version had 715 lines. The second version exploded to include 15 new features: 5-day forecasts, air quality gauges, livability radar charts, street food prices, language phrasebooks, currency converters, and more.

The third version — the production release — was a full rewrite: 40+ cities, searchable city picker, freemium model, and a clean architecture ready for GitHub and Vercel.

Total time from first prompt to production-ready app: **one extended conversation.**

## The Tech

The stack is deliberately minimal:

- **React 18** — functional components, hooks, zero class components
- **CSS-in-JS** — no Tailwind, no styled-components, no external CSS. Every style is inline. Zero styling dependencies.
- **Anthropic Claude API** — powers the Oracle via direct API calls from the browser
- **Vite** — for bundling and dev server
- **Vercel** — for hosting

The heartbeat animation is a custom SVG path generator that creates an ECG waveform using trigonometric functions, animated via `setInterval` at 30fps. The day/night cycle is a CSS gradient with a positioned orb that moves based on the city's local time. All timezone calculations are done client-side using UTC offsets.

## What I Learned

**1. Emotional data beats raw data.** When I showed people the prototype, nobody asked about the population numbers. Everyone asked about the heartbeat. The mood. The time bridge. People connect with feelings, not spreadsheets.

**2. AI-native apps are a real category.** LivePulse couldn't exist without AI. The Oracle, the emotional weather computation, the voice of the city — these aren't AI features bolted onto a traditional app. They're the foundation. Remove the AI and there's nothing left worth using.

**3. The build process is the story.** The fact that this was built in one conversation isn't a gimmick — it's a signal. If a city consciousness engine can emerge from a single extended conversation between a human and an AI, the barrier to building ambitious software has fundamentally changed.

## What's Next

The immediate roadmap:
- **Real-time weather integration** — live temperature, not static snapshots
- **Cost of living data** — powered by API integrations
- **User city reviews** — crowdsourced mood and feeling ratings
- **Neighborhood-level data** — zoom into districts within cities
- **100+ cities** — covering every major metro globally

The longer vision: a living network of city consciousnesses that anyone can tap into. Open LivePulse and feel Tokyo at dawn, Lagos at noon, and Reykjavik at midnight — all in one scroll.

## Try It

- **Live app:** [LivePulse on Vercel]
- **Source code:** [github.com/tahseen137/LivePulse](https://github.com/tahseen137/LivePulse)
- **Product Hunt:** [producthunt.com/posts/livepulse](https://www.producthunt.com/@tahseen_rahman)

The app is free. The Oracle has 5 queries/day on the free tier. Pro ($5/mo) unlocks everything.

If you've ever wondered what a city feels like at 3am on the other side of the world, LivePulse is for you.

---

*Built by [Tahseen Rahman](https://github.com/tahseen137). Powered by [Claude](https://claude.ai).*

*"Two cities. Two souls. One moment in time."*

---

**Tags:** #webdev #react #ai #showdev #javascript #opensource
