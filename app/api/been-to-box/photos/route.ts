import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { requireFirebaseRequestUser, type FirebaseRequestUser } from "@/lib/firebase-auth-server";
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

async function getLocationTarget(
  formValues: z.infer<typeof uploadSchema>,
  user: FirebaseRequestUser,
) {
  const { adminDb, fieldValue } = getFirebaseAdmin();
  const userLocationsRef = adminDb
    .collection("users")
    .doc(user.uid)
    .collection("locations");

  if (formValues.locationId) {
    const locationSnapshot = await userLocationsRef.doc(formValues.locationId).get();

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
  const locationRef = userLocationsRef.doc(slug);

  await locationRef.set(
    {
      country: formValues.country,
      createdByUid: user.uid,
      name,
      ownerUid: user.uid,
      slug,
      updatedAt: fieldValue.serverTimestamp(),
      updatedByUid: user.uid,
      userIds: fieldValue.arrayUnion(user.uid),
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
    const user = await requireFirebaseRequestUser(req);

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
    const location = await getLocationTarget(formValues, user);
    const userRef = adminDb.collection("users").doc(user.uid);
    const locationRef = userRef.collection("locations").doc(location.id);
    const uploadedImages = [];

    await locationRef.set(
      {
        lastContributedAt: fieldValue.serverTimestamp(),
        lastContributedByUid: user.uid,
        userIds: fieldValue.arrayUnion(user.uid),
      },
      { merge: true },
    );

    for (const file of files) {
      const fileName = getUploadFileName(file.name);
      const storagePath = `users/${user.uid}/locations/${location.slug}/${fileName}`;
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
      const imageRef = locationRef.collection("images").doc();

      await imageRef.set({
        contentType: "image/jpeg",
        createdAt: fieldValue.serverTimestamp(),
        downloadURL,
        fileName,
        imageDate: fieldValue.serverTimestamp(),
        originalFileName: file.name,
        ownerUid: user.uid,
        size: bytes.length,
        storagePath,
        uploadedByEmail: user.email ?? "",
        uploadedByName: user.name ?? "",
        uploadedByUid: user.uid,
      });

      uploadedImages.push({
        downloadURL,
        id: imageRef.id,
        storagePath,
      });
    }

    await locationRef
      .collection("meta")
      .doc("bento-info")
      .set(
        {
          imageCount: fieldValue.increment(uploadedImages.length),
          updatedAt: fieldValue.serverTimestamp(),
          updatedByUid: user.uid,
        },
        { merge: true },
      );

    await userRef
      .set(
        {
          locationsVersion: fieldValue.increment(1),
          updatedAt: fieldValue.serverTimestamp(),
          updatedBy: "app/api/been-to-box/photos",
          updatedByUid: user.uid,
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
