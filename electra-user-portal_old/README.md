# Electra User Portal (Legacy Archive)

Archived legacy Next.js implementation of the Electra user portal.

## Status

- Lifecycle: Archived / read-only reference
- Active replacement: `../electra-user-portal`
- Intended use: historical reference, migration lookup, and diffing old behavior

## Important

- Do not treat this app as production-active.
- Do not add new features here unless explicitly requested for migration support.
- Prefer implementing fixes and enhancements in `electra-user-portal`.

## Running (Reference Only)

```bash
cd electra-user-portal_old
npm install
npm run dev
```

Default URL: `http://localhost:3000`

If you run it simultaneously with other apps, use a different port.

## Migration Guidance

When extracting logic from this archive:

1. Port behavior into `electra-user-portal` modules.
2. Validate route/API compatibility.
3. Remove dead compatibility code after verification.
