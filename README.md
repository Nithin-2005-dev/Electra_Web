# Electra Website Platform

Production web platform for the Electra Society, NIT Silchar.

This repository is organized as a multi-app codebase with separate user and admin portals, shared domain concepts, and API-driven workflows for commerce, resources, and media operations.

## Overview

- Public/member experience: `electra-user-portal`
- Internal operations: `electra-admin-portal`
- Legacy archived app: `electra-user-portal_old`

## Monorepo Layout

```text
Electra_Web/
|-- electra-user-portal/        # primary website + member + order flows
|-- electra-admin-portal/       # internal operations portal
|-- electra-user-portal_old/    # archived legacy portal
|-- docs/                       # architecture and operational docs
\-- README.md
```

## Core Architecture

- Framework: Next.js App Router (independent apps)
- Authentication: Firebase Auth
- Admin verification: Firebase Admin SDK
- Operational datastore (orders/users): Firestore
- Content datastore (resources/team/images metadata): MongoDB + Mongoose
- Media: Cloudinary
- Notifications: Resend (email)
- Export pipelines: Excel (`xlsx`)

Detailed architecture: `docs/ARCHITECTURE.md`

## Documentation Index

- Architecture: `docs/ARCHITECTURE.md`
- API Reference: `docs/API_REFERENCE.md`
- Environment Variables: `docs/ENVIRONMENT.md`
- Development Workflow: `docs/DEVELOPMENT.md`

App-specific documentation:

- User portal: `electra-user-portal/README.md`
- Admin portal: `electra-admin-portal/README.md`
- Legacy portal: `electra-user-portal_old/README.md`

## Quick Start

1. Install dependencies in each app.

```bash
cd electra-user-portal
npm install

cd ../electra-admin-portal
npm install
```

2. Configure environment variables.

See `docs/ENVIRONMENT.md`.

3. Run both apps in separate terminals.

```bash
# terminal 1
cd electra-user-portal
npm run dev
```

```bash
# terminal 2
cd electra-admin-portal
npm run dev -p 3001
```

Local URLs:

- User portal: `http://localhost:3000`
- Admin portal: `http://localhost:3001`

## Maintenance Notes

- Keep server-only secrets out of client bundles.
- Treat `electra-user-portal_old` as read-only archival code unless migration work is planned.
- Update docs in `docs/` whenever route contracts, architecture boundaries, or environment keys change.
