# Ryan Deame Portfolio

A high-impact personal portfolio built with Next.js, designed to sell capability at a glance.

This project combines a polished service-focused landing page with an experimental cinematic `/new-3d` experience, giving the site two different modes of persuasion:

- a conversion-minded homepage for real business work
- an immersive 3D portfolio route for visual punch and creative credibility

The result is a site that feels like both a product and a statement.

## Highlights

- App Router Next.js application with React 19 and TypeScript
- Tailwind CSS 4 styling with motion-heavy, high-contrast UI
- Dedicated `/new-3d` route with animated Three.js background visuals
- Services, projects, and contact flow designed for client acquisition
- Server-side contact endpoint with validation and SMTP delivery
- Production build ready with standalone output enabled

## Core Routes

- `/`
  The main portfolio and services landing page
- `/new-3d`
  A stylized 3D portfolio experience with animated visuals and editorial layout
- `/api/contact`
  Contact form submission endpoint powered by `nodemailer` and `zod`

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Three.js
- Nodemailer
- Zod

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the production server locally:

```bash
npm run start
```

Lint the project:

```bash
npm run lint
```

## Environment Variables

The contact API expects SMTP configuration in `.env.local`.

```env
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
CONTACT_TO=
CONTACT_SUBJECT_PREFIX=[PORTFOLIO]
```

Without these values, the contact endpoint will return an email configuration error.

## Project Structure

```text
app/
  page.tsx              # Main landing page
  new-3d/               # Alternate 3D portfolio route
  api/contact/route.ts  # Contact form API

components/
  Hero.tsx
  ServiceOfferings.tsx
  Projects.tsx
  ClientContactForm.tsx
  new-3d/               # Client-only 3D experience components

data/
  projects.ts           # Portfolio project content
```

## Why This Repo Exists

This is not a generic template. It is a live portfolio codebase built to communicate:

- technical range
- visual taste
- speed of execution
- business usefulness

It is meant to feel custom, confident, and hard to ignore.

## Build Notes

- The repository ignores local exploratory assets in `new_3D/`
- Local `worktrees/` content is ignored
- The app is configured with `output: "standalone"` in `next.config.ts`

## License

Private project unless otherwise specified by the repository owner.
