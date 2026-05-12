import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Been-To-Box has moved to its own app." },
    { status: 404 },
  );
}
