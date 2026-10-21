# AJK Government Portal (redesign concept)

A redesign of the official portal of the Azad Government of the State of Jammu & Kashmir (ajk.gov.pk), built as a pitch. It keeps the existing photos, departments, helplines and all 72 news stories, fixes the problems of the current site, and adds a full content management (admin) panel.

Built with Next.js 16.4 (App Router), React 19, TypeScript and Tailwind CSS 4.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 (or the port shown). The admin panel is at `/admin`.

The first admin account is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local` (see `.env.example`). After the first sign-in the password is stored only as a hash in `data/users.json`. Change it and turn on two-factor login from **My account**.

Production build:

```bash
npm run build
npm start
```

## What is where

| Path | What it is |
| --- | --- |
| `src/app/(site)` | Public pages: home, about, Kashmir cause, news, videos, departments, helplines, map, contact, search |
| `src/app/admin` | Admin panel: dashboard, every content section, media library, messages, settings, users, activity log, account |
| `src/app/admin/actions.ts` | All admin server actions (every one checks the signed-in user) |
| `src/lib/schema.ts` | Field definitions for every editable section. Add a field here and it appears in the admin form |
| `src/lib/store.ts` | Content store (JSON file). Swap for a database without touching the pages |
| `src/lib/auth.ts`, `src/lib/totp.ts` | Sessions, passwords, lockouts and two-factor login |
| `src/proxy.ts` | Content Security Policy with per-request nonce, admin protection |
| `data/seed.json` | Starting content (copied to `data/content.json` on first run) |
| `data/uploads/` | Files uploaded in the admin panel (served from `/media/...`) |
| `docs/PITCH_REPORT.md` | Problems found on the current site and how this version fixes them |
| `docs/SECURITY.md` | Security measures and the hosting checklist |

To reset the demo content, stop the server and delete `data/content.json`; it is recreated from `seed.json`.
