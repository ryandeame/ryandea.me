import { NextResponse } from "next/server";
import { z } from "zod";

import { getFirebaseAdmin } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const bentoInfoSchema = z.object({
  locationIds: z.array(z.string().min(1)).max(25),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { locationIds } = bentoInfoSchema.parse(body);
    const { adminDb } = getFirebaseAdmin();
    const refs = locationIds.map((locationId) =>
      adminDb
        .collection("locations")
        .doc(locationId)
        .collection("meta")
        .doc("bento-info"),
    );
    const snapshots = refs.length > 0 ? await adminDb.getAll(...refs) : [];
    const bentoInfoByLocationId = Object.fromEntries(
      snapshots.map((snapshot, index) => {
        const data = snapshot.exists ? snapshot.data() : {};

        return [
          locationIds[index],
          {
            coverImageUrl:
              typeof data?.coverImageUrl === "string" ? data.coverImageUrl : null,
            imageCount:
              typeof data?.imageCount === "number" ? data.imageCount : null,
          },
        ];
      }),
    );

    return NextResponse.json({ ok: true, bentoInfoByLocationId });
  } catch (error) {
    console.error("[been-to-box bento-info] failed to load", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid bento-info payload" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { ok: false, error: "Unable to load bento info" },
      { status: 500 },
    );
  }
}
