import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Auth is disabled in this app." },
    { status: 404 },
  );
}
