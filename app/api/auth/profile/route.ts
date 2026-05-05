import { NextResponse } from "next/server";
import { z } from "zod";

import { requireFirebaseRequestUser } from "@/lib/firebase-auth-server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const profileSchema = z.object({
  displayName: z.string().trim().optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  photoURL: z.string().trim().url().optional().or(z.literal("")),
  providerIds: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const user = await requireFirebaseRequestUser(req);
    const body = profileSchema.parse(await req.json());
    const { adminDb, fieldValue } = getFirebaseAdmin();

    await adminDb
      .collection("users")
      .doc(user.uid)
      .set(
        {
          displayName: body.displayName || user.name || "",
          email: body.email || user.email || "",
          lastLoginAt: fieldValue.serverTimestamp(),
          photoURL: body.photoURL || user.picture || "",
          providerId: user.providerId || "",
          providerIds: body.providerIds ?? [],
          uid: user.uid,
          updatedAt: fieldValue.serverTimestamp(),
        },
        { merge: true },
      );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[auth profile] failed to sync profile", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid profile payload" },
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
      { ok: false, error: "Unable to sync profile" },
      { status: 500 },
    );
  }
}
