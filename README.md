Deployment and form sending

This project serves static site assets with a Cloudflare Worker that exposes an API endpoint to send contact messages via SendGrid.

Setup (required):

1. Install Wrangler (Cloudflare CLI) and login:

```bash
npm install -g wrangler
wrangler login
```

2. Add the SendGrid API key as a secret:

```bash
wrangler secret put SENDGRID_API_KEY
```

Optionally, set the sender and recipient addresses (defaults to info@softskill.ro):

```bash
wrangler secret put SENDGRID_FROM
wrangler secret put SENDGRID_TO
```

3. Publish the Worker (it will serve the static site and the `/api/contact` endpoint):

```bash
wrangler publish
```

Local testing:

```bash
wrangler dev
# then open http://127.0.0.1:8787 in your browser and submit the contact form
```

Notes:
- The Worker expects the `SENDGRID_API_KEY` secret to be available. The sender (`SENDGRID_FROM`) must be a verified sender in your SendGrid account.
- If you'd rather use a different email provider (Mailgun, SMTP relay, etc.), I can adapt the worker code accordingly.
