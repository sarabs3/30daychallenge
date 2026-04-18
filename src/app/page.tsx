import { ConnectAndSync } from "@/components/ConnectAndSync";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function getLeaderboard() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstname: true,
      lastname: true,
      profileImage: true,
      activities: {
        select: {
          distanceMeters: true,
          movingTimeSec: true,
        },
      },
    },
  });

  return users
    .map((user) => ({
      id: user.id,
      name: `${user.firstname} ${user.lastname}`,
      profileImage: user.profileImage,
      totalDistance: user.activities.reduce((sum, a) => sum + a.distanceMeters, 0),
      totalMovingTime: user.activities.reduce((sum, a) => sum + a.movingTimeSec, 0),
    }))
    .sort((a, b) => b.totalDistance - a.totalDistance);
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const connected = Boolean(cookieStore.get("strava_user_id")?.value);
  const leaderboard = await getLeaderboard();

  return (
    <main>
      <h1>Strava Leaderboard Platform</h1>
      <p className="muted">
        Connect athlete accounts, sync activities, and rank athletes by total distance.
      </p>
      <ConnectAndSync connected={connected} />
      <LeaderboardTable rows={leaderboard} />
    </main>
  );
}
