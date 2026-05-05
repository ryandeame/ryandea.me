import fs from "node:fs";
import path from "node:path";

import { applicationDefault, cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getServiceAccountPath() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }

  const localFirebaseDir = path.join(process.cwd(), "scripts", "firebase");

  if (!fs.existsSync(localFirebaseDir)) {
    return null;
  }

  const localJsonFiles = fs
    .readdirSync(localFirebaseDir)
    .filter((fileName) => fileName.endsWith(".json"));

  if (localJsonFiles.length === 0) {
    return null;
  }

  if (localJsonFiles.length > 1) {
    throw new Error(
      `Expected one local Firebase service account JSON in ${localFirebaseDir}, but found ${localJsonFiles.length}.`,
    );
  }

  return path.join(localFirebaseDir, localJsonFiles[0]);
}

function getScriptFirebaseEnvValue(key: string) {
  const envPath = path.join(process.cwd(), "scripts", "firebase", ".env");

  if (!fs.existsSync(envPath)) {
    return null;
  }

  const contents = fs.readFileSync(envPath, "utf8");
  const line = contents
    .split(/\r?\n/)
    .find((rawLine) => rawLine.trim().startsWith(`${key}=`));

  if (!line) {
    return null;
  }

  const rawValue = line.slice(line.indexOf("=") + 1).trim();
  const quote = rawValue[0];

  if ((quote === "\"" || quote === "'") && rawValue.endsWith(quote)) {
    return rawValue.slice(1, -1);
  }

  return rawValue;
}

function normalizeStorageBucketName(bucketName: string | null | undefined) {
  if (!bucketName) {
    return null;
  }

  const trimmedBucketName = bucketName.trim();

  if (!trimmedBucketName) {
    return null;
  }

  const withoutProtocol = trimmedBucketName.startsWith("gs://")
    ? trimmedBucketName.slice("gs://".length)
    : trimmedBucketName;

  return withoutProtocol.split("/")[0] || null;
}

function getStorageBucketName() {
  return normalizeStorageBucketName(
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    getScriptFirebaseEnvValue("FIREBASE_STORAGE_BUCKET") ||
    getScriptFirebaseEnvValue("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  );
}

function getServiceAccountObject() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    return JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8"),
    );
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  }

  const { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } = process.env;

  if (FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY && FIREBASE_PROJECT_ID) {
    return {
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      projectId: FIREBASE_PROJECT_ID,
    };
  }

  return null;
}

function getFirebaseAdminApp(): App {
  const existingApp = getApps()[0];

  if (existingApp) {
    return existingApp;
  }

  const serviceAccountObject = getServiceAccountObject();
  const serviceAccountPath = serviceAccountObject ? null : getServiceAccountPath();
  const credential = serviceAccountObject || serviceAccountPath
    ? cert(serviceAccountObject ?? serviceAccountPath ?? "")
    : applicationDefault();
  const storageBucket = getStorageBucketName();

  return initializeApp({
    credential,
    ...(storageBucket ? { storageBucket } : {}),
  });
}

export function getFirebaseAdmin() {
  const app = getFirebaseAdminApp();

  return {
    adminAuth: getAuth(app),
    adminDb: getFirestore(app),
    getAdminStorageBucket: () => {
      const storageBucket = getStorageBucketName();

      if (!storageBucket) {
        throw new Error(
          "Firebase Storage bucket is not configured. Set FIREBASE_STORAGE_BUCKET or NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.",
        );
      }

      return getStorage(app).bucket(storageBucket);
    },
    fieldValue: FieldValue,
  };
}
