type LeaderboardEntry = {
  id: string;
  name: string;
  profileImage: string | null;
  totalDistance: number;
  totalMovingTime: number;
};

function metersToKm(meters: number): string {
  return (meters / 1000).toFixed(1);
}

function secondsToHours(seconds: number): string {
  return (seconds / 3600).toFixed(1);
}

export function LeaderboardTable({ rows }: { rows: LeaderboardEntry[] }) {
  return (
    <div className="card">
      <h2>2) Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Athlete</th>
            <th>Distance (km)</th>
            <th>Moving Time (hrs)</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="muted">
                No activities synced yet.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row.id}>
                <td>#{index + 1}</td>
                <td>{row.name}</td>
                <td>{metersToKm(row.totalDistance)}</td>
                <td>{secondsToHours(row.totalMovingTime)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
