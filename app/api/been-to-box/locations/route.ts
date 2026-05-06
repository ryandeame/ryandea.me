import { NextResponse } from "next/server";

import { requireFirebaseRequestUser } from "@/lib/firebase-auth-server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const user = await requireFirebaseRequestUser(req);
    const { adminDb } = getFirebaseAdmin();
    const snapshot = await adminDb
      .collection("users")
      .doc(user.uid)
      .collection("locations")
      .orderBy("name")
      .get();
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

    if (error instanceof Error && error.message === "Missing auth token") {
      return NextResponse.json(
        { ok: false, error: "Authentication is required" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { ok: false, error: "Unable to load locations" },
      { status: 500 },
    );
  }
}
