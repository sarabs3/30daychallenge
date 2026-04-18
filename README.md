# Strava Leaderboard (Next.js)

This is a Next.js project that lets users:

1. Connect their Strava account via OAuth
2. Sync activities into your platform database
3. View a leaderboard ranked by total distance

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env file and fill Strava credentials:

```bash
cp .env.example .env
```

3. Create a Strava API app and set callback URL:

- `http://localhost:3000/api/strava/callback`

4. Generate Prisma client and run migrations:

```bash
npx prisma migrate dev --name init
```

5. Start the app:

```bash
npm run dev
```

## Main Routes

- `GET /api/strava/auth`: starts Strava OAuth
- `GET /api/strava/callback`: receives Strava OAuth callback
- `POST /api/strava/sync`: pulls athlete activities from Strava
- `GET /api/leaderboard`: leaderboard API response

## Notes

- This starter uses cookie-based user session (`strava_user_id`) for simplicity.
- For production, use a proper auth layer and CSRF/session hardening.
