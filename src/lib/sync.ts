import { prisma } from "@/lib/prisma";
import { fetchAthleteActivities, refreshToken } from "@/lib/strava";

async function ensureValidToken(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const nowSec = Math.floor(Date.now() / 1000);

  if (user.stravaTokenExpiresAt.getTime() / 1000 > nowSec + 60) {
    return user;
  }

  const refreshed = await refreshToken(user.stravaRefreshToken);

  return prisma.user.update({
    where: { id: userId },
    data: {
      stravaAccessToken: refreshed.access_token,
      stravaRefreshToken: refreshed.refresh_token,
      stravaTokenExpiresAt: new Date(refreshed.expires_at * 1000),
    },
  });
}

export async function syncUserActivities(userId: string) {
  const user = await ensureValidToken(userId);
  let page = 1;
  let total = 0;

  while (true) {
    const activities = await fetchAthleteActivities(user.stravaAccessToken, page, 100);
    if (activities.length === 0) break;

    for (const activity of activities) {
      await prisma.activity.upsert({
        where: { stravaActivityId: activity.id },
        update: {
          name: activity.name,
          sportType: activity.sport_type,
          distanceMeters: activity.distance,
          movingTimeSec: activity.moving_time,
          elapsedTimeSec: activity.elapsed_time,
          totalElevationM: activity.total_elevation_gain,
          startDate: new Date(activity.start_date),
          userId: user.id,
        },
        create: {
          stravaActivityId: activity.id,
          name: activity.name,
          sportType: activity.sport_type,
          distanceMeters: activity.distance,
          movingTimeSec: activity.moving_time,
          elapsedTimeSec: activity.elapsed_time,
          totalElevationM: activity.total_elevation_gain,
          startDate: new Date(activity.start_date),
          userId: user.id,
        },
      });
      total += 1;
    }

    page += 1;
  }

  return { syncedCount: total };
}
