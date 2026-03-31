// functions/api/contact.js
// Mailgun contact form handler
// Uses mg.adriancojocaru.art domain, sends FROM studio@adriancojocaru.art

export async function onRequestPost(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (message.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Message is too long' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sanitize = (str) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const cleanName = sanitize(name);
    const cleanEmail = sanitize(email);
    const cleanMessage = sanitize(message);

    const emailBody = `
Name: ${cleanName}
Email: ${cleanEmail}

Message:
---
${cleanMessage}
---

Submitted from: adriancojocaru.art
Timestamp: ${new Date().toISOString()}
`;

    // Send via Mailgun using mg.adriancojocaru.art subdomain
    const mailgunAuth = btoa(`api:${env.MAILGUN_API_KEY}`);

    const mailgunResponse = await fetch(
      `https://api.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${mailgunAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          from: 'studio@adriancojocaru.art',
          to: env.CONTACT_EMAIL,
          'reply-to': cleanEmail,
          subject: `New contact form submission from ${cleanName}`,
          text: emailBody,
        }),
      }
    );

    if (!mailgunResponse.ok) {
      const errorText = await mailgunResponse.text();
      console.error('Mailgun error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you! Your message has been sent.',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://adriancojocaru.art',
        },
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://adriancojocaru.art',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
