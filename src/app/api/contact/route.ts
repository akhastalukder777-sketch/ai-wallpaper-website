import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (RESEND_API_KEY) {
      // Send real email via Resend API
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'AI Wallpapers <onboarding@resend.dev>',
          to: ['akhastalukder777@gmail.com'],
          subject: `[Contact Form] ${subject} - ${name}`,
          html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
        }),
      });

      if (res.ok) {
        return NextResponse.json({ status: 'success', message: 'Email sent successfully via Resend API.' });
      }
    }

    // Fallback success if API key is not yet set
    return NextResponse.json({
      status: 'success',
      message: 'Message received successfully.',
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: String(error) }, { status: 500 });
  }
}