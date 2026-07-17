import "server-only";

import fs from "node:fs";
import path from "node:path";

import { BigQuery } from "@google-cloud/bigquery";

const DEFAULT_DATASET = "first_party_analytics";
const DEFAULT_EVENTS_TABLE = "events";

export type WarehouseEvent = {
  event_id: string;
  event_name: string;
  event_source: string;
  occurred_at: string;
  received_at: string;
  visitor_id: string | null;
  session_id: string | null;
  page_path: string | null;
  page_url: string | null;
  referrer: string | null;
  first_utm_source: string | null;
  first_utm_medium: string | null;
  first_utm_campaign: string | null;
  first_utm_term: string | null;
  first_utm_content: string | null;
  first_gclid: string | null;
  first_gbraid: string | null;
  first_wbraid: string | null;
  first_fbclid: string | null;
  first_ttclid: string | null;
  first_msclkid: string | null;
  last_utm_source: string | null;
  last_utm_medium: string | null;
  last_utm_campaign: string | null;
  last_utm_term: string | null;
  last_utm_content: string | null;
  last_gclid: string | null;
  last_gbraid: string | null;
  last_wbraid: string | null;
  last_fbclid: string | null;
  last_ttclid: string | null;
  last_msclkid: string | null;
  properties: Record<string, unknown>;
  user_agent: string | null;
  country: string | null;
};

let bigQueryClient: BigQuery | null = null;

function findLocalServiceAccount() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }

  const firebaseDirectory = path.join(process.cwd(), "scripts", "firebase");

  if (!fs.existsSync(firebaseDirectory)) {
    return null;
  }

  const serviceAccountFiles = fs
    .readdirSync(firebaseDirectory)
    .filter((fileName) => fileName.endsWith(".json"));

  return serviceAccountFiles.length === 1
    ? path.join(firebaseDirectory, serviceAccountFiles[0])
    : null;
}

function getGoogleCloudProjectId() {
  return (
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "deameryan"
  );
}

function getBigQueryClient() {
  if (bigQueryClient) {
    return bigQueryClient;
  }

  const keyFilename = findLocalServiceAccount();
  bigQueryClient = new BigQuery({
    projectId: getGoogleCloudProjectId(),
    ...(keyFilename ? { keyFilename } : {}),
  });

  return bigQueryClient;
}

export async function insertTrackingEvents(events: WarehouseEvent[]) {
  if (events.length === 0) {
    return;
  }

  const datasetName = process.env.BIGQUERY_ANALYTICS_DATASET || DEFAULT_DATASET;
  const tableName = process.env.BIGQUERY_ANALYTICS_EVENTS_TABLE || DEFAULT_EVENTS_TABLE;
  const rows = events.map((event) => ({
    insertId: event.event_id,
    json: event,
  }));

  await getBigQueryClient()
    .dataset(datasetName)
    .table(tableName)
    .insert(rows, { raw: true });
}
