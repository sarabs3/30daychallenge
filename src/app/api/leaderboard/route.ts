import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const leaderboard = await prisma.user.findMany({
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

  const result = leaderboard
    .map((user) => {
      const totalDistance = user.activities.reduce((sum, a) => sum + a.distanceMeters, 0);
      const totalMovingTime = user.activities.reduce((sum, a) => sum + a.movingTimeSec, 0);
      return {
        id: user.id,
        name: `${user.firstname} ${user.lastname}`,
        profileImage: user.profileImage,
        totalDistance,
        totalMovingTime,
      };
    })
    .sort((a, b) => b.totalDistance - a.totalDistance);

  return NextResponse.json(result);
}
