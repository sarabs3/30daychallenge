import { syncUserActivities } from "@/lib/sync";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("strava_user_id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "User not connected to Strava" }, { status: 401 });
  }

  const result = await syncUserActivities(userId);
  return NextResponse.json(result);
}
