import { buildStravaAuthorizeUrl } from "@/lib/strava";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const state = randomUUID();
  const cookieStore = await cookies();

  cookieStore.set("strava_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  return NextResponse.redirect(buildStravaAuthorizeUrl(state));
}
