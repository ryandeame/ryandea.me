import { NextResponse } from "next/server";
import { z } from "zod";

import { requireFirebaseRequestUser } from "@/lib/firebase-auth-server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { validateUsername } from "@/lib/usernames";

export const runtime = "nodejs";

const usernameSchema = z.object({
  username: z.string().trim().min(1),
});

function buildPublicProfileUrl(req: Request, username: string) {
  const url = new URL(req.url);

  return `${url.origin}/been-to-box/${username}`;
}

export async function GET(req: Request) {
  try {
    const user = await requireFirebaseRequestUser(req);
    const { adminDb } = getFirebaseAdmin();
    const userSnapshot = await adminDb.collection("users").doc(user.uid).get();
    const profile = userSnapshot.exists ? userSnapshot.data() : {};
    const username = typeof profile?.username === "string" ? profile.username : "";

    return NextResponse.json({
      ok: true,
      profile: {
        displayName: typeof profile?.displayName === "string" ? profile.displayName : user.name ?? "",
        email: typeof profile?.email === "string" ? profile.email : user.email ?? "",
        photoURL: typeof profile?.photoURL === "string" ? profile.photoURL : user.picture ?? "",
        publicUrl: username ? buildPublicProfileUrl(req, username) : "",
        uid: user.uid,
        username,
      },
    });
  } catch (error) {
    console.error("[auth username] failed to load username", error);

    if (error instanceof Error && error.message === "Missing auth token") {
      return NextResponse.json(
        { ok: false, error: "Authentication is required" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { ok: false, error: "Unable to load profile" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireFirebaseRequestUser(req);
    const body = usernameSchema.parse(await req.json());
    const validation = validateUsername(body.username);

    if (!validation.ok) {
      return NextResponse.json(
        { ok: false, error: validation.reason },
        { status: 400 },
      );
    }

    const { adminDb, fieldValue } = getFirebaseAdmin();
    const username = validation.username;
    const userRef = adminDb.collection("users").doc(user.uid);
    const usernameRef = adminDb.collection("usernames").doc(username);

    await adminDb.runTransaction(async (transaction) => {
      const [userSnapshot, usernameSnapshot] = await Promise.all([
        transaction.get(userRef),
        transaction.get(usernameRef),
      ]);
      const claimedByUid = usernameSnapshot.exists
        ? usernameSnapshot.data()?.uid
        : null;

      if (claimedByUid && claimedByUid !== user.uid) {
        throw new Error("USERNAME_TAKEN");
      }

      const previousUsername = userSnapshot.exists
        ? userSnapshot.data()?.username
        : null;

      if (
        typeof previousUsername === "string" &&
        previousUsername &&
        previousUsername !== username
      ) {
        transaction.delete(adminDb.collection("usernames").doc(previousUsername));
      }

      transaction.set(
        usernameRef,
        {
          displayName: user.name ?? "",
          photoURL: user.picture ?? "",
          uid: user.uid,
          updatedAt: fieldValue.serverTimestamp(),
          username,
        },
        { merge: true },
      );
      transaction.set(
        userRef,
        {
          displayName: user.name ?? "",
          email: user.email ?? "",
          photoURL: user.picture ?? "",
          uid: user.uid,
          updatedAt: fieldValue.serverTimestamp(),
          username,
          usernameUpdatedAt: fieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    });

    return NextResponse.json({
      ok: true,
      profile: {
        publicUrl: buildPublicProfileUrl(req, username),
        uid: user.uid,
        username,
      },
    });
  } catch (error) {
    console.error("[auth username] failed to save username", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid username payload" },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === "Missing auth token") {
      return NextResponse.json(
        { ok: false, error: "Authentication is required" },
        { status: 401 },
      );
    }

    if (error instanceof Error && error.message === "USERNAME_TAKEN") {
      return NextResponse.json(
        { ok: false, error: "That username is already taken." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { ok: false, error: "Unable to save username" },
      { status: 500 },
    );
  }
}
