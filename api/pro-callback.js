// Vercel Edge Function — Pro tier activation after Stripe Checkout
// Called by the app when Stripe redirects back with ?pro_session=<SESSION_ID>.
// Verifies the Stripe session, then sets a signed lp_pro HttpOnly cookie valid 35 days.
// Production note: for subscription cancellation, add a Stripe webhook that clears
// or invalidates the lp_pro cookie via a separate endpoint.
// Required env vars: STRIPE_SECRET_KEY, COOKIE_SECRET

export const config = { runtime: 'edge' };

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

export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'missing session_id' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const cookieSecret = process.env.COOKIE_SECRET;

  if (!stripeKey || !cookieSecret) {
    return new Response(JSON.stringify({ error: 'not_configured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verify Stripe session
  const stripeRes = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
    { headers: { Authorization: `Bearer ${stripeKey}` } }
  );
  const session = await stripeRes.json();

  if (!stripeRes.ok || session.status !== 'complete') {
    return new Response(JSON.stringify({ error: 'invalid_or_incomplete_session' }), {
      status: 402, headers: { 'Content-Type': 'application/json' },
    });
  }

  // Build signed pro cookie: customerId.expiry.hmac
  const customerId = session.customer || 'anon';
  const expiry = new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const payload = `${customerId}.${expiry}`;
  const sig = await hmacSign(cookieSecret, payload);
  const cookieVal = encodeURIComponent(`${payload}.${sig}`);

  const headers = new Headers({ 'Content-Type': 'application/json' });
  headers.set(
    'Set-Cookie',
    `lp_pro=${cookieVal}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${35 * 24 * 60 * 60}`
  );

  return new Response(JSON.stringify({ isPro: true }), { status: 200, headers });
}
