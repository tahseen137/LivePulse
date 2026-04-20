// Vercel Edge Function — Stripe Checkout session creator
// Creates a $5/mo subscription checkout session and returns the redirect URL.
// Required env vars: STRIPE_SECRET_KEY, STRIPE_PRICE_ID

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!secretKey || !priceId) {
    return new Response(
      JSON.stringify({ error: 'Stripe is not configured on this server.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const origin = req.headers.get('origin') || 'https://livepulse.vercel.app';

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      mode: 'subscription',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      // Stripe replaces {CHECKOUT_SESSION_ID} with the real session ID
      success_url: `${origin}/?pro_session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    }),
  });

  const session = await res.json();

  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: session.error?.message || 'Stripe error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ url: session.url }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
