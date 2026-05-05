import { NextResponse } from "next/server";
import { z } from "zod";

import { getFirebaseAdmin } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const coverPhotoSchema = z.object({
  image: z.object({
    downloadURL: z.string().url(),
    height: z.number().positive().nullable().optional(),
    id: z.string().min(1),
    storagePath: z.string().optional(),
    width: z.number().positive().nullable().optional(),
  }),
  locationId: z.string().min(1),
});

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

export async function POST(req: Request) {
  try {
    await assertAuthorized(req);

    const body = await req.json();
    const { image, locationId } = coverPhotoSchema.parse(body);
    const { adminDb, fieldValue } = getFirebaseAdmin();
    const coverImageWidth = image.width ?? null;
    const coverImageHeight = image.height ?? null;
    const coverImageRatio =
      coverImageWidth && coverImageHeight
        ? coverImageWidth / coverImageHeight
        : null;

    await adminDb
      .collection("locations")
      .doc(locationId)
      .collection("meta")
      .doc("bento-info")
      .set(
        {
          coverImageHeight,
          coverImageId: image.id,
          coverImagePath: image.storagePath ?? "",
          coverImageRatio,
          coverImageUrl: image.downloadURL,
          coverImageWidth,
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
          updatedBy: "app/api/been-to-box/cover-photo",
        },
        { merge: true },
      );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[been-to-box cover-photo] failed to update", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid cover photo payload" },
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
      { ok: false, error: "Unable to update cover photo" },
      { status: 500 },
    );
  }
}
