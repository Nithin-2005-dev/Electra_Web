# Environment Variables

This document lists environment keys referenced in source code.

## Conventions

- `NEXT_PUBLIC_*`: exposed to browser bundle. Never place secrets here.
- Non-public keys: server-only secrets.

## User Portal (`electra-user-portal/.env`)

### Firebase Client

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Firebase Admin (Server)

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`

### Database

- `MONGO_URL`

### Notifications and App URLs

- `RESEND_API_KEY`
- `ADMIN_EMAIL`
- `APP_BASE_URL`
- `NEXT_PUBLIC_APP_BASE_URL`

### Cloudinary

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

### Internal Security

- `ADMIN_APPROVAL_SECRET`

## Admin Portal (`electra-admin-portal/.env`)

### Database

- `MONGO_URL`

### Media

- Cloudinary variables required by the upload/delete implementation

## Secret Management Notes

- Do not commit `.env` files.
- Rotate leaked secrets immediately.
- In CI/CD, configure secrets at environment level (not in source).
