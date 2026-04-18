import { env } from "@/lib/env";

const STRAVA_BASE_URL = "https://www.strava.com/api/v3";
const STRAVA_OAUTH_URL = "https://www.strava.com/oauth";

export type StravaTokenResponse = {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: {
    id: number;
    firstname: string;
    lastname: string;
    profile?: string;
  };
};

export type StravaActivity = {
  id: number;
  name: string;
  sport_type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: string;
};

export function buildStravaAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: env.STRAVA_CLIENT_ID,
    response_type: "code",
    redirect_uri: env.STRAVA_REDIRECT_URI,
    approval_prompt: "force",
    scope: "read,activity:read_all",
    state,
  });

  return `${STRAVA_OAUTH_URL}/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<StravaTokenResponse> {
  const response = await fetch(`${STRAVA_OAUTH_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.STRAVA_CLIENT_ID,
      client_secret: env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange Strava code for token");
  }

  return (await response.json()) as StravaTokenResponse;
}

export async function refreshToken(refreshToken: string): Promise<StravaTokenResponse> {
  const response = await fetch(`${STRAVA_OAUTH_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.STRAVA_CLIENT_ID,
      client_secret: env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Strava token");
  }

  return (await response.json()) as StravaTokenResponse;
}

export async function fetchAthleteActivities(
  accessToken: string,
  page = 1,
  perPage = 100,
): Promise<StravaActivity[]> {
  const response = await fetch(
    `${STRAVA_BASE_URL}/athlete/activities?page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Strava activities");
  }

  return (await response.json()) as StravaActivity[];
}
