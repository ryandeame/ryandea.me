import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

import { recordServerTrackingEvent } from "@/lib/server-tracking";

const newsletterSchema = z.object({
  email: z.string().email().max(200),
});

function getDevelopmentErrorDetails(error: unknown) {
  if (process.env.NODE_ENV === "production" || !(error instanceof Error)) {
    return undefined;
  }

  const smtpError = error as Error & {
    code?: string;
    command?: string;
    responseCode?: number;
  };

  return {
    message: smtpError.message,
    code: smtpError.code,
    command: smtpError.command,
    responseCode: smtpError.responseCode,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = newsletterSchema.parse(body);

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
      from: `"Portfolio Newsletter" <${SMTP_FROM}>`,
      to: CONTACT_TO,
      replyTo: email,
      subject: "Signing up for newsletter",
      text: `Newsletter signup request from ${email}`,
      html: `<p>Newsletter signup request from <strong>${email}</strong></p>`,
    });

    await recordServerTrackingEvent(req, {
      eventName: "newsletter_signup",
      eventSource: "server",
      properties: { signup_type: "newsletter" },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[newsletter] failed to send", error);

    const status = error instanceof z.ZodError ? 400 : 500;
    const message =
      error instanceof z.ZodError
        ? "Enter a valid email address"
        : "Unable to sign up";

    return NextResponse.json(
      {
        ok: false,
        error: message,
        details: getDevelopmentErrorDetails(error),
      },
      { status },
    );
  }
}
