import "server-only";

import { randomUUID } from "node:crypto";

import { type WarehouseEvent, insertTrackingEvents } from "@/lib/bigquery";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

const VISITOR_COOKIE = "ryandea_visitor_id";
const SESSION_COOKIE = "ryandea_session_id";

type TrackingIdentity = {
  visitorId: string | null;
  sessionId: string | null;
};

type TouchAttribution = {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  gclid?: string | null;
  gbraid?: string | null;
  wbraid?: string | null;
  fbclid?: string | null;
  ttclid?: string | null;
  msclkid?: string | null;
};

function parseCookies(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  return new Map(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separator = part.indexOf("=");
        const key = separator >= 0 ? part.slice(0, separator) : part;
        const rawValue = separator >= 0 ? part.slice(separator + 1) : "";
        return [key, decodeURIComponent(rawValue)] as const;
      }),
  );
}

export function getRequestTrackingIdentity(request: Request): TrackingIdentity {
  const cookies = parseCookies(request);
  return {
    visitorId: cookies.get(VISITOR_COOKIE) ?? null,
    sessionId: cookies.get(SESSION_COOKIE) ?? null,
  };
}

function getCountry(request: Request) {
  return (
    request.headers.get("x-appengine-country") ||
    request.headers.get("x-vercel-ip-country") ||
    null
  );
}

function getPagePath(pageUrl: string | null) {
  if (!pageUrl) {
    return null;
  }

  try {
    const url = new URL(pageUrl);
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

function touchFields(prefix: "first" | "last", touch?: TouchAttribution | null) {
  return {
    [`${prefix}_utm_source`]: touch?.utmSource ?? null,
    [`${prefix}_utm_medium`]: touch?.utmMedium ?? null,
    [`${prefix}_utm_campaign`]: touch?.utmCampaign ?? null,
    [`${prefix}_utm_term`]: touch?.utmTerm ?? null,
    [`${prefix}_utm_content`]: touch?.utmContent ?? null,
    [`${prefix}_gclid`]: touch?.gclid ?? null,
    [`${prefix}_gbraid`]: touch?.gbraid ?? null,
    [`${prefix}_wbraid`]: touch?.wbraid ?? null,
    [`${prefix}_fbclid`]: touch?.fbclid ?? null,
    [`${prefix}_ttclid`]: touch?.ttclid ?? null,
    [`${prefix}_msclkid`]: touch?.msclkid ?? null,
  };
}

export function createWarehouseEvent(
  request: Request,
  event: {
    eventId?: string;
    eventName: string;
    eventSource: string;
    occurredAt?: string;
    visitorId?: string | null;
    sessionId?: string | null;
    pagePath?: string | null;
    pageUrl?: string | null;
    referrer?: string | null;
    firstTouch?: TouchAttribution | null;
    lastTouch?: TouchAttribution | null;
    properties?: Record<string, unknown>;
  },
): WarehouseEvent {
  const requestIdentity = getRequestTrackingIdentity(request);
  const pageUrl = event.pageUrl ?? request.headers.get("referer") ?? null;

  return {
    event_id: event.eventId ?? randomUUID(),
    event_name: event.eventName,
    event_source: event.eventSource,
    occurred_at: event.occurredAt ?? new Date().toISOString(),
    received_at: new Date().toISOString(),
    visitor_id: event.visitorId ?? requestIdentity.visitorId,
    session_id: event.sessionId ?? requestIdentity.sessionId,
    page_path: event.pagePath ?? getPagePath(pageUrl),
    page_url: pageUrl,
    referrer: event.referrer ?? null,
    ...touchFields("first", event.firstTouch),
    ...touchFields("last", event.lastTouch),
    properties: event.properties ?? {},
    user_agent: request.headers.get("user-agent"),
    country: getCountry(request),
  } as WarehouseEvent;
}

export async function drainTrackingOutbox(limit = 25) {
  const { adminDb } = getFirebaseAdmin();
  const snapshot = await adminDb
    .collection("trackingOutbox")
    .orderBy("createdAt", "asc")
    .limit(limit)
    .get();

  if (snapshot.empty) {
    return;
  }

  const rows = snapshot.docs.map((document) => document.data().event as WarehouseEvent);
  await insertTrackingEvents(rows);

  const batch = adminDb.batch();
  snapshot.docs.forEach((document) => batch.delete(document.ref));
  await batch.commit();
}

export async function recordServerTrackingEvent(
  request: Request,
  event: Parameters<typeof createWarehouseEvent>[1],
) {
  const row = createWarehouseEvent(request, event);

  try {
    const { adminDb, fieldValue } = getFirebaseAdmin();
    const safeDocumentId = row.event_id.replaceAll("/", "_");
    await adminDb.collection("trackingOutbox").doc(safeDocumentId).set({
      createdAt: fieldValue.serverTimestamp(),
      event: row,
    });
    await drainTrackingOutbox();
  } catch (error) {
    console.error(`[Tracking] Failed to deliver ${row.event_name}:`, error);
  }

  return row.event_id;
}
