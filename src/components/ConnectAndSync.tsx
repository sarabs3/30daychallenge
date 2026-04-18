"use client";

import { useState } from "react";

export function ConnectAndSync({ connected }: { connected: boolean }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  async function onSync() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/strava/sync", { method: "POST" });
      const data = (await response.json()) as { syncedCount?: number; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Sync failed");
      }
      setMessage(`Sync complete. ${data.syncedCount ?? 0} activities synced.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unexpected sync error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ marginBottom: "1rem" }}>
      <h2>1) Connect Strava</h2>
      {!connected ? (
        <a className="btn" href="/api/strava/auth">
          Connect your Strava account
        </a>
      ) : (
        <>
          <p className="muted">Strava account connected.</p>
          <button className="btn" onClick={onSync} disabled={loading}>
            {loading ? "Syncing..." : "Sync activities now"}
          </button>
        </>
      )}
      {message ? <p style={{ marginTop: "0.75rem" }}>{message}</p> : null}
    </div>
  );
}
