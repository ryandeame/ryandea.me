import { NextResponse } from "next/server";
import { z } from "zod";

import { insertTrackingEvents } from "@/lib/bigquery";
import { createWarehouseEvent } from "@/lib/server-tracking";

export const runtime = "nodejs";

const touchSchema = z.object({
  utmSource: z.string().max(500).nullable().optional(),
  utmMedium: z.string().max(500).nullable().optional(),
  utmCampaign: z.string().max(500).nullable().optional(),
  utmTerm: z.string().max(500).nullable().optional(),
  utmContent: z.string().max(500).nullable().optional(),
  gclid: z.string().max(500).nullable().optional(),
  gbraid: z.string().max(500).nullable().optional(),
  wbraid: z.string().max(500).nullable().optional(),
  fbclid: z.string().max(500).nullable().optional(),
  ttclid: z.string().max(500).nullable().optional(),
  msclkid: z.string().max(500).nullable().optional(),
});

const eventSchema = z.object({
  eventId: z.string().min(1).max(128),
  eventName: z.string().regex(/^[a-z0-9_]+$/).max(64),
  occurredAt: z.iso.datetime(),
  visitorId: z.string().min(1).max(128),
  sessionId: z.string().min(1).max(128),
  pagePath: z.string().max(2_000),
  pageUrl: z.string().max(4_000),
  referrer: z.string().max(4_000).nullable(),
  firstTouch: touchSchema,
  lastTouch: touchSchema,
  properties: z.record(z.string().max(100), z.unknown()),
});

const batchSchema = z.object({
  events: z.array(eventSchema).min(1).max(20),
});

function parseOrigin(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function isAllowedOrigin(request: Request) {
  const origin = parseOrigin(request.headers.get("origin"));

  if (!origin) {
    return true;
  }

  const allowedOrigins = new Set<string>();
  const addAllowedOrigin = (value: string | null) => {
    const parsed = parseOrigin(value);
    if (parsed) {
      allowedOrigins.add(parsed);
    }
  };

  addAllowedOrigin(request.url);
  addAllowedOrigin(process.env.NEXT_PUBLIC_SITE_URL ?? null);
  addAllowedOrigin("https://ryandea.me");
  addAllowedOrigin("https://www.ryandea.me");

  const forwardedProto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = request.headers.get("host")?.split(",")[0]?.trim();

  if (forwardedHost) {
    addAllowedOrigin(`${forwardedProto}://${forwardedHost}`);
  }
  if (host) {
    addAllowedOrigin(`${forwardedProto}://${host}`);
  }

  const projectId =
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "deameryan";
  addAllowedOrigin(`https://${projectId}.web.app`);
  addAllowedOrigin(`https://${projectId}.firebaseapp.com`);

  return allowedOrigins.has(origin);
}

export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ ok: false, error: "Origin not allowed" }, { status: 403 });
    }

    const contentLength = Number(request.headers.get("content-length") || 0);

    if (contentLength > 64 * 1024) {
      return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
    }

    const payload = batchSchema.parse(await request.json());
    const rows = payload.events.map((event) =>
      createWarehouseEvent(request, {
        eventId: event.eventId,
        eventName: event.eventName,
        eventSource: "browser",
        occurredAt: event.occurredAt,
        visitorId: event.visitorId,
        sessionId: event.sessionId,
        pagePath: event.pagePath,
        pageUrl: event.pageUrl,
        referrer: event.referrer,
        firstTouch: event.firstTouch,
        lastTouch: event.lastTouch,
        properties: event.properties,
      }),
    );

    await insertTrackingEvents(rows);

    return NextResponse.json(
      { accepted: rows.length, ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[Tracking] Failed to ingest browser events:", error);
    const status = error instanceof z.ZodError ? 400 : 503;
    return NextResponse.json(
      { ok: false, error: status === 400 ? "Invalid event batch" : "Tracking unavailable" },
      { status },
    );
  }
}
