export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      try {
        const data = await request.json();
        const name = (data.name || '').trim();
        const email = (data.email || '').trim();
        const message = (data.message || '').trim();

        if (!message) {
          return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const SENDGRID_API_KEY = env.SENDGRID_API_KEY;
        const SENDGRID_FROM = env.SENDGRID_FROM || 'info@softskill.ro';
        const SENDGRID_TO = env.SENDGRID_TO || 'info@softskill.ro';

        if (!SENDGRID_API_KEY) {
          return new Response(JSON.stringify({ error: 'Missing SENDGRID_API_KEY in environment' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const subject = `Website contact from ${name || email || 'visitor'}`;
        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

        const payload = {
          personalizations: [
            {
              to: [{ email: SENDGRID_TO }]
            }
          ],
          from: { email: SENDGRID_FROM },
          subject: subject,
          content: [{ type: 'text/plain', value: body }]
        };

        const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SENDGRID_API_KEY}`
          },
          body: JSON.stringify(payload)
        });

        if (!resp.ok) {
          const text = await resp.text();
          return new Response(JSON.stringify({ error: 'SendGrid error', detail: text }), { status: 502, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }

    // Fallback to static assets (Workers Sites)
    return env.ASSETS.fetch(request);
  }
};
