import { NextResponse } from "next/server";
import { z } from "zod";

import { requireFirebaseRequestUser } from "@/lib/firebase-auth-server";
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

export async function POST(req: Request) {
  try {
    const user = await requireFirebaseRequestUser(req);

    const body = await req.json();
    const { image, locationId } = coverPhotoSchema.parse(body);
    const { adminDb, fieldValue } = getFirebaseAdmin();
    const coverImageWidth = image.width ?? null;
    const coverImageHeight = image.height ?? null;
    const coverImageRatio =
      coverImageWidth && coverImageHeight
        ? coverImageWidth / coverImageHeight
        : null;
    const userLocationRef = adminDb
      .collection("users")
      .doc(user.uid)
      .collection("locations")
      .doc(locationId);
    const userLocationSnapshot = await userLocationRef.get();

    if (!userLocationSnapshot.exists) {
      return NextResponse.json(
        { ok: false, error: "Location not found for this user" },
        { status: 404 },
      );
    }

    const imageSnapshot = await userLocationRef
      .collection("images")
      .doc(image.id)
      .get();

    if (!imageSnapshot.exists) {
      return NextResponse.json(
        { ok: false, error: "Image not found for this location" },
        { status: 404 },
      );
    }

    const imageData = imageSnapshot.data() ?? {};
    const imageDownloadURL =
      typeof imageData.downloadURL === "string" && imageData.downloadURL
        ? imageData.downloadURL
        : image.downloadURL;
    const imageStoragePath =
      typeof imageData.storagePath === "string" && imageData.storagePath
        ? imageData.storagePath
        : image.storagePath ?? "";
    const existingBentoInfoSnapshot = await userLocationRef
      .collection("meta")
      .doc("bento-info")
      .get();
    const existingBentoInfo = existingBentoInfoSnapshot.exists
      ? existingBentoInfoSnapshot.data()
      : {};
    const imageCount = Number.isFinite(existingBentoInfo?.imageCount)
      ? Number(existingBentoInfo?.imageCount)
      : null;

    await userLocationRef
      .collection("meta")
      .doc("bento-info")
      .set(
        {
          coverImageHeight,
          coverImageId: image.id,
          coverImagePath: imageStoragePath,
          coverImageRatio,
          coverImageUrl: imageDownloadURL,
          coverImageWidth,
          updatedAt: fieldValue.serverTimestamp(),
          updatedByUid: user.uid,
        },
        { merge: true },
      );

    await adminDb
      .collection("users")
      .doc(user.uid)
      .set(
        {
          locationsVersion: fieldValue.increment(1),
          updatedAt: fieldValue.serverTimestamp(),
          updatedBy: "app/api/been-to-box/cover-photo",
          updatedByUid: user.uid,
        },
        { merge: true },
      );

    const userSnapshot = await adminDb.collection("users").doc(user.uid).get();
    const username = userSnapshot.exists ? userSnapshot.data()?.username : "";

    if (typeof username === "string" && username) {
      const publicTopImageSnapshot = await adminDb
        .collection("publicProfiles")
        .doc(username)
        .collection("topImages")
        .where("locationId", "==", locationId)
        .limit(1)
        .get();
      const locationData = userLocationSnapshot.data() ?? {};

      if (!publicTopImageSnapshot.empty) {
        await publicTopImageSnapshot.docs[0].ref.set(
          {
            downloadURL: imageDownloadURL,
            height: coverImageHeight,
            imageCount,
            imageId: image.id,
            locationCountry:
              typeof locationData.country === "string" ? locationData.country : "",
            locationName:
              typeof locationData.name === "string"
                ? locationData.name
                : locationId,
            locationSlug:
              typeof locationData.slug === "string" ? locationData.slug : locationId,
            photoCount: imageCount,
            storagePath: imageStoragePath,
            updatedAt: fieldValue.serverTimestamp(),
            width: coverImageWidth,
          },
          { merge: true },
        );
      }
    }

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
