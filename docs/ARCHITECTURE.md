# Architecture

## System Topology

The platform uses two independent Next.js applications in one repository:

- `electra-user-portal`: public/member experience and order workflows
- `electra-admin-portal`: internal content and data operations

Both apps are deployed and run independently.

## Data and Service Boundaries

### User Portal

- Firebase Auth: user identity and session context
- Firestore: order and operational records used in order lifecycle flows
- MongoDB (Mongoose): resources, user profile metadata, team/image models
- Cloudinary: media storage/delivery
- Resend: transactional email notifications

### Admin Portal

- MongoDB (Mongoose): resource/team/image management
- Cloudinary: media upload and metadata workflows

## Security Model

- User authentication via Firebase Auth token.
- Admin route handlers in user portal validate identity/role using Firebase Admin SDK.
- Server-only secrets are accessed through non-public environment variables.

## Order Lifecycle Model

Canonical states observed in current implementation:

- Payment: `pending_verification`, `confirmed`, `rejected`
- Fulfillment item state: `placed`, `shipped`, `delivered`

Flow:

1. Checkout submits order/payment proof.
2. Admin approves/rejects payment.
3. Approved items move through shipping and delivery states.
4. Admin exports per-product fulfillment data to Excel.

## Deployment Considerations

- Keep both apps versioned together when API or schema contracts are shared.
- Update docs and environment templates before shipping route/schema changes.
