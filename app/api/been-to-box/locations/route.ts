import { NextResponse } from "next/server";

import { getFirebaseAdmin } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { adminDb } = getFirebaseAdmin();
    const snapshot = await adminDb.collection("locations").orderBy("name").get();
    const locations = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        country: typeof data.country === "string" ? data.country : "",
        id: doc.id,
        name: typeof data.name === "string" ? data.name : doc.id,
        slug: typeof data.slug === "string" ? data.slug : doc.id,
      };
    });

    return NextResponse.json({ ok: true, locations });
  } catch (error) {
    console.error("[been-to-box locations] failed to load", error);

    return NextResponse.json(
      { ok: false, error: "Unable to load locations" },
      { status: 500 },
    );
  }
}
