import fs from "node:fs";
import path from "node:path";

import { BigQuery } from "@google-cloud/bigquery";

const projectId =
  process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.GCLOUD_PROJECT ||
  process.env.FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  "deameryan";
const datasetId = process.env.BIGQUERY_ANALYTICS_DATASET || "first_party_analytics";
const location = process.env.BIGQUERY_ANALYTICS_LOCATION || "US";

function findKeyFilename() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }

  const directory = path.join(process.cwd(), "scripts", "firebase");

  if (!fs.existsSync(directory)) {
    return null;
  }

  const files = fs.readdirSync(directory).filter((fileName) => fileName.endsWith(".json"));
  return files.length === 1 ? path.join(directory, files[0]) : null;
}

const keyFilename = findKeyFilename();
const bigquery = new BigQuery({
  projectId,
  ...(keyFilename ? { keyFilename } : {}),
});

const eventsSchema = [
  { name: "event_id", type: "STRING", mode: "REQUIRED" },
  { name: "event_name", type: "STRING", mode: "REQUIRED" },
  { name: "event_source", type: "STRING", mode: "REQUIRED" },
  { name: "occurred_at", type: "TIMESTAMP", mode: "REQUIRED" },
  { name: "received_at", type: "TIMESTAMP", mode: "REQUIRED" },
  { name: "visitor_id", type: "STRING" },
  { name: "session_id", type: "STRING" },
  { name: "page_path", type: "STRING" },
  { name: "page_url", type: "STRING" },
  { name: "referrer", type: "STRING" },
  ...["first", "last"].flatMap((prefix) =>
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "gbraid",
      "wbraid",
      "fbclid",
      "ttclid",
      "msclkid",
    ].map((field) => ({ name: `${prefix}_${field}`, type: "STRING" })),
  ),
  { name: "properties", type: "JSON" },
  { name: "user_agent", type: "STRING" },
  { name: "country", type: "STRING" },
];

const adSpendSchema = [
  { name: "date", type: "DATE", mode: "REQUIRED" },
  { name: "imported_at", type: "TIMESTAMP", mode: "REQUIRED" },
  { name: "platform", type: "STRING", mode: "REQUIRED" },
  { name: "account_id", type: "STRING" },
  { name: "campaign_id", type: "STRING" },
  { name: "campaign_name", type: "STRING" },
  { name: "ad_group_id", type: "STRING" },
  { name: "ad_group_name", type: "STRING" },
  { name: "ad_id", type: "STRING" },
  { name: "ad_name", type: "STRING" },
  { name: "currency", type: "STRING" },
  { name: "impressions", type: "INTEGER" },
  { name: "clicks", type: "INTEGER" },
  { name: "spend_micros", type: "INTEGER" },
  { name: "platform_conversions", type: "FLOAT" },
  { name: "metadata", type: "JSON" },
];

async function ensureTable(tableId, options) {
  const table = bigquery.dataset(datasetId).table(tableId);
  const [exists] = await table.exists();

  if (exists) {
    console.log(`BigQuery table already exists: ${datasetId}.${tableId}`);
    return;
  }

  await bigquery.dataset(datasetId).createTable(tableId, options);
  console.log(`Created BigQuery table: ${datasetId}.${tableId}`);
}

const dataset = bigquery.dataset(datasetId);
const [datasetExists] = await dataset.exists();

if (!datasetExists) {
  await bigquery.createDataset(datasetId, { location });
  console.log(`Created BigQuery dataset: ${projectId}.${datasetId} (${location})`);
}

await ensureTable("events", {
  schema: eventsSchema,
  timePartitioning: { field: "received_at", type: "DAY" },
  clustering: { fields: ["event_name", "session_id", "last_utm_campaign"] },
});

await ensureTable("ad_spend_daily", {
  schema: adSpendSchema,
  timePartitioning: { field: "date", type: "DAY" },
  clustering: { fields: ["platform", "campaign_id"] },
});

console.log("BigQuery analytics setup complete.");
