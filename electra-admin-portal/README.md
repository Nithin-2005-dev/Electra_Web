# Electra Admin Portal

Internal administrative Next.js application for operational data and media management.

## Purpose

This portal is focused on internal workflows for:

- Gallery image metadata and lifecycle operations
- Team records upload/list/delete
- Resource records upload/list/delete

## Technology Stack

- Next.js `14.2.35` (App Router)
- React `18`
- MongoDB + Mongoose
- Cloudinary integration
- Bootstrap + React-Bootstrap

## Directory Structure

```text
electra-admin-portal/
|-- src/
|   |-- app/
|   |   |-- api/
|   |   |   |-- image-upload, getImg, deleteImg
|   |   |   |-- uploadTeam, getTeam, deleteTeam
|   |   |   \-- res-upload, getRes, deleteRes
|   |   |-- database/                # MongoDB connection setup
|   |   |-- pages/                   # admin-facing routes
|   |   |-- store/
|   |   \-- utils/
|   |-- components/
|   \-- models/
\-- package.json
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Environment Configuration

Create `electra-admin-portal/.env`.

Required keys:

- `MONGO_URL`
- Cloudinary variables used by upload/delete logic

See `../docs/ENVIRONMENT.md` for environment conventions.

## Local Development

```bash
cd electra-admin-portal
npm install
npm run dev
```

Default URL: `http://localhost:3000`

If running alongside the user portal:

```bash
npm run dev -p 3001
```

## Production Build

```bash
npm run build
npm run start
```

## Operational Notes

- APIs are implemented as route handlers under `src/app/api/*/route.js`.
- Mongo connectivity is centralized in `src/app/database/dbConfig.js`.
- This app is intended for internal/admin use only.
