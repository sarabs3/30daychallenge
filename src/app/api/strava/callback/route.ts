import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { exchangeCodeForToken } from "@/lib/strava";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("strava_oauth_state")?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.json({ error: "Invalid OAuth response" }, { status: 400 });
  }

  const tokenData = await exchangeCodeForToken(code);

  const user = await prisma.user.upsert({
    where: { stravaAthleteId: tokenData.athlete.id },
    update: {
      firstname: tokenData.athlete.firstname,
      lastname: tokenData.athlete.lastname,
      profileImage: tokenData.athlete.profile ?? null,
      stravaAccessToken: tokenData.access_token,
      stravaRefreshToken: tokenData.refresh_token,
      stravaTokenExpiresAt: new Date(tokenData.expires_at * 1000),
    },
    create: {
      stravaAthleteId: tokenData.athlete.id,
      firstname: tokenData.athlete.firstname,
      lastname: tokenData.athlete.lastname,
      profileImage: tokenData.athlete.profile ?? null,
      stravaAccessToken: tokenData.access_token,
      stravaRefreshToken: tokenData.refresh_token,
      stravaTokenExpiresAt: new Date(tokenData.expires_at * 1000),
    },
  });

  cookieStore.set("strava_user_id", user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}?connected=1`);
}
