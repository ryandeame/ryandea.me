import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { validateUsername } from "@/lib/usernames";

export type PublicBeenToBoxProfileData = {
  displayName: string;
  photoURL: string;
  uid: string;
  username: string;
};

export async function getPublicBeenToBoxProfile(usernameParam: string) {
  const validation = validateUsername(usernameParam);

  if (!validation.ok) {
    return null;
  }

  const { adminDb } = getFirebaseAdmin();
  const usernameSnapshot = await adminDb
    .collection("usernames")
    .doc(validation.username)
    .get();

  if (!usernameSnapshot.exists) {
    return null;
  }

  const uid = usernameSnapshot.data()?.uid;

  if (typeof uid !== "string" || !uid) {
    return null;
  }

  const userSnapshot = await adminDb.collection("users").doc(uid).get();
  const profile = userSnapshot.exists ? userSnapshot.data() : {};

  return {
    displayName:
      typeof profile?.displayName === "string" && profile.displayName
        ? profile.displayName
        : validation.username,
    photoURL: typeof profile?.photoURL === "string" ? profile.photoURL : "",
    uid,
    username: validation.username,
  } satisfies PublicBeenToBoxProfileData;
}
