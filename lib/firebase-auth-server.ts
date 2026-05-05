import type { DecodedIdToken } from "firebase-admin/auth";

import { getFirebaseAdmin } from "@/lib/firebase-admin";

export type FirebaseRequestUser = Pick<
  DecodedIdToken,
  "email" | "name" | "picture" | "uid"
> & {
  providerId?: string;
};

export async function requireFirebaseRequestUser(req: Request): Promise<FirebaseRequestUser> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    throw new Error("Missing auth token");
  }

  const { adminAuth } = getFirebaseAdmin();
  const decodedToken = await adminAuth.verifyIdToken(token);

  return {
    email: decodedToken.email,
    name: decodedToken.name,
    picture: decodedToken.picture,
    providerId: decodedToken.firebase?.sign_in_provider,
    uid: decodedToken.uid,
  };
}
