import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { getFirebaseAdmin } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const MAX_FILES = 5;

const uploadSchema = z.object({
  city: z.string().trim().optional(),
  country: z.string().trim().optional(),
  locationId: z.string().trim().optional(),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createDownloadUrl(bucketName: string, storagePath: string, token: string) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
    storagePath,
  )}?alt=media&token=${token}`;
}

function getUploadFileName(fileName: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.jpg$/i.test(
    fileName,
  )
    ? fileName.toLowerCase()
    : `${randomUUID()}.jpg`;
}

async function assertAuthorized(req: Request) {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    throw new Error("Missing auth token");
  }

  const { adminAuth } = getFirebaseAdmin();
  await adminAuth.verifyIdToken(token);
}

async function getLocationTarget(formValues: z.infer<typeof uploadSchema>) {
  const { adminDb, fieldValue } = getFirebaseAdmin();

  if (formValues.locationId) {
    const locationSnapshot = await adminDb.collection("locations").doc(formValues.locationId).get();

    if (!locationSnapshot.exists) {
      throw new Error("Selected location does not exist");
    }

    const data = locationSnapshot.data() ?? {};
    const slug = typeof data.slug === "string" && data.slug.length > 0
      ? data.slug
      : locationSnapshot.id;

    return {
      id: locationSnapshot.id,
      name: typeof data.name === "string" ? data.name : slug,
      slug,
    };
  }

  if (!formValues.city || !formValues.country) {
    throw new Error("City and country are required for a new location");
  }

  const slug = slugify(`${formValues.city}-${formValues.country}`);
  const name = `${formValues.city}, ${formValues.country}`;
  const locationRef = adminDb.collection("locations").doc(slug);

  await locationRef.set(
    {
      country: formValues.country,
      name,
      slug,
      updatedAt: fieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return {
    id: slug,
    name,
    slug,
  };
}

export async function POST(req: Request) {
  try {
    await assertAuthorized(req);

    const formData = await req.formData();
    const formValues = uploadSchema.parse({
      city: formData.get("city")?.toString(),
      country: formData.get("country")?.toString(),
      locationId: formData.get("locationId")?.toString(),
    });
    const files = formData
      .getAll("photos")
      .filter((value): value is File => value instanceof File && value.size > 0);

    if (files.length === 0 || files.length > MAX_FILES) {
      return NextResponse.json(
        { ok: false, error: "Upload between 1 and 5 photos" },
        { status: 400 },
      );
    }

    const { adminDb, fieldValue, getAdminStorageBucket } = getFirebaseAdmin();
    const adminStorageBucket = getAdminStorageBucket();
    const location = await getLocationTarget(formValues);
    const uploadedImages = [];

    for (const file of files) {
      const fileName = getUploadFileName(file.name);
      const storagePath = `travel/${location.slug}/${fileName}`;
      const token = randomUUID();
      const bytes = Buffer.from(await file.arrayBuffer());
      const storageFile = adminStorageBucket.file(storagePath);

      await storageFile.save(bytes, {
        contentType: "image/jpeg",
        metadata: {
          cacheControl: "public, max-age=31536000, immutable",
          metadata: {
            firebaseStorageDownloadTokens: token,
          },
        },
        resumable: false,
      });

      const downloadURL = createDownloadUrl(adminStorageBucket.name, storagePath, token);
      const imageRef = adminDb.collection("locations").doc(location.id).collection("images").doc();

      await imageRef.set({
        contentType: "image/jpeg",
        createdAt: fieldValue.serverTimestamp(),
        downloadURL,
        fileName,
        imageDate: fieldValue.serverTimestamp(),
        originalFileName: file.name,
        size: bytes.length,
        storagePath,
      });

      uploadedImages.push({
        downloadURL,
        id: imageRef.id,
        storagePath,
      });
    }

    await adminDb
      .collection("locations")
      .doc(location.id)
      .collection("meta")
      .doc("bento-info")
      .set(
        {
          imageCount: fieldValue.increment(uploadedImages.length),
          updatedAt: fieldValue.serverTimestamp(),
        },
        { merge: true },
      );

    await adminDb
      .collection("appMetadata")
      .doc("beenToBox")
      .set(
        {
          locationsVersion: fieldValue.increment(1),
          updatedAt: fieldValue.serverTimestamp(),
          updatedBy: "app/api/been-to-box/photos",
        },
        { merge: true },
      );

    return NextResponse.json({ ok: true, location, uploadedImages });
  } catch (error) {
    console.error("[been-to-box photos] failed to upload", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid upload payload" },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === "Missing auth token") {
      return NextResponse.json(
        { ok: false, error: "Authentication is required" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to upload photos",
      },
      { status: 500 },
    );
  }
}
