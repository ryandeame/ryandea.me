import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  message: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = contactSchema.parse(body);

    const subjectPrefix = process.env.CONTACT_SUBJECT_PREFIX || "[PORTFOLIO]";

    const {
      SMTP_HOST,
      SMTP_PORT = "587",
      SMTP_USER,
      SMTP_PASS,
      SMTP_FROM,
      CONTACT_TO,
    } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM || !CONTACT_TO) {
      return NextResponse.json(
        { ok: false, error: "Email is not configured" },
        { status: 500 },
      );
    }

    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transport.sendMail({
      from: `"Portfolio Contact" <${SMTP_FROM}>`,
      to: CONTACT_TO,
      replyTo: email,
      subject: `${subjectPrefix} New contact from ${name}`,
      text: message,
      html: `<p style="white-space:pre-line;">${message}</p><p>From: ${name} (${email})</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] failed to send", error);

    const status = error instanceof z.ZodError ? 400 : 500;
    const message =
      error instanceof z.ZodError
        ? "Please check your inputs"
        : "Unable to send message";

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
