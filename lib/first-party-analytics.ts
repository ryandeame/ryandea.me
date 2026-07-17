"use client";

const TRACKING_ENDPOINT = "/api/track";
const QUEUE_STORAGE_KEY = "ryandea-first-party-events";
const VISITOR_STORAGE_KEY = "ryandea-visitor-id";
const SESSION_STORAGE_KEY = "ryandea-tracking-session";
const FIRST_TOUCH_STORAGE_KEY = "ryandea-first-touch";
const LAST_TOUCH_STORAGE_KEY = "ryandea-last-touch";
const VISITOR_COOKIE = "ryandea_visitor_id";
const SESSION_COOKIE = "ryandea_session_id";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const FLUSH_INTERVAL_MS = 5_000;
const MAX_BATCH_SIZE = 10;
const MAX_QUEUED_EVENTS = 200;

type TouchAttribution = {
  capturedAt: string;
  landingPage: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  fbclid: string | null;
  ttclid: string | null;
  msclkid: string | null;
};

type QueuedTrackingEvent = {
  eventId: string;
  eventName: string;
  occurredAt: string;
  visitorId: string;
  sessionId: string;
  pagePath: string;
  pageUrl: string;
  referrer: string | null;
  firstTouch: TouchAttribution;
  lastTouch: TouchAttribution;
  properties: Record<string, unknown>;
};

type SessionRecord = {
  id: string;
  lastActivityAt: number;
};

let flushTimer: number | null = null;
let flushPromise: Promise<void> | null = null;
let listenersInitialized = false;

function createId() {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readJson<T>(key: string): T | null {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Tracking must never interrupt the user's workflow.
  }
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function getVisitorId() {
  let visitorId = window.localStorage.getItem(VISITOR_STORAGE_KEY);

  if (!visitorId) {
    visitorId = createId();
    window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
  }

  writeCookie(VISITOR_COOKIE, visitorId, 365 * 24 * 60 * 60);
  return visitorId;
}

function getSession() {
  const now = Date.now();
  const storedSession = readJson<SessionRecord>(SESSION_STORAGE_KEY);
  const isNewSession =
    !storedSession || now - storedSession.lastActivityAt > SESSION_TIMEOUT_MS;
  const session: SessionRecord = {
    id: isNewSession ? createId() : storedSession.id,
    lastActivityAt: now,
  };

  writeJson(SESSION_STORAGE_KEY, session);
  writeCookie(SESSION_COOKIE, session.id, SESSION_TIMEOUT_MS / 1000);

  return { isNewSession, sessionId: session.id };
}

function sanitizePageUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    ["email", "token", "code", "session_id"].forEach((key) => {
      url.searchParams.delete(key);
    });
    return url.toString();
  } catch {
    return rawUrl;
  }
}

function readTouchAttribution() {
  const url = new URL(window.location.href);
  const touch: TouchAttribution = {
    capturedAt: new Date().toISOString(),
    landingPage: sanitizePageUrl(url.toString()),
    referrer: document.referrer ? sanitizePageUrl(document.referrer) : null,
    utmSource: url.searchParams.get("utm_source"),
    utmMedium: url.searchParams.get("utm_medium"),
    utmCampaign: url.searchParams.get("utm_campaign"),
    utmTerm: url.searchParams.get("utm_term"),
    utmContent: url.searchParams.get("utm_content"),
    gclid: url.searchParams.get("gclid"),
    gbraid: url.searchParams.get("gbraid"),
    wbraid: url.searchParams.get("wbraid"),
    fbclid: url.searchParams.get("fbclid"),
    ttclid: url.searchParams.get("ttclid"),
    msclkid: url.searchParams.get("msclkid"),
  };
  const hasCampaignData = Object.entries(touch).some(
    ([key, value]) => !["capturedAt", "landingPage", "referrer"].includes(key) && Boolean(value),
  );
  let firstTouch = readJson<TouchAttribution>(FIRST_TOUCH_STORAGE_KEY);
  let lastTouch = readJson<TouchAttribution>(LAST_TOUCH_STORAGE_KEY);

  if (!firstTouch) {
    firstTouch = touch;
    writeJson(FIRST_TOUCH_STORAGE_KEY, firstTouch);
  }

  if (!lastTouch || hasCampaignData) {
    lastTouch = touch;
    writeJson(LAST_TOUCH_STORAGE_KEY, lastTouch);
  }

  return { firstTouch, lastTouch };
}

function readQueue() {
  return readJson<QueuedTrackingEvent[]>(QUEUE_STORAGE_KEY) ?? [];
}

function writeQueue(events: QueuedTrackingEvent[]) {
  writeJson(QUEUE_STORAGE_KEY, events.slice(-MAX_QUEUED_EVENTS));
}

function removeQueuedEvents(eventIds: Set<string>) {
  writeQueue(readQueue().filter((event) => !eventIds.has(event.eventId)));
}

function scheduleFlush() {
  if (flushTimer !== null) {
    return;
  }

  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    void flushTrackingEvents();
  }, FLUSH_INTERVAL_MS);
}

export async function flushTrackingEvents() {
  if (flushPromise) {
    return flushPromise;
  }

  const batch = readQueue().slice(0, MAX_BATCH_SIZE);

  if (batch.length === 0) {
    return;
  }

  flushPromise = (async () => {
    try {
      const response = await fetch(TRACKING_ENDPOINT, {
        body: JSON.stringify({ events: batch }),
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Tracking endpoint returned ${response.status}`);
      }

      removeQueuedEvents(new Set(batch.map((event) => event.eventId)));
    } catch (error) {
      console.error("[First-party analytics] Failed to flush events:", error);
    } finally {
      flushPromise = null;
      if (readQueue().length > 0) {
        scheduleFlush();
      }
    }
  })();

  return flushPromise;
}

function flushWithBeacon() {
  const batch = readQueue().slice(0, MAX_BATCH_SIZE);

  if (batch.length === 0 || typeof navigator.sendBeacon !== "function") {
    return;
  }

  const queued = navigator.sendBeacon(
    TRACKING_ENDPOINT,
    new Blob([JSON.stringify({ events: batch })], { type: "application/json" }),
  );

  if (queued) {
    removeQueuedEvents(new Set(batch.map((event) => event.eventId)));
  }
}

function initializeListeners() {
  if (listenersInitialized) {
    return;
  }

  listenersInitialized = true;
  window.addEventListener("pagehide", flushWithBeacon);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushWithBeacon();
    }
  });

  if (readQueue().length > 0) {
    scheduleFlush();
  }
}

export function trackFirstPartyEvent(
  eventName: string,
  properties: Record<string, unknown> = {},
  options: { immediate?: boolean } = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  initializeListeners();
  const visitorId = getVisitorId();
  const { isNewSession, sessionId } = getSession();
  const { firstTouch, lastTouch } = readTouchAttribution();
  const currentPageUrl = sanitizePageUrl(window.location.href);
  const sharedEvent = {
    occurredAt: new Date().toISOString(),
    visitorId,
    sessionId,
    pagePath: `${window.location.pathname}${window.location.search}`,
    pageUrl: currentPageUrl,
    referrer: document.referrer ? sanitizePageUrl(document.referrer) : null,
    firstTouch,
    lastTouch,
  };
  const queuedEvents = readQueue();

  if (isNewSession) {
    queuedEvents.push({
      ...sharedEvent,
      eventId: createId(),
      eventName: "session_started",
      properties: {},
    });
  }

  queuedEvents.push({
    ...sharedEvent,
    eventId: createId(),
    eventName,
    properties,
  });
  writeQueue(queuedEvents);

  if (options.immediate || queuedEvents.length >= MAX_BATCH_SIZE) {
    void flushTrackingEvents();
  } else {
    scheduleFlush();
  }
}

export function trackFirstPartyPageView(pagePath: string) {
  trackFirstPartyEvent("page_viewed", {
    page_path: pagePath,
    page_title: document.title,
  });
}
