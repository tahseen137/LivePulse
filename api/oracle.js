// Vercel Edge Function — Oracle API Proxy
// Hides the Anthropic API key server-side and enforces the 5 queries/day free limit
// via a signed HttpOnly cookie (count.date.hmac). Pro users bypass the limit via
// a signed lp_pro cookie set by /api/pro-callback after Stripe checkout.
// NOTE: Cookie-based limits reset if a user clears cookies — acceptable for this MVP.

export const config = { runtime: 'edge' };

const DAILY_FREE_LIMIT = 5;

async function hmacSign(secret, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

async function hmacVerify(secret, data, b64sig) {
  return (await hmacSign(secret, data)) === b64sig;
}

function parseCookie(header, name) {
  if (!header) return null;
  const m = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const secret = process.env.COOKIE_SECRET;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'server_misconfigured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  const cookieHeader = req.headers.get('cookie');
  const today = todayStr();
  let isPro = false;
  let usageCount = 0;

  // --- Check pro cookie ---
  if (secret) {
    const proCookie = parseCookie(cookieHeader, 'lp_pro');
    if (proCookie) {
      const lastDot = proCookie.lastIndexOf('.');
      const payload = proCookie.slice(0, lastDot);
      const sig = proCookie.slice(lastDot + 1);
      const parts = payload.split('.');
      const expiry = parts[parts.length - 1];
      if (
        await hmacVerify(secret, payload, sig) &&
        (expiry === 'never' || expiry > today)
      ) {
        isPro = true;
      }
    }
  }

  // --- Check usage cookie ---
  if (!isPro) {
    if (secret) {
      const usageCookie = parseCookie(cookieHeader, 'lp_usage');
      if (usageCookie) {
        const lastDot = usageCookie.lastIndexOf('.');
        const payload = usageCookie.slice(0, lastDot);
        const sig = usageCookie.slice(lastDot + 1);
        const [count, day] = payload.split('.');
        if (await hmacVerify(secret, payload, sig) && day === today) {
          usageCount = parseInt(count, 10) || 0;
        }
      }

      if (usageCount >= DAILY_FREE_LIMIT) {
        return new Response(
          JSON.stringify({ error: 'rate_limit', remaining: 0 }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    // If COOKIE_SECRET is not set (local dev), rate limiting is skipped
  }

  // --- Parse request ---
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const { question, city1, city2 } = body;
  if (!question || !city1 || !city2) {
    return new Response(JSON.stringify({ error: 'missing_fields' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  // --- Call Anthropic ---
  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are "The Oracle" of LivePulse — an AI with deep awareness of cities. Today: ${new Date().toLocaleDateString()}.
City 1: ${city1.name}, ${city1.country}. Pop: ${city1.pop}. Density: ${city1.density}. Currency: ${city1.currency}. Language: ${city1.lang}. TZ: ${city1.tz}.
City 2: ${city2.name}, ${city2.country}. Pop: ${city2.pop}. Density: ${city2.density}. Currency: ${city2.currency}. Language: ${city2.lang}. TZ: ${city2.tz}.
Answer poetically but with specific data in 2-4 sentences: "${question}"`,
      }],
    }),
  });

  const data = await anthropicRes.json();

  // --- Build response with updated usage cookie ---
  const newCount = isPro ? usageCount : usageCount + 1;
  const remaining = isPro ? null : Math.max(0, DAILY_FREE_LIMIT - newCount);
  const resHeaders = new Headers({ 'Content-Type': 'application/json' });

  if (!isPro && secret) {
    const payload = `${newCount}.${today}`;
    const sig = await hmacSign(secret, payload);
    const cookieVal = encodeURIComponent(`${payload}.${sig}`);
    resHeaders.set(
      'Set-Cookie',
      `lp_usage=${cookieVal}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
    );
  }

  return new Response(
    JSON.stringify({ ...data, _remaining: remaining }),
    { status: anthropicRes.status, headers: resHeaders }
  );
}
