# Development Workflow

## Recommended Local Setup

1. Install Node.js 20+.
2. Install dependencies in both active apps.
3. Configure environment files.
4. Start apps in separate terminals.

```bash
# user portal
cd electra-user-portal
npm install
npm run dev
```

```bash
# admin portal
cd electra-admin-portal
npm install
npm run dev -p 3001
```

## Branching and Changes

- Keep changes scoped by concern (docs, frontend, API, schema).
- Update docs in the same change-set when API contracts or architecture change.

## Verification Checklist

Before merging:

- App boots successfully.
- Critical pages render (home, merch, checkout, admin orders).
- API routes touched by change are exercised manually.
- Export flows (Excel) still produce expected columns.
- README/docs updated.

## Documentation Standards

- Root README: platform-level and navigation.
- App README: implementation and runbook for that app.
- `docs/API_REFERENCE.md`: route inventory and method contracts.
- `docs/ENVIRONMENT.md`: key references and secret handling policy.

## Legacy Code Policy

- `electra-user-portal_old` is archival.
- Do not add net-new functionality there.
- If migration is required, port to active app and document assumptions.
